const mongoose = require('mongoose');

/**
 * Cart Schema
 */
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    unique: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    image: { type: String },
  }],
}, {
  timestamps: true,
});

/**
 * Index for user
 */
cartSchema.index({ user: 1 });

module.exports = mongoose.model('Cart', cartSchema);

