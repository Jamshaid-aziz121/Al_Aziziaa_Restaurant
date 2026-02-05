/**
 * Menu service for the Aziz Restaurant Platform
 */

const { prisma } = require('../utils/database');
const logger = require('../utils/logger');

/**
 * Gets all menu items
 * @returns {Promise<Array>} List of menu items
 */
const getAllMenuItems = async () => {
  try {
    const today = new Date();
    const menuItems = await prisma.menuItem.findMany({
      where: {
        available: true,
        AND: [
          { OR: [{ seasonal: false }, { seasonal: true }] },
          {
            OR: [
              { seasonal: false },
              { AND: [{ seasonStart: { lte: today } }, { seasonEnd: { gte: today } }] },
              { seasonal: false }
            ]
          }
        ]
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return menuItems;
  } catch (error) {
    logger.error(`Failed to get menu items: ${error.message}`);
    throw error;
  }
};

/**
 * Gets menu items by category
 * @param {string} category - Category to filter by
 * @returns {Promise<Array>} List of menu items
 */
const getMenuItemsByCategory = async (category) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        category: category,
        available: true,
      },
      orderBy: { name: 'asc' },
    });

    return menuItems;
  } catch (error) {
    logger.error(`Failed to get menu items by category ${category}: ${error.message}`);
    throw error;
  }
};

/**
 * Gets menu items by dietary restrictions
 * @param {Array<string>} dietaryRestrictions - Dietary restrictions to filter by
 * @returns {Promise<Array>} List of menu items
 */
const getMenuItemsByDietary = async (dietaryRestrictions) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: {
        available: true,
        dietaryIndicators: {
          hasSome: dietaryRestrictions,
        },
      },
      orderBy: { name: 'asc' },
    });

    return menuItems;
  } catch (error) {
    logger.error(`Failed to get menu items by dietary restrictions: ${error.message}`);
    throw error;
  }
};

/**
 * Gets a menu item by ID
 * @param {string} id - Menu item ID
 * @returns {Promise<Object>} Menu item
 */
const getMenuItemById = async (id) => {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    return menuItem;
  } catch (error) {
    logger.error(`Failed to get menu item ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Creates a new menu item
 * @param {Object} menuItemData - Menu item data to create
 * @returns {Promise<Object>} Created menu item
 */
const createMenuItem = async (menuItemData) => {
  try {
    const menuItem = await prisma.menuItem.create({
      data: menuItemData,
    });

    logger.info(`Menu item created: ${menuItem.id}`);
    return menuItem;
  } catch (error) {
    logger.error(`Failed to create menu item: ${error.message}`);
    throw error;
  }
};

/**
 * Updates a menu item
 * @param {string} id - Menu item ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated menu item
 */
const updateMenuItem = async (id, updateData) => {
  try {
    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Menu item updated: ${id}`);
    return menuItem;
  } catch (error) {
    logger.error(`Failed to update menu item ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Deletes a menu item
 * @param {string} id - Menu item ID
 * @returns {Promise<Object>} Deleted menu item
 */
const deleteMenuItem = async (id) => {
  try {
    const menuItem = await prisma.menuItem.delete({
      where: { id },
    });

    logger.info(`Menu item deleted: ${id}`);
    return menuItem;
  } catch (error) {
    logger.error(`Failed to delete menu item ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Toggles menu item availability
 * @param {string} id - Menu item ID
 * @returns {Promise<Object>} Updated menu item
 */
const toggleMenuItemAvailability = async (id) => {
  try {
    const menuItem = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!menuItem) {
      throw new Error('Menu item not found');
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        available: !menuItem.available,
      },
    });

    logger.info(`Menu item availability toggled: ${id}, now ${updatedMenuItem.available ? 'available' : 'unavailable'}`);
    return updatedMenuItem;
  } catch (error) {
    logger.error(`Failed to toggle menu item availability ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Gets all menu categories
 * @returns {Promise<Array>} List of categories
 */
const getMenuCategories = async () => {
  try {
    const categories = await prisma.menuItem.groupBy({
      by: ['category'],
      where: {
        available: true,
      },
    });

    return categories.map(cat => cat.category);
  } catch (error) {
    logger.error(`Failed to get menu categories: ${error.message}`);
    throw error;
  }
};

/**
 * Gets featured menu items
 * @returns {Promise<Array>} List of featured menu items
 */
const getFeaturedMenuItems = async () => {
  try {
    const featuredItems = await prisma.menuItem.findMany({
      where: {
        available: true,
        featured: true,
      },
      orderBy: { name: 'asc' },
    });

    return featuredItems;
  } catch (error) {
    logger.error(`Failed to get featured menu items: ${error.message}`);
    throw error;
  }
};

/**
 * Gets seasonal menu items currently in season
 * @returns {Promise<Array>} List of seasonal menu items
 */
const getCurrentSeasonalMenuItems = async () => {
  try {
    const today = new Date();
    const seasonalItems = await prisma.menuItem.findMany({
      where: {
        available: true,
        seasonal: true,
        seasonStart: { lte: today },
        seasonEnd: { gte: today },
      },
      orderBy: { name: 'asc' },
    });

    return seasonalItems;
  } catch (error) {
    logger.error(`Failed to get seasonal menu items: ${error.message}`);
    throw error;
  }
};

module.exports = {
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
};