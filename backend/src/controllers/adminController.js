/**
 * Admin controller for the Aziz Restaurant Platform
 */

const {
  getReservationsByCustomerId,
  getMyReservations,
  getReservationById,
  getAllReservations,
  updateReservation,
  cancelReservation
} = require('../services/reservationService');

const {
  getOrdersByCustomerId,
  getOrderById,
  getAllOrders,
  updateOrder,
  updateOrderStatus
} = require('../services/orderService');

const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../services/menuService');

const {
  getCustomers,
  getCustomerById,
  updateCustomer,
  createCustomer
} = require('../services/customerService');

/**
 * Gets admin dashboard statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAdminDashboard = async (req, res) => {
  try {
    // Get various statistics in parallel
    const [totalOrders, totalReservations, totalCustomers, menuItems] = await Promise.all([
      getAllOrders(),
      getAllReservations(),
      getCustomers(), // assuming this function exists
      getMenuItems()
    ]);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    // Calculate daily stats
    const dailyOrders = totalOrders.filter(order => new Date(order.createdAt) >= todayStart);
    const dailyReservations = totalReservations.filter(res => new Date(res.createdAt) >= todayStart);

    // Calculate weekly stats
    const weeklyOrders = totalOrders.filter(order => new Date(order.createdAt) >= weekStart);
    const weeklyReservations = totalReservations.filter(res => new Date(res.createdAt) >= weekStart);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalOrders: totalOrders.length,
          totalReservations: totalReservations.length,
          totalCustomers: totalCustomers.length,
          totalMenuItems: menuItems.length,
          dailyOrders: dailyOrders.length,
          dailyReservations: dailyReservations.length,
          weeklyOrders: weeklyOrders.length,
          weeklyReservations: weeklyReservations.length,
          revenueToday: dailyOrders.reduce((sum, order) => sum + order.totalAmount, 0),
          revenueWeek: weeklyOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        },
        recentActivity: {
          recentOrders: totalOrders.slice(0, 5),
          recentReservations: totalReservations.slice(0, 5),
        }
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets all reservations for admin view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllReservationsController = async (req, res) => {
  try {
    const reservations = await getAllReservations();
    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets all orders for admin view
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Updates an order status (admin function)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, updatedBy, notes } = req.body;

    const order = await updateOrderStatus(orderId, status, updatedBy, notes);
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
 * Updates a reservation (admin function)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateReservationController = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const updateData = req.body;

    const reservation = await updateReservation(reservationId, updateData);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAllReservations: getAllReservationsController,
  getAllOrders: getAllOrdersController,
  updateOrderStatus: updateOrderStatusController,
  updateReservation: updateReservationController,
};