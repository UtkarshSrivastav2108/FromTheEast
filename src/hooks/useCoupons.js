import { useState, useEffect, useCallback } from 'react';
import couponService from '../services/couponService';

/**
 * useCoupons Hook
 * Fetches available coupons
 * @returns {{ coupons: Array, loading: boolean, error: Error | null, refetch: Function }}
 */
export const useCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await couponService.getAvailableCoupons();
      // Ensure we have an array
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch coupons'));
      // Set empty array on error
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically fetch coupons when hook is used
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return {
    coupons,
    loading,
    error,
    refetch: fetchCoupons,
  };
};

/**
 * useCouponValidation Hook
 * Validates coupon codes
 * @returns {{ validateCoupon: Function, loading: boolean, error: Error | null }}
 */
export const useCouponValidation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateCoupon = useCallback(async (code, subtotal) => {
    try {
      setLoading(true);
      setError(null);
      const result = await couponService.validateCoupon(code, subtotal);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to validate coupon';
      setError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    validateCoupon,
    loading,
    error,
  };
};

