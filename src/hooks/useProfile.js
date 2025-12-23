import { useState, useEffect, useCallback } from 'react';
import profileService from '../services/profileService';

/**
 * useProfile Hook
 * Manages user profile
 * @returns {{ profile: Object | null, loading: boolean, error: Error | null, updateProfile: Function, changePassword: Function, refetch: Function }}
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Update profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      setError(null);
      const data = await profileService.updateProfile(profileData);
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

  /**
   * Change password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   */
  const changePassword = useCallback(async (passwordData) => {
    try {
      setError(null);
      await profileService.changePassword(passwordData);
    } catch (err) {
      const errorMessage = err.message || 'Failed to change password';
      setError(new Error(errorMessage));
      throw err;
    }
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    changePassword,
    refetch: fetchProfile,
  };
};

