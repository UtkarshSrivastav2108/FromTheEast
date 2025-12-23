const mongoose = require('mongoose');

/**
 * Product Schema
 */
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    sparse: true, // Allow null/undefined values
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be positive'],
  },
  image: {
    type: String,
    required: [true, 'Product image is required'],
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['starters', 'ramen', 'sushi', 'rice-bowls', 'desserts', 'drinks'],
    lowercase: true,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  badges: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

/**
 * Index for category and featured products
 */
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ id: 1 }); // Index for numeric ID lookup

module.exports = mongoose.model('Product', productSchema);

