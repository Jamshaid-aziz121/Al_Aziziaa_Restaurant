/**
 * Notification service for the Aziz Restaurant Platform
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a reservation confirmation email
 * @param {Object} reservation - Reservation data
 * @param {Object} customer - Customer data
 * @returns {Promise<void>}
 */
const sendReservationConfirmation = async (reservation, customer) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@azizrestaurant.com',
      to: customer.email,
      subject: 'Your Reservation Confirmation - Aziz Restaurant',
      html: `
        <h2>Reservation Confirmed!</h2>
        <p>Dear ${customer.firstName} ${customer.lastName},</p>

        <p>Your reservation at Aziz Restaurant has been confirmed. Here are the details:</p>

        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date(reservation.reservationDate).toLocaleDateString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${reservation.reservationTime}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Party Size:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${reservation.partySize} ${reservation.partySize === 1 ? 'person' : 'people'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Confirmation Code:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${reservation.confirmationCode}</td>
          </tr>
          ${reservation.specialRequests ? `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Special Requests:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${reservation.specialRequests}</td>
          </tr>
          ` : ''}
        </table>

        <p>Please arrive a few minutes early for your reservation. If you need to make any changes or cancel your reservation, please contact us as soon as possible.</p>

        <p>We look forward to serving you!</p>

        <p>Best regards,<br/>The Aziz Restaurant Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Reservation confirmation email sent to ${customer.email}. Message ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send reservation confirmation email: ${error.message}`);
    throw error;
  }
};

/**
 * Sends an order confirmation email
 * @param {Object} order - Order data
 * @param {Object} customer - Customer data
 * @returns {Promise<void>}
 */
const sendOrderConfirmation = async (order, customer) => {
  try {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@azizrestaurant.com',
      to: customer.email,
      subject: `Order Confirmation #${order.trackingId} - Aziz Restaurant`,
      html: `
        <h2>Order Confirmed!</h2>
        <p>Dear ${customer.firstName} ${customer.lastName},</p>

        <p>Your order from Aziz Restaurant has been confirmed. Here are the details:</p>

        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Order ID:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.trackingId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Order Type:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.orderType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total Amount:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">$${order.totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.status}</td>
          </tr>
        </table>

        ${order.deliveryAddress ? `
        <h3>Delivery Information</h3>
        <p>Address: ${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}</p>
        ` : `
        <h3>Pickup Information</h3>
        <p>Please pick up your order at our restaurant.</p>
        `}

        ${order.specialInstructions ? `
        <h3>Special Instructions</h3>
        <p>${order.specialInstructions}</p>
        ` : ''}

        <p>You can track your order status using the tracking ID provided above.</p>

        <p>Thank you for ordering with us!</p>

        <p>Best regards,<br/>The Aziz Restaurant Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Order confirmation email sent to ${customer.email}. Message ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send order confirmation email: ${error.message}`);
    throw error;
  }
};

/**
 * Sends an order status update email
 * @param {Object} order - Order data
 * @param {string} newStatus - New status of the order
 * @param {Object} customer - Customer data
 * @returns {Promise<void>}
 */
const sendOrderStatusUpdate = async (order, newStatus, customer) => {
  try {
    const statusMessages = {
      RECEIVED: 'has been received and is being prepared.',
      PREPARING: 'is currently being prepared for you.',
      READY: 'is ready for pickup or out for delivery.',
      OUT_FOR_DELIVERY: 'is out for delivery and on its way to you.',
      READY_FOR_PICKUP: 'is ready for pickup at our restaurant.',
      COMPLETED: 'has been completed. Enjoy your meal!',
      CANCELLED: 'has been cancelled.'
    };

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@azizrestaurant.com',
      to: customer.email,
      subject: `Order Status Update #${order.trackingId} - Aziz Restaurant`,
      html: `
        <h2>Order Status Update</h2>
        <p>Dear ${customer.firstName} ${customer.lastName},</p>

        <p>Your order #${order.trackingId} status is now: <strong>${newStatus}</strong>.</p>
        <p>This means your order ${statusMessages[newStatus] || 'status has been updated.'}</p>

        <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Order ID:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${order.trackingId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Current Status:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${newStatus}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Updated At:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
          </tr>
        </table>

        <p>You can continue to track your order status using our tracking system.</p>

        <p>If you have any questions, please contact us.</p>

        <p>Best regards,<br/>The Aziz Restaurant Team</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Order status update email sent to ${customer.email}. Message ID: ${info.messageId}`);
  } catch (error) {
    logger.error(`Failed to send order status update email: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendReservationConfirmation,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
};