import api from './api';

/**
 * Coupon Service
 * Handles all coupon-related API calls
 */
export const couponService = {
  /**
   * Get all available coupons
   * @returns {Promise<Object>} Available coupons
   */
  getAvailableCoupons: async () => {
    const response = await api.get('/coupons');
    return response.data.data;
  },

  /**
   * Validate coupon code
   * @param {string} code - Coupon code
   * @param {number} subtotal - Order subtotal
   * @returns {Promise<Object>} Validation result with discount
   */
  validateCoupon: async (code, subtotal) => {
    const response = await api.post('/coupons/validate', {
      code,
      subtotal,
    });
    return response.data.data;
  },
};

export default couponService;

