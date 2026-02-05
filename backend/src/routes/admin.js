/**
 * Admin routes for the Aziz Restaurant Platform
 */

const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

// Admin dashboard
router.get('/dashboard', adminController.getAdminDashboard);

// Manage reservations
router.get('/reservations', adminController.getAllReservations);
router.put('/reservations/:reservationId', adminController.updateReservation);

// Manage orders
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);

module.exports = router;