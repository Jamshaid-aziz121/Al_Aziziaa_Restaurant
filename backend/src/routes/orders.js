/**
 * Order routes for the Aziz Restaurant Platform
 */

const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const { validate } = require('../middleware/validation');
const { orderSchema, updateOrderSchema, orderItemSchema } = require('../../../shared/schemas/orderSchema');

// Create a new order
router.post('/', validate(orderSchema), orderController.create);

// Get order by ID
router.get('/:id', orderController.getById);

// Get order by tracking ID
router.get('/tracking/:trackingId', orderController.getByTrackingId);

// Get orders by customer ID
router.get('/customer/:customerId', orderController.getByCustomer);

// Update order
router.put('/:id', validate(updateOrderSchema), orderController.update);

// Update order status
router.patch('/:id/status', orderController.updateStatus);

// Add item to order
router.post('/:id/items', validate(orderItemSchema), orderController.addItem);

// Remove item from order
router.delete('/:id/items/:itemid', orderController.removeItem);

module.exports = router;