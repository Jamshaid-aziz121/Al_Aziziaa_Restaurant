/**
 * Status schema for the Aziz Restaurant Platform
 */

const Joi = require('joi');

const orderStatusHistorySchema = Joi.object({
  orderId: Joi.string().uuid().required(),
  status: Joi.string().valid('RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED').required(),
  notes: Joi.string().max(500).optional(),
  updatedBy: Joi.string().max(100).required(),
});

const reservationStatusHistorySchema = Joi.object({
  reservationId: Joi.string().uuid().required(),
  status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW', 'COMPLETED').required(),
  notes: Joi.string().max(500).optional(),
  updatedBy: Joi.string().max(100).required(),
});

module.exports = {
  orderStatusHistorySchema,
  reservationStatusHistorySchema,
};