const express = require('express');
const router = express.Router();
const {
  getAvailableCoupons,
  getAllCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  incrementCouponUsage,
} = require('../controllers/couponController');
const auth = require('../middleware/auth');

/**
 * Public routes
 */
// Get all available coupons (public)
router.get('/', getAvailableCoupons);

// Validate coupon (public, but requires subtotal)
router.post('/validate', validateCoupon);

/**
 * Protected routes (Admin only - can be added later)
 */
// Get all coupons (including inactive) - Admin only
router.get('/all', auth, getAllCoupons);

// Create coupon - Admin only
router.post('/', auth, createCoupon);

// Update coupon - Admin only
router.put('/:id', auth, updateCoupon);

// Delete coupon - Admin only
router.delete('/:id', auth, deleteCoupon);

// Increment coupon usage - called after order placement
router.post('/:code/use', auth, incrementCouponUsage);

module.exports = router;

