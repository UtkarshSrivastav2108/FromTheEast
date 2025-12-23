const Coupon = require('../models/Coupon');

/**
 * Get all available coupons
 * GET /api/coupons
 */
exports.getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: { $exists: false } },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } },
      ],
    }).sort({ discountValue: -1 });

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error('Get available coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message,
    });
  }
};

/**
 * Get all coupons (Admin only - for management)
 * GET /api/coupons/all
 */
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    console.error('Get all coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coupons',
      error: error.message,
    });
  }
};

/**
 * Validate and apply coupon
 * POST /api/coupons/validate
 */
exports.validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required',
      });
    }

    if (subtotal === undefined || subtotal < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid subtotal is required',
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code',
      });
    }

    // Check if coupon is valid
    const now = new Date();
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is not active',
      });
    }

    if (now < coupon.validFrom) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is not yet valid',
      });
    }

    if (now > coupon.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired',
      });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has reached its usage limit',
      });
    }

    if (subtotal < coupon.minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of ₹${coupon.minAmount} required for this coupon`,
      });
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(subtotal);

    res.status(200).json({
      success: true,
      message: 'Coupon is valid',
      data: {
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minAmount: coupon.minAmount,
          maxDiscount: coupon.maxDiscount,
        },
        discount,
      },
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating coupon',
      error: error.message,
    });
  }
};

/**
 * Create coupon (Admin only)
 * POST /api/coupons
 */
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minAmount,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      applicableTo,
    } = req.body;

    // Validation
    if (!code || !discountType || !discountValue || !validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Code, discount type, discount value, and valid until date are required',
      });
    }

    if (discountType === 'percentage' && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: 'Percentage discount cannot exceed 100%',
      });
    }

    if (new Date(validUntil) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Valid until date must be in the future',
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minAmount: minAmount || 0,
      maxDiscount,
      validFrom: validFrom || new Date(),
      validUntil,
      usageLimit,
      applicableTo: applicableTo || 'all',
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating coupon',
      error: error.message,
    });
  }
};

/**
 * Update coupon (Admin only)
 * PUT /api/coupons/:id
 */
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // If code is being updated, uppercase it
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    // If validUntil is being updated, validate it
    if (updateData.validUntil && new Date(updateData.validUntil) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Valid until date must be in the future',
      });
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon,
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating coupon',
      error: error.message,
    });
  }
};

/**
 * Delete coupon (Admin only)
 * DELETE /api/coupons/:id
 */
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting coupon',
      error: error.message,
    });
  }
};

/**
 * Increment coupon usage count
 * POST /api/coupons/:code/use
 */
exports.incrementCouponUsage = async (req, res) => {
  try {
    const { code } = req.params;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found',
      });
    }

    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
      success: true,
      message: 'Coupon usage incremented',
      data: coupon,
    });
  } catch (error) {
    console.error('Increment coupon usage error:', error);
    res.status(500).json({
      success: false,
      message: 'Error incrementing coupon usage',
      error: error.message,
    });
  }
};

