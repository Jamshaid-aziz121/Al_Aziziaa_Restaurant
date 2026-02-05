/**
 * Menu controller for the Aziz Restaurant Platform
 */

const {
  getAllMenuItems,
  getMenuItemsByCategory,
  getMenuItemsByDietary,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
  getMenuCategories,
  getFeaturedMenuItems,
} = require('../services/menuService');

const { validate } = require('../middleware/validation');
const { menuItemSchema, updateMenuItemSchema } = require('../../../shared/schemas/menuSchema');

/**
 * Gets all menu items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAll = async (req, res) => {
  try {
    const menuItems = await getAllMenuItems();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets menu items by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getByCategory = async (req, res) => {
  try {
    const menuItems = await getMenuItemsByCategory(req.params.category);
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets menu items by dietary restrictions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getByDietary = async (req, res) => {
  try {
    const dietaryRestrictions = req.query.dietary ? req.query.dietary.split(',') : [];
    const menuItems = await getMenuItemsByDietary(dietaryRestrictions);
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets a menu item by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getById = async (req, res) => {
  try {
    const menuItem = await getMenuItemById(req.params.id);
    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Creates a new menu item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const create = async (req, res) => {
  try {
    const menuItem = await createMenuItem(req.body);
    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Updates a menu item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const update = async (req, res) => {
  try {
    const menuItem = await updateMenuItem(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Deletes a menu item
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteItem = async (req, res) => {
  try {
    const menuItem = await deleteMenuItem(req.params.id);
    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Toggles menu item availability
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const toggleAvailability = async (req, res) => {
  try {
    const menuItem = await toggleMenuItemAvailability(req.params.id);
    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets all menu categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCategories = async (req, res) => {
  try {
    const categories = await getMenuCategories();
    res.status(200).json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets featured menu items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFeatured = async (req, res) => {
  try {
    const featuredItems = await getFeaturedMenuItems();
    res.status(200).json({
      success: true,
      data: featuredItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets current seasonal menu items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCurrentSeasonal = async (req, res) => {
  try {
    const seasonalItems = await getCurrentSeasonalMenuItems();
    res.status(200).json({
      success: true,
      data: seasonalItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAll,
  getByCategory,
  getByDietary,
  getById,
  create,
  update,
  deleteItem,
  toggleAvailability,
  getCategories,
  getFeatured,
  getCurrentSeasonal,
};