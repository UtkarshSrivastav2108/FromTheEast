import api from './api';

/**
 * Cart Service
 * Handles all cart-related API calls
 */

/**
 * Get user's cart
 * @returns {Promise<Object>} Cart data
 */
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data?.data || response.data;
};

/**
 * Add item to cart
 * @param {Object} itemData - Item data
 * @param {string} itemData.productId - Product ID
 * @param {number} [itemData.quantity=1] - Quantity
 * @returns {Promise<Object>} Updated cart data
 */
export const addToCart = async (itemData) => {
  const response = await api.post('/cart', itemData);
  return response.data?.data || response.data;
};

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart data
 */
export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/${itemId}`, { quantity });
  return response.data?.data || response.data;
};

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 * @returns {Promise<Object>} Updated cart data
 */
export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data?.data || response.data;
};

/**
 * Clear cart
 * @returns {Promise<Object>} Empty cart data
 */
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data?.data || response.data;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};

