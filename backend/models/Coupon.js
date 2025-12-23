const mongoose = require('mongoose');

/**
 * Coupon Schema
 */
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  discountType: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value must be positive'],
  },
  minAmount: {
    type: Number,
    required: [true, 'Minimum amount is required'],
    min: [0, 'Minimum amount must be positive'],
    default: 0,
  },
  maxDiscount: {
    type: Number,
    min: [0, 'Max discount must be positive'],
  },
  validFrom: {
    type: Date,
    default: Date.now,
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required'],
  },
  usageLimit: {
    type: Number,
    min: [0, 'Usage limit must be positive'],
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count must be positive'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  applicableTo: {
    type: String,
    enum: ['all', 'new_users', 'existing_users'],
    default: 'all',
  },
}, {
  timestamps: true,
});

/**
 * Index for code and active coupons
 */
couponSchema.index({ code: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ validUntil: 1 });

/**
 * Virtual for checking if coupon is valid
 */
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (!this.usageLimit || this.usedCount < this.usageLimit)
  );
});

/**
 * Method to calculate discount amount
 * @param {number} subtotal - Order subtotal
 * @returns {number} Discount amount
 */
couponSchema.methods.calculateDiscount = function(subtotal) {
  if (!this.isValid || subtotal < this.minAmount) {
    return 0;
  }

  let discount = 0;
  
  if (this.discountType === 'percentage') {
    discount = (subtotal * this.discountValue) / 100;
    // Apply max discount if specified
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = this.discountValue;
    // Don't exceed subtotal
    if (discount > subtotal) {
      discount = subtotal;
    }
  }

  return Math.round(discount * 100) / 100; // Round to 2 decimal places
};

module.exports = mongoose.model('Coupon', couponSchema);

