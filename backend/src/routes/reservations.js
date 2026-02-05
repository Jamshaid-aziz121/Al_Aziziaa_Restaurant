/**
 * Reservation routes for the Aziz Restaurant Platform
 */

const express = require('express');
const router = express.Router();

const reservationController = require('../controllers/reservationController');
const { validate } = require('../middleware/validation');
const { reservationSchema, updateReservationSchema } = require('../../../shared/schemas/reservationSchema');

// Create a new reservation
router.post('/', validate(reservationSchema), reservationController.create);

// Get reservation by ID
router.get('/:id', reservationController.getById);

// Get reservations by customer ID
router.get('/customer/:customerId', reservationController.getByCustomer);

// Get reservations for the authenticated customer
router.get('/my-reservations', reservationController.getMyReservations);

// Update reservation
router.put('/:id', validate(updateReservationSchema), reservationController.update);

// Cancel reservation
router.patch('/:id/cancel', reservationController.cancel);

// Check availability
router.get('/availability/check', reservationController.checkAvailability);

// Get available time slots
router.get('/availability/slots', reservationController.getAvailableTimeSlots);

module.exports = router;