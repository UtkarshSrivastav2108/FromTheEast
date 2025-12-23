import api from './api';

/**
 * Order Service
 * Handles all order-related API calls
 */

/**
 * Get user's orders
 * @returns {Promise<Array>} Array of orders
 */
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

/**
 * Get single order
 * @param {string} id - Order ID
 * @returns {Promise<Object>} Order data
 */
export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

/**
 * Create order from cart
 * @param {Object} orderData - Order data
 * @param {Array} orderData.items - Order items
 * @param {number} orderData.subtotal - Subtotal
 * @param {number} [orderData.deliveryFee=0] - Delivery fee
 * @param {number} [orderData.discount=0] - Discount
 * @param {Object} orderData.address - Delivery address
 * @param {string} [orderData.paymentMethod='card'] - Payment method
 * @returns {Promise<Object>} Created order data
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * Update order status (Admin)
 * @param {string} id - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order data
 */
export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export default {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
};

