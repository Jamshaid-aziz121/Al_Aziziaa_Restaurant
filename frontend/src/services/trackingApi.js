import api from './api';

// Order tracking API methods
export const trackingApi = {
  // Get order status by tracking ID
  getOrderStatusByTrackingId: async (trackingId) => {
    try {
      const response = await api.get(`/status/orders/tracking/${trackingId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order status');
    }
  },

  // Get order status history by order ID
  getOrderStatusHistory: async (orderId) => {
    try {
      const response = await api.get(`/status/orders/${orderId}/history`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order status history');
    }
  },

  // Get current order status by order ID
  getCurrentOrderStatus: async (orderId) => {
    try {
      const response = await api.get(`/status/orders/${orderId}/current`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch current order status');
    }
  },

  // Update order status (typically used by staff/admin)
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await api.put(`/status/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  // Get estimated time for a specific status
  getEstimatedTime: async (orderId, status) => {
    try {
      const response = await api.get(`/status/orders/${orderId}/estimate`, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get estimated time');
    }
  },
};

export default api;