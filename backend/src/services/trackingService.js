/**
 * Tracking service for the Aziz Restaurant Platform
 */

const { prisma } = require('../utils/database');
const { ORDER_STATUS } = require('../../../shared/constants/orderStatus');
const logger = require('../utils/logger');
const { emitOrderStatusUpdate } = require('../utils/websocket');

/**
 * Gets order status history by order ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Array>} List of status history records
 */
const getOrderStatusHistory = async (orderId) => {
  try {
    const statusHistory = await prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { timestamp: 'asc' },
    });

    return statusHistory;
  } catch (error) {
    logger.error(`Failed to get order status history for order ${orderId}: ${error.message}`);
    throw error;
  }
};

/**
 * Gets current order status by order ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Current status and timestamp
 */
const getCurrentOrderStatus = async (orderId) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        status: true,
        updatedAt: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return {
      status: order.status,
      timestamp: order.updatedAt,
    };
  } catch (error) {
    logger.error(`Failed to get current order status for order ${orderId}: ${error.message}`);
    throw error;
  }
};

/**
 * Gets order status by tracking ID
 * @param {string} trackingId - Order tracking ID
 * @returns {Promise<Object>} Order with status and status history
 */
const getOrderStatusByTrackingId = async (trackingId) => {
  try {
    const order = await prisma.order.findUnique({
      where: { trackingId },
      include: {
        orderItems: {
          include: {
            menuItem: true,
          },
        },
        statusHistory: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    logger.error(`Failed to get order status by tracking ID ${trackingId}: ${error.message}`);
    throw error;
  }
};

/**
 * Updates order status and creates status history record
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status for the order
 * @param {string} updatedBy - Who updated the status
 * @param {string} notes - Optional notes about the status change
 * @returns {Promise<Object>} Updated order
 */
const updateOrderStatus = async (orderId, newStatus, updatedBy, notes) => {
  try {
    // Validate the new status is a valid order status
    if (!Object.values(ORDER_STATUS).includes(newStatus)) {
      throw new Error(`Invalid order status: ${newStatus}`);
    }

    // Update the order status
    const order = await prisma.order.update({
      where: { id: orderId },
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
        orderId,
        status: newStatus,
        notes: notes || `Status updated to ${newStatus}`,
        updatedBy: updatedBy || 'system',
      },
    });

    // Emit WebSocket notification for real-time updates
    const statusUpdateData = {
      orderId,
      status: newStatus,
      timestamp: statusHistory.timestamp,
      notes: statusHistory.notes,
      updatedBy: statusHistory.updatedBy,
    };

    emitOrderStatusUpdate(orderId, statusUpdateData);

    logger.info(`Order status updated: ${orderId} -> ${newStatus}`);
    return order;
  } catch (error) {
    logger.error(`Failed to update order status ${orderId}: ${error.message}`);
    throw error;
  }
};

/**
 * Gets estimated time for order status
 * @param {string} orderId - Order ID
 * @param {string} status - Target status
 * @returns {Promise<Date>} Estimated time for status
 */
const getEstimatedTimeForStatus = async (orderId, status) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Calculate estimated time based on status
    const now = new Date();
    let estimatedTime = new Date(now);

    switch (status) {
      case ORDER_STATUS.PREPARING:
        // If order is received, preparing starts in ~5 mins
        if (order.status === ORDER_STATUS.RECEIVED) {
          estimatedTime.setMinutes(estimatedTime.getMinutes() + 5);
        } else {
          estimatedTime = order.updatedAt;
        }
        break;
      case ORDER_STATUS.READY:
        // If order is preparing, it will be ready in ~15-25 mins depending on complexity
        if (order.status === ORDER_STATUS.PREPARING) {
          estimatedTime.setMinutes(estimatedTime.getMinutes() + 20);
        } else {
          estimatedTime = order.updatedAt;
        }
        break;
      case ORDER_STATUS.OUT_FOR_DELIVERY:
      case ORDER_STATUS.READY_FOR_PICKUP:
        // If order is ready, delivery/pickup happens in ~5 mins
        if (order.status === ORDER_STATUS.READY) {
          estimatedTime.setMinutes(estimatedTime.getMinutes() + 5);
        } else {
          estimatedTime = order.updatedAt;
        }
        break;
      case ORDER_STATUS.COMPLETED:
        // If order is out for delivery or ready for pickup, completion in ~10-20 mins
        if (order.status === ORDER_STATUS.OUT_FOR_DELIVERY || order.status === ORDER_STATUS.READY_FOR_PICKUP) {
          estimatedTime.setMinutes(estimatedTime.getMinutes() + 15);
        } else {
          estimatedTime = order.updatedAt;
        }
        break;
      default:
        estimatedTime = order.updatedAt;
    }

    return estimatedTime;
  } catch (error) {
    logger.error(`Failed to get estimated time for order ${orderId}: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getOrderStatusHistory,
  getCurrentOrderStatus,
  getOrderStatusByTrackingId,
  updateOrderStatus,
  getEstimatedTimeForStatus,
};