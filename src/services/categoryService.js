import api from './api';

/**
 * Get all categories with metadata
 * @returns {Promise<Array>} Array of category objects
 */
export const getCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data.data || [];
};

