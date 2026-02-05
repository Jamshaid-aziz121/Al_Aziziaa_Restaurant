/**
 * Customer service for the Aziz Restaurant Platform
 */

const { prisma } = require('../utils/database');
const logger = require('../utils/logger');

/**
 * Gets all customers (admin function)
 * @returns {Promise<Array>} List of all customers
 */
const getCustomers = async () => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        reservations: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Only include last 5 reservations
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5, // Only include last 5 orders
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return customers;
  } catch (error) {
    logger.error(`Failed to get customers: ${error.message}`);
    throw error;
  }
};

/**
 * Gets a customer by ID
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} Customer data
 */
const getCustomerById = async (id) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        reservations: {
          orderBy: { createdAt: 'desc' },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  } catch (error) {
    logger.error(`Failed to get customer: ${error.message}`);
    throw error;
  }
};

/**
 * Updates a customer
 * @param {string} id - Customer ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated customer
 */
const updateCustomer = async (id, updateData) => {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Customer updated: ${id}`);
    return customer;
  } catch (error) {
    logger.error(`Failed to update customer ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Creates a customer
 * @param {Object} customerData - Customer data to create
 * @returns {Promise<Object>} Created customer
 */
const createCustomer = async (customerData) => {
  try {
    // Check if customer with email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: customerData.email },
    });

    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }

    const customer = await prisma.customer.create({
      data: customerData,
    });

    logger.info(`Customer created: ${customer.id}`);
    return customer;
  } catch (error) {
    logger.error(`Failed to create customer: ${error.message}`);
    throw error;
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomer,
  createCustomer,
};