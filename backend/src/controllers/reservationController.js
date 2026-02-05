/**
 * Reservation controller for the Aziz Restaurant Platform
 */

const {
  createReservation,
  getReservationById,
  getReservationsByCustomerId,
  updateReservation,
  cancelReservation,
  checkAvailability,
  getAvailableTimeSlots,
} = require('../services/reservationService');

const { validate } = require('../middleware/validation');
const { reservationSchema, updateReservationSchema } = require('../../../shared/schemas/reservationSchema');

/**
 * Creates a new reservation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const create = async (req, res) => {
  try {
    const reservation = await createReservation(req.body);
    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets a reservation by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getById = async (req, res) => {
  try {
    const reservation = await getReservationById(req.params.id);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets reservations by customer ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getByCustomer = async (req, res) => {
  try {
    const reservations = await getReservationsByCustomerId(req.params.customerId);
    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets all reservations for the authenticated customer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMyReservations = async (req, res) => {
  try {
    // In a real implementation, the customer ID would come from the authenticated user
    // For demo purposes, we'll use a mock customer ID
    const customerId = req.user ? req.user.id : 'mock-customer-id';
    const reservations = await getReservationsByCustomerId(customerId);
    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Updates a reservation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const update = async (req, res) => {
  try {
    const reservation = await updateReservation(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Cancels a reservation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const cancel = async (req, res) => {
  try {
    const reservation = await cancelReservation(req.params.id);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Checks availability for a given date, time, and party size
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const checkAvailabilityController = async (req, res) => {
  try {
    const { date, time, partySize } = req.query;

    if (!date || !time || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'Date, time, and partySize are required',
      });
    }

    const isAvailable = await checkAvailability(new Date(date), time, parseInt(partySize));
    res.status(200).json({
      success: true,
      data: { available: isAvailable },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Gets available time slots for a given date and party size
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAvailableTimeSlotsController = async (req, res) => {
  try {
    const { date, partySize } = req.query;

    if (!date || !partySize) {
      return res.status(400).json({
        success: false,
        message: 'Date and partySize are required',
      });
    }

    const availableSlots = await getAvailableTimeSlots(new Date(date), parseInt(partySize));
    res.status(200).json({
      success: true,
      data: { availableSlots },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getById,
  getByCustomer,
  getMyReservations,
  update,
  cancel,
  checkAvailability: checkAvailabilityController,
  getAvailableTimeSlots: getAvailableTimeSlotsController,
};