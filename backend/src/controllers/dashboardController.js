/**
 * Dashboard controller for the Aziz Restaurant Platform
 */

const {
  getReservationsByCustomerId,
  getMyReservations,
} = require('../services/reservationService');

const {
  getOrdersByCustomerId,
} = require('../services/orderService');

/**
 * Gets customer dashboard data (reservations and orders)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCustomerDashboard = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    // Get reservations and orders in parallel
    const [reservations, orders] = await Promise.all([
      getReservationsByCustomerId(customerId),
      getOrdersByCustomerId(customerId)
    ]);

    // Sort by date/time (most recent first)
    reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: {
        reservations,
        orders,
        stats: {
          totalReservations: reservations.length,
          totalOrders: orders.length,
          upcomingReservations: reservations.filter(r => new Date(r.reservationDate) >= new Date()).length,
          pendingOrders: orders.filter(o => ['RECEIVED', 'PREPARING'].includes(o.status)).length,
        }
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets authenticated customer's dashboard data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMyDashboard = async (req, res) => {
  try {
    // In a real implementation, the customer ID would come from the authenticated user
    // For demo purposes, we'll use a mock customer ID
    const customerId = req.user ? req.user.id : 'mock-customer-id';

    // Get reservations and orders in parallel
    const [reservations, orders] = await Promise.all([
      getMyReservations(), // This function already handles getting reservations for the current user
      getOrdersByCustomerId(customerId)
    ]);

    // Sort by date/time (most recent first)
    reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: {
        reservations,
        orders,
        stats: {
          totalReservations: reservations.length,
          totalOrders: orders.length,
          upcomingReservations: reservations.filter(r => new Date(r.reservationDate) >= new Date()).length,
          pendingOrders: orders.filter(o => ['RECEIVED', 'PREPARING'].includes(o.status)).length,
        }
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets upcoming reservations and orders for a customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUpcoming = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const now = new Date();

    // Get reservations and orders in parallel
    const [reservations, orders] = await Promise.all([
      getReservationsByCustomerId(customerId),
      getOrdersByCustomerId(customerId)
    ]);

    // Filter for upcoming items
    const upcomingReservations = reservations.filter(r => new Date(r.reservationDate) >= now);
    const upcomingOrders = orders.filter(o =>
      ['RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'READY_FOR_PICKUP'].includes(o.status)
    );

    // Sort by date/time (earliest first)
    upcomingReservations.sort((a, b) => new Date(a.reservationDate) - new Date(b.reservationDate));
    upcomingOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      data: {
        reservations: upcomingReservations,
        orders: upcomingOrders,
        nextEvent: getNextEvent(upcomingReservations, upcomingOrders),
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Helper function to get the next upcoming event
 */
const getNextEvent = (reservations, orders) => {
  const allEvents = [];

  // Add reservations
  reservations.forEach(res => {
    allEvents.push({
      type: 'reservation',
      id: res.id,
      date: new Date(res.reservationDate),
      time: res.reservationTime,
      title: `Reservation for ${res.partySize} people`,
      status: res.status
    });
  });

  // Add orders
  orders.forEach(order => {
    allEvents.push({
      type: 'order',
      id: order.id,
      date: new Date(order.createdAt),
      time: order.pickupTime || order.deliveryTime,
      title: `Order #${order.trackingId}`,
      status: order.status
    });
  });

  // Sort by date/time (earliest first)
  allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

  return allEvents[0] || null;
};

module.exports = {
  getCustomerDashboard,
  getMyDashboard,
  getUpcoming,
};