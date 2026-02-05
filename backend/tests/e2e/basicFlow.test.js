/**
 * End-to-End tests for basic user flows
 */

const request = require('supertest');
const app = require('../../src/app');

describe('End-to-End: Basic User Flows', () => {
  describe('Reservation Flow', () => {
    test('Complete reservation flow: check availability -> create reservation -> get reservation', async () => {
      // Step 1: Check availability
      const availabilityResponse = await request(app)
        .get('/api/reservations/availability/check')
        .query({ date: '2023-12-25', time: '18:00', partySize: 4 })
        .expect(200);

      expect(availabilityResponse.body.success).toBe(true);
      expect(availabilityResponse.body.data).toHaveProperty('available');

      // Step 2: Create reservation if available
      if (availabilityResponse.body.data.available) {
        const reservationData = {
          customerId: 'test-customer-id',
          reservationDate: '2023-12-25',
          reservationTime: '18:00',
          partySize: 4,
          specialRequests: 'Window seat preferred',
        };

        const createResponse = await request(app)
          .post('/api/reservations')
          .send(reservationData)
          .expect(201);

        expect(createResponse.body.success).toBe(true);
        expect(createResponse.body.data).toHaveProperty('id');
        expect(createResponse.body.data).toHaveProperty('confirmationCode');

        // Step 3: Retrieve the created reservation
        const reservationId = createResponse.body.data.id;
        const getResponse = await request(app)
          .get(`/api/reservations/${reservationId}`)
          .expect(200);

        expect(getResponse.body.success).toBe(true);
        expect(getResponse.body.data.id).toBe(reservationId);
        expect(getResponse.body.data.status).toBe('CONFIRMED');
      }
    });
  });

  describe('Order Flow', () => {
    test('Complete order flow: create order -> update status -> track order', async () => {
      // Step 1: Create an order
      const orderData = {
        customerId: 'test-customer-id',
        orderType: 'PICKUP',
        items: [
          {
            menuItemId: 'test-menu-item-id',
            quantity: 2,
            unitPrice: 15.99,
            specialInstructions: 'No onions',
          }
        ],
        specialInstructions: 'Call upon arrival',
      };

      const createResponse = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      expect(createResponse.body.data).toHaveProperty('id');
      expect(createResponse.body.data).toHaveProperty('trackingId');
      expect(createResponse.body.data.status).toBe('RECEIVED');

      // Step 2: Get the order by tracking ID
      const trackingId = createResponse.body.data.trackingId;
      const trackResponse = await request(app)
        .get(`/api/orders/tracking/${trackingId}`)
        .expect(200);

      expect(trackResponse.body.success).toBe(true);
      expect(trackResponse.body.data.trackingId).toBe(trackingId);
      expect(trackResponse.body.data.status).toBe('RECEIVED');
    });
  });

  describe('Health Check', () => {
    test('Health endpoint should return status OK', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});