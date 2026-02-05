/**
 * Integration tests for reservation endpoints
 */

const request = require('supertest');
const app = require('../../src/app');

describe('Reservation API Endpoints', () => {
  describe('POST /api/reservations', () => {
    test('should create a reservation successfully', async () => {
      const reservationData = {
        customerId: 'test-customer-id',
        reservationDate: '2023-12-25',
        reservationTime: '18:00',
        partySize: 4,
        specialRequests: 'Window seat preferred',
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(reservationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('confirmationCode');
      expect(response.body.data.status).toBe('CONFIRMED');
    });

    test('should return 400 for invalid reservation data', async () => {
      const invalidReservationData = {
        // Missing required fields
        reservationDate: 'invalid-date',
        partySize: -1, // Invalid party size
      };

      const response = await request(app)
        .post('/api/reservations')
        .send(invalidReservationData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/reservations/:id', () => {
    test('should return a reservation by ID', async () => {
      // First create a reservation to get its ID
      const reservationData = {
        customerId: 'test-customer-id',
        reservationDate: '2023-12-25',
        reservationTime: '18:00',
        partySize: 4,
      };

      const createResponse = await request(app)
        .post('/api/reservations')
        .send(reservationData);

      const reservationId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/reservations/${reservationId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(reservationId);
    });

    test('should return 404 for non-existent reservation', async () => {
      const response = await request(app)
        .get('/api/reservations/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/reservations/availability/slots', () => {
    test('should return available time slots', async () => {
      const response = await request(app)
        .get('/api/reservations/availability/slots')
        .query({ date: '2023-12-25', partySize: 4 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('availableSlots');
      expect(Array.isArray(response.body.data.availableSlots)).toBe(true);
    });

    test('should return 400 for missing parameters', async () => {
      const response = await request(app)
        .get('/api/reservations/availability/slots')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});