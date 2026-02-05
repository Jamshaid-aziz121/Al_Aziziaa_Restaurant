import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// Reservation API methods
export const reservationApi = {
  // Create a new reservation
  createReservation: async (reservationData) => {
    try {
      const response = await api.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create reservation');
    }
  },

  // Get reservation by ID
  getReservationById: async (id) => {
    try {
      const response = await api.get(`/reservations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservation');
    }
  },

  // Get reservations by customer ID
  getReservationsByCustomerId: async (customerId) => {
    try {
      const response = await api.get(`/reservations/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations');
    }
  },

  // Get reservations for authenticated customer
  getMyReservations: async () => {
    try {
      const response = await api.get('/reservations/my-reservations');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations');
    }
  },

  // Update reservation
  updateReservation: async (id, updateData) => {
    try {
      const response = await api.put(`/reservations/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update reservation');
    }
  },

  // Cancel reservation
  cancelReservation: async (id) => {
    try {
      const response = await api.patch(`/reservations/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel reservation');
    }
  },

  // Check availability
  checkAvailability: async (date, time, partySize) => {
    try {
      const response = await api.get('/reservations/availability/check', {
        params: { date, time, partySize }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check availability');
    }
  },

  // Get available time slots
  getAvailableTimeSlots: async (date, partySize) => {
    try {
      const response = await api.get('/reservations/availability/slots', {
        params: { date, partySize }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch available time slots');
    }
  },
};

export default api;