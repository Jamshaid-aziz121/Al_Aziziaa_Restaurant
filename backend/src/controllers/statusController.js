/**
 * Status controller for the Aziz Restaurant Platform
 */

const {
  getOrderStatusHistory,
  getCurrentOrderStatus,
  getOrderStatusByTrackingId,
  updateOrderStatus,
  getEstimatedTimeForStatus,
} = require('../services/trackingService');

/**
 * Gets order status history by order ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStatusHistory = async (req, res) => {
  try {
    const statusHistory = await getOrderStatusHistory(req.params.orderId);
    res.status(200).json({
      success: true,
      data: statusHistory,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets current order status by order ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCurrentStatus = async (req, res) => {
  try {
    const currentStatus = await getCurrentOrderStatus(req.params.orderId);
    res.status(200).json({
      success: true,
      data: currentStatus,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets order status by tracking ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getStatusByTrackingId = async (req, res) => {
  try {
    const order = await getOrderStatusByTrackingId(req.params.trackingId);
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
 * Updates order status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateStatus = async (req, res) => {
  try {
    const { status, updatedBy, notes } = req.body;
    const order = await updateOrderStatus(req.params.orderId, status, updatedBy, notes);
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
 * Gets estimated time for a specific status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEstimatedTime = async (req, res) => {
  try {
    const { status } = req.query;
    const estimatedTime = await getEstimatedTimeForStatus(req.params.orderId, status);
    res.status(200).json({
      success: true,
      data: { estimatedTime },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStatusHistory,
  getCurrentStatus,
  getStatusByTrackingId,
  updateStatus,
  getEstimatedTime,
};