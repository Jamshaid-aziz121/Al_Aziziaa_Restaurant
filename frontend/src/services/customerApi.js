import api from './api';

// Customer API methods
export const customerApi = {
  // Get customer dashboard (reservations and orders)
  getCustomerDashboard: async (customerId) => {
    try {
      const response = await api.get(`/dashboard/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customer dashboard');
    }
  },

  // Get authenticated customer's dashboard
  getMyDashboard: async () => {
    try {
      const response = await api.get('/dashboard/my-dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard');
    }
  },

  // Get upcoming reservations and orders
  getUpcoming: async (customerId) => {
    try {
      const response = await api.get(`/dashboard/customer/${customerId}/upcoming`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming items');
    }
  },

  // Get customer reservations
  getCustomerReservations: async (customerId) => {
    try {
      const response = await api.get(`/reservations/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations');
    }
  },

  // Get customer orders
  getCustomerOrders: async (customerId) => {
    try {
      const response = await api.get(`/orders/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },
};

export default api;