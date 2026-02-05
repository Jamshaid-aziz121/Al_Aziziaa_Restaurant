/**
 * Status routes for the Aziz Restaurant Platform
 */

const express = require('express');
const router = express.Router();

const statusController = require('../controllers/statusController');

// Get order status history by order ID
router.get('/orders/:orderId/history', statusController.getStatusHistory);

// Get current order status by order ID
router.get('/orders/:orderId/current', statusController.getCurrentStatus);

// Get order status by tracking ID
router.get('/orders/tracking/:trackingId', statusController.getStatusByTrackingId);

// Update order status
router.put('/orders/:orderId/status', statusController.updateStatus);

// Get estimated time for a specific status
router.get('/orders/:orderId/estimate', statusController.getEstimatedTime);

module.exports = router;