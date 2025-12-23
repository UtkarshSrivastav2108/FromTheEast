import { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';

/**
 * useCategories Hook
 * Fetches categories from API
 * @returns {{ categories: Array, loading: boolean, error: Error | null }}
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

