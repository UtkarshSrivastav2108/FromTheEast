import { useState, useEffect } from 'react';
import { getSliders } from '../services/sliderService';

/**
 * useSliders Hook
 * Fetches slider items from API
 * @returns {{ sliders: Array, loading: boolean, error: Error | null }}
 */
export const useSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSliders();
        setSliders(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch sliders'));
        setSliders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  return { sliders, loading, error };
};

