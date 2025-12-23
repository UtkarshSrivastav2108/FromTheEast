const mongoose = require('mongoose');

/**
 * Slider Schema
 */
const sliderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Slider title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Slider description is required'],
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Slider image is required'],
  },
  bg: {
    type: String,
    default: 'red',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

/**
 * Index for ordering
 */
sliderSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model('Slider', sliderSchema);

