import api from './api';

/**
 * Product Service
 * Handles all product-related API calls
 */

/**
 * Get all products
 * @param {Object} params - Query parameters
 * @param {string} [params.category] - Filter by category
 * @param {boolean} [params.featured] - Filter featured products
 * @returns {Promise<Array>} Array of products
 */
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', params);
  return response.data;
};

/**
 * Get single product
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data
 */
export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products
 */
export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

/**
 * Get featured products
 * @returns {Promise<Array>} Array of featured products
 */
export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

export default {
  getProducts,
  getProduct,
  getProductsByCategory,
  getFeaturedProducts,
};

