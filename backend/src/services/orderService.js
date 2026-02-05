/**
 * Order service for the Aziz Restaurant Platform
 */

const { prisma } = require('../utils/database');
const { ORDER_STATUS } = require('../../../shared/constants/orderStatus');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('./notificationService');
const logger = require('../utils/logger');
const { emitOrderStatusUpdate } = require('../utils/websocket');

/**
 * Creates a new order
 * @param {Object} orderData - Order data to create
 * @returns {Promise<Object>} Created order
 */
const createOrder = async (orderData) => {
  try {
    // Generate a unique tracking ID
    const trackingId = `ORD-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Calculate total amount based on order items
    let totalAmount = orderData.items.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);

    // Add delivery fee if applicable
    if (orderData.orderType === 'DELIVERY') {
      totalAmount += orderData.deliveryFee || 0;
    }

    // Add tax if applicable
    const taxRate = 0.08; // 8% tax rate
    const taxAmount = totalAmount * taxRate;
    totalAmount += taxAmount;

    // Create the order
    const order = await prisma.order.create({
      data: {
        ...orderData,
        trackingId,
        totalAmount,
        taxAmount,
        status: ORDER_STATUS.RECEIVED,
      },
      include: {
        orderItems: true,
      },
    });

    // Get customer details for email notification
    const customer = await prisma.customer.findUnique({
      where: { id: order.customerId },
    });

    if (customer) {
      // Send confirmation email asynchronously
      sendOrderConfirmation(order, customer).catch(error => {
        logger.error(`Failed to send order confirmation email: ${error.message}`);
      });
    } else {
      logger.warn(`Customer not found for order ${order.id}, skipping confirmation email`);
    }

    logger.info(`Order created: ${order.id}`);
    return order;
  } catch (error) {
    logger.error(`Failed to create order: ${error.message}`);
    throw error;
  }
};

/**
 * Gets an order by ID
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Order data
 */
const getOrderById = async (id) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    logger.error(`Failed to get order: ${error.message}`);
    throw error;
  }
};

/**
 * Gets an order by tracking ID
 * @param {string} trackingId - Order tracking ID
 * @returns {Promise<Object>} Order data
 */
const getOrderByTrackingId = async (trackingId) => {
  try {
    const order = await prisma.order.findUnique({
      where: { trackingId },
      include: {
        customer: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    logger.error(`Failed to get order by tracking ID: ${error.message}`);
    throw error;
  }
};

/**
 * Gets orders by customer ID
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} List of orders
 */
const getOrdersByCustomerId = async (customerId) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return orders;
  } catch (error) {
    logger.error(`Failed to get orders for customer ${customerId}: ${error.message}`);
    throw error;
  }
};

/**
 * Updates an order
 * @param {string} id - Order ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated order
 */
const updateOrder = async (id, updateData) => {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
      },
    });

    // If status was updated, send notification
    if (updateData.status) {
      const customer = order.customer;
      if (customer) {
        sendOrderStatusUpdate(order, updateData.status, customer).catch(error => {
          logger.error(`Failed to send order status update email: ${error.message}`);
        });
      }
    }

    logger.info(`Order updated: ${id}`);
    return order;
  } catch (error) {
    logger.error(`Failed to update order ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Updates order status and creates status history record
 * @param {string} id - Order ID
 * @param {string} newStatus - New status for the order
 * @param {string} updatedBy - Who updated the status
 * @param {string} notes - Optional notes about the status change
 * @returns {Promise<Object>} Updated order
 */
const updateOrderStatus = async (id, newStatus, updatedBy, notes) => {
  try {
    // Update the order status
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: newStatus,
      },
      include: {
        customer: true,
      },
    });

    // Create a status history record
    const statusHistory = await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status: newStatus,
        notes: notes || `Status updated to ${newStatus}`,
        updatedBy: updatedBy || 'system',
      },
    });

    // Send status update notification
    const customer = order.customer;
    if (customer) {
      sendOrderStatusUpdate(order, newStatus, customer).catch(error => {
        logger.error(`Failed to send order status update email: ${error.message}`);
      });
    }

    // Emit WebSocket notification for real-time updates
    const statusUpdateData = {
      orderId: id,
      status: newStatus,
      timestamp: statusHistory.timestamp,
      notes: statusHistory.notes,
      updatedBy: statusHistory.updatedBy,
    };

    emitOrderStatusUpdate(id, statusUpdateData);

    logger.info(`Order status updated: ${id} -> ${newStatus}`);
    return order;
  } catch (error) {
    logger.error(`Failed to update order status ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Adds an item to an existing order
 * @param {string} orderId - Order ID
 * @param {Object} itemData - Item data to add
 * @returns {Promise<Object>} Updated order
 */
const addItemToOrder = async (orderId, itemData) => {
  try {
    // Add the item to the order
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        ...itemData,
      },
    });

    // Recalculate the order total
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    let newTotal = orderItems.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);

    // Add delivery fee and tax
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (order.orderType === 'DELIVERY') {
      newTotal += order.deliveryFee || 0;
    }

    const taxRate = 0.08;
    const newTaxAmount = newTotal * taxRate;
    newTotal += newTaxAmount;

    // Update the order with the new total
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: newTotal,
        taxAmount: newTaxAmount,
      },
    });

    logger.info(`Item added to order: ${orderId}`);
    return updatedOrder;
  } catch (error) {
    logger.error(`Failed to add item to order ${orderId}: ${error.message}`);
    throw error;
  }
};

/**
 * Removes an item from an order
 * @param {string} orderItemId - Order item ID
 * @returns {Promise<Object>} Updated order
 */
const removeItemFromOrder = async (orderItemId) => {
  try {
    // Get the order item to identify the order
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    if (!orderItem) {
      throw new Error('Order item not found');
    }

    // Remove the item
    await prisma.orderItem.delete({
      where: { id: orderItemId },
    });

    // Recalculate the order total
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: orderItem.orderId },
    });

    let newTotal = orderItems.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);

    // Add delivery fee and tax
    const order = await prisma.order.findUnique({
      where: { id: orderItem.orderId },
    });

    if (order.orderType === 'DELIVERY') {
      newTotal += order.deliveryFee || 0;
    }

    const taxRate = 0.08;
    const newTaxAmount = newTotal * taxRate;
    newTotal += newTaxAmount;

    // Update the order with the new total
    const updatedOrder = await prisma.order.update({
      where: { id: orderItem.orderId },
      data: {
        totalAmount: newTotal,
        taxAmount: newTaxAmount,
      },
    });

    logger.info(`Item removed from order: ${orderItem.orderId}`);
    return updatedOrder;
  } catch (error) {
    logger.error(`Failed to remove item from order: ${error.message}`);
    throw error;
  }
};

/**
 * Gets all orders (admin function)
 * @returns {Promise<Array>} List of all orders
 */
const getAllOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  } catch (error) {
    logger.error(`Failed to get all orders: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrderByTrackingId,
  getOrdersByCustomerId,
  getAllOrders, // Added for admin functionality
  updateOrder,
  updateOrderStatus,
  addItemToOrder,
  removeItemFromOrder,
};