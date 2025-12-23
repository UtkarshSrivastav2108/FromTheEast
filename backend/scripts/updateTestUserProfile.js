/**
 * Script to update test user with complete profile information
 * Usage: node scripts/updateTestUserProfile.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const updateTestUserProfile = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fromtheeast', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find the test user
    const testUser = await User.findOne({ username: 'testuser' });

    if (!testUser) {
      console.log('❌ Test user not found. Please run createTestUser.js first.');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Update user with complete profile information
    testUser.firstName = 'Test';
    testUser.lastName = 'User';
    testUser.email = 'test@example.com';
    testUser.phone = '+1 (555) 123-4567';
    testUser.address = {
      street: '123 Main Street',
      city: 'New York',
      zipCode: '10001',
      country: 'United States',
    };

    await testUser.save();

    console.log('✅ Test user profile updated successfully!');
    console.log('\n📋 Updated Profile Information:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('First Name:', testUser.firstName);
    console.log('Last Name:', testUser.lastName);
    console.log('Email:', testUser.email);
    console.log('Phone:', testUser.phone);
    console.log('Address:');
    console.log('  Street:', testUser.address.street);
    console.log('  City:', testUser.address.city);
    console.log('  Zip Code:', testUser.address.zipCode);
    console.log('  Country:', testUser.address.country);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating test user profile:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

updateTestUserProfile();

