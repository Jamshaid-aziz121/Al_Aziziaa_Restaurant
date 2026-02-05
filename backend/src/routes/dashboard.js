/**
 * Dashboard routes for the Aziz Restaurant Platform
 */

const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');

// Get customer dashboard data (reservations and orders)
router.get('/customer/:customerId', dashboardController.getCustomerDashboard);

// Get authenticated customer's dashboard data
router.get('/my-dashboard', dashboardController.getMyDashboard);

// Get upcoming reservations and orders
router.get('/customer/:customerId/upcoming', dashboardController.getUpcoming);

module.exports = router;