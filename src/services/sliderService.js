import api from './api';

/**
 * Get all active slider items
 * @returns {Promise<Array>} Array of slider items
 */
export const getSliders = async () => {
  const response = await api.get('/sliders');
  return response.data.data || [];
};

