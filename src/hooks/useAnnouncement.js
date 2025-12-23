import { useState, useEffect } from 'react';
import { getAnnouncement } from '../services/announcementService';

/**
 * useAnnouncement Hook
 * Fetches active announcement from API
 * @returns {{ announcement: Object | null, loading: boolean, error: Error | null }}
 */
export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnnouncement();
        setAnnouncement(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch announcement'));
        setAnnouncement(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  return { announcement, loading, error };
};

