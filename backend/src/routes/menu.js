/**
 * Menu routes for the Aziz Restaurant Platform
 */

const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menuController');
const { validate } = require('../middleware/validation');
const { menuItemSchema, updateMenuItemSchema } = require('../../../shared/schemas/menuSchema');

// Get all menu items
router.get('/', menuController.getAll);

// Get menu items by category
router.get('/category/:category', menuController.getByCategory);

// Get menu items by dietary restrictions
router.get('/dietary', menuController.getByDietary);

// Get menu item by ID
router.get('/:id', menuController.getById);

// Create a new menu item (admin only)
router.post('/', validate(menuItemSchema), menuController.create);

// Update a menu item (admin only)
router.put('/:id', validate(updateMenuItemSchema), menuController.update);

// Delete a menu item (admin only)
router.delete('/:id', menuController.deleteItem);

// Toggle menu item availability (admin only)
router.patch('/:id/toggle-availability', menuController.toggleAvailability);

// Get all menu categories
router.get('/categories', menuController.getCategories);

// Get featured menu items
router.get('/featured', menuController.getFeatured);

// Get current seasonal menu items
router.get('/seasonal', menuController.getCurrentSeasonal);

module.exports = router;