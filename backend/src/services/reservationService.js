/**
 * Reservation service for the Aziz Restaurant Platform
 */

const { prisma } = require('../utils/database');
const { RESERVATION_STATUS } = require('../../../shared/constants/reservationStatus');
const logger = require('../utils/logger');
const { sendReservationConfirmation } = require('./notificationService');

/**
 * Creates a new reservation
 * @param {Object} reservationData - Reservation data to create
 * @returns {Promise<Object>} Created reservation
 */
const createReservation = async (reservationData) => {
  try {
    // Check for existing reservations that conflict with the requested time
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        reservationDate: reservationData.reservationDate,
        reservationTime: reservationData.reservationTime,
        status: { in: ['PENDING', 'CONFIRMED'] }, // Only check pending/confirmed reservations
        partySize: { lte: reservationData.partySize + 20 }, // Check if table can accommodate requested party size
      },
    });

    if (existingReservation) {
      throw new Error('Table not available for the selected time and party size');
    }

    // Generate a unique confirmation code
    const confirmationCode = `RES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create the reservation
    const reservation = await prisma.reservation.create({
      data: {
        ...reservationData,
        status: RESERVATION_STATUS.CONFIRMED, // Automatically confirm the reservation
        confirmationCode,
      },
    });

    // Get customer details for email notification
    const customer = await prisma.customer.findUnique({
      where: { id: reservation.customerId },
    });

    if (customer) {
      // Send confirmation email asynchronously
      sendReservationConfirmation(reservation, customer).catch(error => {
        logger.error(`Failed to send confirmation email: ${error.message}`);
      });
    } else {
      logger.warn(`Customer not found for reservation ${reservation.id}, skipping confirmation email`);
    }

    logger.info(`Reservation created: ${reservation.id}`);
    return reservation;
  } catch (error) {
    logger.error(`Failed to create reservation: ${error.message}`);
    throw error;
  }
};

/**
 * Gets a reservation by ID
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>} Reservation data
 */
const getReservationById = async (id) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        customer: true,
      },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    return reservation;
  } catch (error) {
    logger.error(`Failed to get reservation: ${error.message}`);
    throw error;
  }
};

/**
 * Gets reservations by customer ID
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} List of reservations
 */
const getReservationsByCustomerId = async (customerId) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { customerId },
      orderBy: { reservationDate: 'desc' },
      include: {
        customer: true,
      },
    });

    return reservations;
  } catch (error) {
    logger.error(`Failed to get reservations for customer ${customerId}: ${error.message}`);
    throw error;
  }
};

/**
 * Updates a reservation
 * @param {string} id - Reservation ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated reservation
 */
const updateReservation = async (id, updateData) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    // Get customer details for email notification if status changed
    if (updateData.status) {
      const customer = await prisma.customer.findUnique({
        where: { id: reservation.customerId },
      });

      if (customer) {
        // In a real implementation, we'd send status update emails
        logger.info(`Status update notification would be sent to ${customer.email} for reservation ${id}`);
      }
    }

    logger.info(`Reservation updated: ${id}`);
    return reservation;
  } catch (error) {
    logger.error(`Failed to update reservation ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Cancels a reservation
 * @param {string} id - Reservation ID
 * @returns {Promise<Object>} Updated reservation
 */
const cancelReservation = async (id) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: RESERVATION_STATUS.CANCELLED },
    });

    // Get customer details for email notification
    const customer = await prisma.customer.findUnique({
      where: { id: reservation.customerId },
    });

    if (customer) {
      // Send cancellation confirmation email asynchronously
      // In a real implementation, we'd have a specific cancellation email function
      logger.info(`Cancellation notification would be sent to ${customer.email}`);
    }

    logger.info(`Reservation cancelled: ${id}`);
    return reservation;
  } catch (error) {
    logger.error(`Failed to cancel reservation ${id}: ${error.message}`);
    throw error;
  }
};

/**
 * Checks availability for a given date, time, and party size
 * @param {Date} date - Reservation date
 * @param {string} time - Reservation time
 * @param {number} partySize - Number of guests
 * @returns {Promise<boolean>} Whether the time is available
 */
const checkAvailability = async (date, time, partySize) => {
  try {
    // This is a simplified availability check
    // In a real-world application, this would consider:
    // - Table capacities
    // - Restaurant operating hours
    // - Buffer time between reservations
    // - Existing reservations

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        reservationDate: date,
        reservationTime: time,
        partySize: { gte: partySize }, // Check if any existing reservation takes up space needed
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    return !existingReservation;
  } catch (error) {
    logger.error(`Failed to check availability: ${error.message}`);
    throw error;
  }
};

/**
 * Gets available time slots for a given date and party size
 * @param {Date} date - Reservation date
 * @param {number} partySize - Number of guests
 * @returns {Promise<Array>} Available time slots
 */
const getAvailableTimeSlots = async (date, partySize) => {
  try {
    // Define restaurant hours (9 AM to 10 PM)
    const restaurantHours = Array.from({ length: 13 }, (_, i) => {
      const hour = i + 9; // 9 AM to 10 PM
      return `${hour.toString().padStart(2, '0')}:00`;
    });

    // Find all reservations for the given date
    const existingReservations = await prisma.reservation.findMany({
      where: {
        reservationDate: date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    // Filter out busy time slots
    const availableSlots = restaurantHours.filter(time => {
      const isBusy = existingReservations.some(res =>
        res.reservationTime === time && res.partySize >= partySize
      );
      return !isBusy;
    });

    return availableSlots;
  } catch (error) {
    logger.error(`Failed to get available time slots: ${error.message}`);
    throw error;
  }
};

/**
 * Gets all reservations (admin function)
 * @returns {Promise<Array>} List of all reservations
 */
const getAllReservations = async () => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return reservations;
  } catch (error) {
    logger.error(`Failed to get all reservations: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createReservation,
  getReservationById,
  getReservationsByCustomerId,
  getAllReservations, // Added for admin functionality
  updateReservation,
  cancelReservation,
  checkAvailability,
  getAvailableTimeSlots,
};