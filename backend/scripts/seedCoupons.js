const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Coupon = require('../models/Coupon');

// Load environment variables
dotenv.config();

/**
 * Seed sample coupons
 */
const seedCoupons = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fromtheeast', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing coupons (optional - comment out if you want to keep existing)
    // await Coupon.deleteMany({});
    // console.log('Cleared existing coupons');

    // Sample coupons
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minAmount: 0,
        maxDiscount: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        usageLimit: 1000,
        applicableTo: 'new_users',
      },
      {
        code: 'SAVE20',
        description: 'Save 20% on orders above ₹30',
        discountType: 'percentage',
        discountValue: 20,
        minAmount: 30,
        maxDiscount: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        usageLimit: 500,
        applicableTo: 'all',
      },
      {
        code: 'FLAT50',
        description: 'Flat ₹50 off on orders above ₹100',
        discountType: 'fixed',
        discountValue: 50,
        minAmount: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        usageLimit: 200,
        applicableTo: 'all',
      },
      {
        code: 'EAST15',
        description: '15% off on all orders',
        discountType: 'percentage',
        discountValue: 15,
        minAmount: 25,
        maxDiscount: 75,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        usageLimit: 1000,
        applicableTo: 'all',
      },
      {
        code: 'FIRST50',
        description: '₹50 off for first-time customers',
        discountType: 'fixed',
        discountValue: 50,
        minAmount: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
        usageLimit: 500,
        applicableTo: 'new_users',
      },
    ];

    // Insert coupons
    for (const coupon of coupons) {
      try {
        const existingCoupon = await Coupon.findOne({ code: coupon.code });
        if (existingCoupon) {
          console.log(`Coupon ${coupon.code} already exists, skipping...`);
        } else {
          await Coupon.create(coupon);
          console.log(`Created coupon: ${coupon.code}`);
        }
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Coupon ${coupon.code} already exists, skipping...`);
        } else {
          console.error(`Error creating coupon ${coupon.code}:`, error.message);
        }
      }
    }

    console.log('Coupon seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
};

// Run seed function
seedCoupons();

