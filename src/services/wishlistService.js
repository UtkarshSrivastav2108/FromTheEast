import api from './api';

/**
 * Wishlist Service
 * Handles all wishlist-related API calls
 */

/**
 * Get user's wishlist
 * @returns {Promise<Object>} Wishlist data
 */
export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

/**
 * Add item to wishlist
 * @param {Object} itemData - Item data
 * @param {string} itemData.productId - Product ID
 * @returns {Promise<Object>} Updated wishlist data
 */
export const addToWishlist = async (itemData) => {
  const response = await api.post('/wishlist', itemData);
  return response.data;
};

/**
 * Remove item from wishlist
 * @param {string} itemId - Wishlist item ID
 * @returns {Promise<Object>} Updated wishlist data
 */
export const removeFromWishlist = async (itemId) => {
  const response = await api.delete(`/wishlist/${itemId}`);
  return response.data;
};

/**
 * Clear wishlist
 * @returns {Promise<Object>} Empty wishlist data
 */
export const clearWishlist = async () => {
  const response = await api.delete('/wishlist');
  return response.data;
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};

