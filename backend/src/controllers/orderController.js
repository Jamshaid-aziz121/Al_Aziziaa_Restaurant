/**
 * Order controller for the Aziz Restaurant Platform
 */

const {
  createOrder,
  getOrderById,
  getOrderByTrackingId,
  getOrdersByCustomerId,
  updateOrder,
  updateOrderStatus,
  addItemToOrder,
  removeItemFromOrder,
} = require('../services/orderService');

const { validate } = require('../middleware/validation');
const { orderSchema, updateOrderSchema, orderItemSchema } = require('../../../shared/schemas/orderSchema');

/**
 * Creates a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const create = async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets an order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getById = async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets an order by tracking ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getByTrackingId = async (req, res) => {
  try {
    const order = await getOrderByTrackingId(req.params.trackingId);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets orders by customer ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getByCustomer = async (req, res) => {
  try {
    const orders = await getOrdersByCustomerId(req.params.customerId);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Updates an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const update = async (req, res) => {
  try {
    const order = await updateOrder(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Updates order status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateStatus = async (req, res) => {
  try {
    const { status, updatedBy, notes } = req.body;
    const order = await updateOrderStatus(req.params.id, status, updatedBy, notes);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Adds an item to an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addItem = async (req, res) => {
  try {
    const order = await addItemToOrder(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Removes an item from an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeItem = async (req, res) => {
  try {
    const order = await removeItemFromOrder(req.params.itemid);
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getById,
  getByTrackingId,
  getByCustomer,
  update,
  updateStatus,
  addItem,
  removeItem,
};