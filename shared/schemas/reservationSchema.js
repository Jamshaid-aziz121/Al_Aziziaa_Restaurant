/**
 * Reservation schema for the Aziz Restaurant Platform
 */

const Joi = require('joi');

const reservationSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  reservationDate: Joi.date().iso().required(),
  reservationTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  partySize: Joi.number().integer().min(1).max(20).required(),
  specialRequests: Joi.string().optional().allow('').max(500),
  tableNumber: Joi.string().optional(),
  durationMinutes: Joi.number().integer().min(30).max(240).default(90),
});

const updateReservationSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW', 'COMPLETED').optional(),
  specialRequests: Joi.string().optional().allow('').max(500),
});

module.exports = {
  reservationSchema,
  updateReservationSchema,
};