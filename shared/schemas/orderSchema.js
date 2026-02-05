/**
 * Order schema for the Aziz Restaurant Platform
 */

const Joi = require('joi');

const orderSchema = Joi.object({
  customerId: Joi.string().uuid().required(),
  orderType: Joi.string().valid('DELIVERY', 'PICKUP', 'DINE_IN').required(),
  totalAmount: Joi.number().positive().required(),
  taxAmount: Joi.number().min(0).optional(),
  tipAmount: Joi.number().min(0).default(0),
  deliveryFee: Joi.number().min(0).default(0),
  paymentMethod: Joi.string().valid('CREDIT_CARD', 'DEBIT_CARD', 'CASH_ON_DELIVERY', 'DIGITAL_WALLET').optional(),
  deliveryAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).when('orderType', { is: 'DELIVERY', then: Joi.required(), otherwise: Joi.optional() }),
  specialInstructions: Joi.string().max(500).optional(),
  pickupTime: Joi.date().iso().optional(),
  deliveryTime: Joi.date().iso().optional(),
});

const updateOrderSchema = Joi.object({
  status: Joi.string().valid('RECEIVED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED').optional(),
  paymentStatus: Joi.string().valid('PENDING', 'PAID', 'FAILED', 'REFUNDED').optional(),
  specialInstructions: Joi.string().max(500).optional(),
});

const orderItemSchema = Joi.object({
  menuItemId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().positive().required(),
  specialInstructions: Joi.string().max(200).optional(),
});

module.exports = {
  orderSchema,
  updateOrderSchema,
  orderItemSchema,
};