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
  try {
    const response = await api.get('/products', params);
    
    // API returns { success: true, count: 21, data: [...] }
    // response is already the parsed JSON object
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    
    // Fallback: if response is already an array
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  } catch (error) {
    throw error;
  }
};

/**
 * Get single product
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data
 */
export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    // Response structure: { success: true, data: {...} }
    return response.data || response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products
 */
export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    // API returns { success, count, data } - extract the data array
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

/**
 * Get featured products
 * @returns {Promise<Array>} Array of featured products
 */
export const getFeaturedProducts = async () => {
  try {
    const response = await api.get('/products/featured');
    // API returns { success, count, data } - extract the data array
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export default {
  getProducts,
  getProduct,
  getProductsByCategory,
  getFeaturedProducts,
};
