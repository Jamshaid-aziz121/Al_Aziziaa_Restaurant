/**
 * Menu schema for the Aziz Restaurant Platform
 */

const Joi = require('joi');

const menuItemSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().required(),
  category: Joi.string().min(1).max(50).required(),
  dietaryIndicators: Joi.array().items(Joi.string()).optional(),
  available: Joi.boolean().default(true),
  featured: Joi.boolean().default(false),
  seasonal: Joi.boolean().default(false),
  seasonStart: Joi.date().iso().optional(),
  seasonEnd: Joi.date().iso().optional(),
  imagePath: Joi.string().uri().optional(),
  calories: Joi.number().integer().min(0).optional(),
});

const updateMenuItemSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().positive().optional(),
  category: Joi.string().min(1).max(50).optional(),
  dietaryIndicators: Joi.array().items(Joi.string()).optional(),
  available: Joi.boolean().optional(),
  featured: Joi.boolean().optional(),
  seasonal: Joi.boolean().optional(),
  seasonStart: Joi.date().iso().optional(),
  seasonEnd: Joi.date().iso().optional(),
  imagePath: Joi.string().uri().optional(),
  calories: Joi.number().integer().min(0).optional(),
});

module.exports = {
  menuItemSchema,
  updateMenuItemSchema,
};