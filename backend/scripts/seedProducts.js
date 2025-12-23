const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

/**
 * Seed products from frontend data
 */
const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fromtheeast');
    console.log('MongoDB Connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Products data from frontend
    const products = [
      // Starters
      {
        name: 'Edamame',
        description: 'Steamed soybeans with sea salt',
        price: 6.99,
        image: '/assets/image/1.png',
        category: 'starters',
        isVeg: true,
        badges: [],
      },
      {
        name: 'Gyoza',
        description: 'Pan-fried pork dumplings with dipping sauce',
        price: 8.99,
        image: '/assets/image/2.png',
        category: 'starters',
        isVeg: false,
        badges: ['Bestseller'],
        featured: true,
      },
      {
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls with sweet chili',
        price: 7.99,
        image: '/assets/image/3.png',
        category: 'starters',
        isVeg: true,
        badges: [],
      },
      {
        name: 'Chicken Karaage',
        description: 'Japanese fried chicken with lemon',
        price: 9.99,
        image: '/assets/image/4.png',
        category: 'starters',
        isVeg: false,
        badges: ['Bestseller'],
      },
      // Ramen
      {
        name: 'Tonkotsu Ramen',
        description: 'Rich pork bone broth with chashu and soft-boiled egg',
        price: 14.99,
        image: '/assets/image/5.png',
        category: 'ramen',
        isVeg: false,
        badges: ['Bestseller'],
        featured: true,
      },
      {
        name: 'Miso Ramen',
        description: 'Savory miso broth with corn and butter',
        price: 13.99,
        image: '/assets/image/6.png',
        category: 'ramen',
        isVeg: false,
        badges: [],
      },
      {
        name: 'Shoyu Ramen',
        description: 'Classic soy sauce broth with nori and bamboo',
        price: 13.99,
        image: '/assets/image/7.png',
        category: 'ramen',
        isVeg: false,
        badges: [],
      },
      {
        name: 'Vegetarian Ramen',
        description: 'Mushroom and vegetable broth with tofu',
        price: 12.99,
        image: '/assets/image/8.png',
        category: 'ramen',
        isVeg: true,
        badges: [],
      },
      // Sushi
      {
        name: 'Salmon Sashimi',
        description: 'Fresh Atlantic salmon, 6 pieces',
        price: 16.99,
        image: '/assets/image/1.png',
        category: 'sushi',
        isVeg: false,
        badges: ['Bestseller'],
        featured: true,
      },
      {
        name: 'Dragon Roll',
        description: 'Eel, cucumber, avocado, eel sauce',
        price: 15.99,
        image: '/assets/image/2.png',
        category: 'sushi',
        isVeg: false,
        badges: [],
      },
      {
        name: 'California Roll',
        description: 'Crab, avocado, cucumber',
        price: 10.99,
        image: '/assets/image/3.png',
        category: 'sushi',
        isVeg: false,
        badges: [],
      },
      {
        name: 'Vegetable Roll',
        description: 'Assorted fresh vegetables',
        price: 8.99,
        image: '/assets/image/4.png',
        category: 'sushi',
        isVeg: true,
        badges: [],
      },
      // Rice Bowls
      {
        name: 'Teriyaki Chicken Bowl',
        description: 'Grilled chicken with teriyaki sauce and vegetables',
        price: 13.99,
        image: '/assets/image/5.png',
        category: 'rice-bowls',
        isVeg: false,
        badges: ['Bestseller'],
        featured: true,
      },
      {
        name: 'Beef Bulgogi Bowl',
        description: 'Marinated beef with kimchi and rice',
        price: 14.99,
        image: '/assets/image/6.png',
        category: 'rice-bowls',
        isVeg: false,
        badges: [],
      },
      {
        name: 'Tofu Teriyaki Bowl',
        description: 'Crispy tofu with vegetables and teriyaki',
        price: 11.99,
        image: '/assets/image/7.png',
        category: 'rice-bowls',
        isVeg: true,
        badges: [],
      },
      // Desserts
      {
        name: 'Mochi Ice Cream',
        description: 'Assorted flavors: green tea, vanilla, strawberry',
        price: 7.99,
        image: '/assets/image/8.png',
        category: 'desserts',
        isVeg: true,
        badges: [],
      },
      {
        name: 'Matcha Tiramisu',
        description: 'Japanese twist on classic tiramisu',
        price: 8.99,
        image: '/assets/image/1.png',
        category: 'desserts',
        isVeg: true,
        badges: ['Bestseller'],
      },
      {
        name: 'Dorayaki',
        description: 'Sweet red bean pancake sandwich',
        price: 6.99,
        image: '/assets/image/2.png',
        category: 'desserts',
        isVeg: true,
        badges: [],
      },
      // Drinks
      {
        name: 'Matcha Latte',
        description: 'Traditional green tea with steamed milk',
        price: 5.99,
        image: '/assets/image/3.png',
        category: 'drinks',
        isVeg: true,
        badges: [],
      },
      {
        name: 'Yuzu Lemonade',
        description: 'Refreshing Japanese citrus lemonade',
        price: 4.99,
        image: '/assets/image/4.png',
        category: 'drinks',
        isVeg: true,
        badges: [],
      },
      {
        name: 'Sake',
        description: 'Premium Japanese rice wine',
        price: 12.99,
        image: '/assets/image/5.png',
        category: 'drinks',
        isVeg: true,
        badges: [],
      },
    ];

    // Insert products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

// Run seed
seedProducts();

