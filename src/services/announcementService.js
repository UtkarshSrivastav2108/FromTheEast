import api from './api';

/**
 * Get active announcement
 * @returns {Promise<Object|null>} Announcement object or null
 */
export const getAnnouncement = async () => {
  const response = await api.get('/announcements');
  return response.data.data || null;
};

