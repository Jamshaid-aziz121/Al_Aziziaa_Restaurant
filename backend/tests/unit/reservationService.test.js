/**
 * Unit tests for reservation service
 */

const {
  createReservation,
  getReservationById,
  getReservationsByCustomerId,
  updateReservation,
  cancelReservation,
  checkAvailability,
  getAvailableTimeSlots
} = require('../../src/services/reservationService');
const { prisma } = require('../../src/utils/database');

// Mock the prisma client
jest.mock('../../src/utils/database', () => ({
  prisma: {
    reservation: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    customer: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Reservation Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReservation', () => {
    test('should create a reservation successfully', async () => {
      const mockReservationData = {
        customerId: 'test-customer-id',
        reservationDate: new Date('2023-12-25'),
        reservationTime: '18:00',
        partySize: 4,
        specialRequests: 'Window seat preferred',
      };

      const mockCustomer = {
        id: 'test-customer-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockCreatedReservation = {
        id: 'test-reservation-id',
        ...mockReservationData,
        status: 'CONFIRMED',
        confirmationCode: 'RES-123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.reservation.create.mockResolvedValue(mockCreatedReservation);
      prisma.customer.findUnique.mockResolvedValue(mockCustomer);

      const result = await createReservation(mockReservationData);

      expect(prisma.reservation.create).toHaveBeenCalledWith({
        data: {
          ...mockReservationData,
          status: 'CONFIRMED',
          confirmationCode: expect.stringMatching(/^RES-\d+-\d+$/),
        },
      });
      expect(result).toEqual(mockCreatedReservation);
    });

    test('should throw an error if table is not available', async () => {
      const mockReservationData = {
        customerId: 'test-customer-id',
        reservationDate: new Date('2023-12-25'),
        reservationTime: '18:00',
        partySize: 4,
      };

      prisma.reservation.findFirst.mockResolvedValue({
        id: 'existing-reservation-id',
        reservationDate: new Date('2023-12-25'),
        reservationTime: '18:00',
        partySize: 6,
      });

      await expect(createReservation(mockReservationData)).rejects.toThrow(
        'Table not available for the selected time and party size'
      );
    });
  });

  describe('getReservationById', () => {
    test('should return a reservation by ID', async () => {
      const mockReservation = {
        id: 'test-reservation-id',
        customerId: 'test-customer-id',
        reservationDate: new Date('2023-12-25'),
        reservationTime: '18:00',
        partySize: 4,
        status: 'CONFIRMED',
        customer: {
          id: 'test-customer-id',
          firstName: 'Test',
          lastName: 'User',
        },
      };

      prisma.reservation.findUnique.mockResolvedValue(mockReservation);

      const result = await getReservationById('test-reservation-id');

      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-reservation-id' },
        include: { customer: true },
      });
      expect(result).toEqual(mockReservation);
    });

    test('should throw an error if reservation is not found', async () => {
      prisma.reservation.findUnique.mockResolvedValue(null);

      await expect(getReservationById('non-existent-id')).rejects.toThrow(
        'Reservation not found'
      );
    });
  });

  describe('checkAvailability', () => {
    test('should return true if time is available', async () => {
      const date = new Date('2023-12-25');
      const time = '18:00';
      const partySize = 4;

      prisma.reservation.findFirst.mockResolvedValue(null);

      const result = await checkAvailability(date, time, partySize);

      expect(prisma.reservation.findFirst).toHaveBeenCalledWith({
        where: {
          reservationDate: date,
          reservationTime: time,
          partySize: { gte: partySize },
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      });
      expect(result).toBe(true);
    });

    test('should return false if time is not available', async () => {
      const date = new Date('2023-12-25');
      const time = '18:00';
      const partySize = 4;

      prisma.reservation.findFirst.mockResolvedValue({
        id: 'existing-reservation',
        reservationDate: date,
        reservationTime: time,
        partySize: 6,
      });

      const result = await checkAvailability(date, time, partySize);

      expect(result).toBe(false);
    });
  });
});