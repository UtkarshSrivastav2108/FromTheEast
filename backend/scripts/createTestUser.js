/**
 * Script to create a test user account
 * Usage: node scripts/createTestUser.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fromtheeast', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Test user data with complete profile
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      phone: '+1 (555) 123-4567',
      address: {
        street: '123 Main Street',
        city: 'New York',
        zipCode: '10001',
        country: 'United States',
      },
    };

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: testUser.email }, { username: testUser.username }],
    });

    if (existingUser) {
      console.log('✅ Test user already exists!');
      console.log('Username:', testUser.username);
      console.log('Email:', testUser.email);
      console.log('Password:', testUser.password);
      await mongoose.connection.close();
      return;
    }

    // Create user
    const user = await User.create(testUser);
    console.log('✅ Test user created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username:', testUser.username);
    console.log('Email:', testUser.email);
    console.log('Password:', testUser.password);
    console.log('\n📋 Profile Information:');
    console.log('First Name:', testUser.firstName);
    console.log('Last Name:', testUser.lastName);
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
    console.error('❌ Error creating test user:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createTestUser();

