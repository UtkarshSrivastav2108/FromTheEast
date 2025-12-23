import api from './api';

/**
 * Profile Service
 * Handles all profile-related API calls
 */

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data.user;
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @param {string} [profileData.firstName] - First name
 * @param {string} [profileData.lastName] - Last name
 * @param {string} [profileData.phone] - Phone number
 * @param {Object} [profileData.address] - Address object
 * @returns {Promise<Object>} Updated user profile data
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data.user;
};

/**
 * Change password
 * @param {Object} passwordData - Password data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} Success response
 */
export const changePassword = async (passwordData) => {
  const response = await api.put('/profile/password', passwordData);
  return response;
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};

