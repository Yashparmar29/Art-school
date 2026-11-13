/**
 * Service Model
 *
 * Represents an art course / workshop offered by the school.
 * The `icon` field stores an emoji used for display on the frontend.
 */

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    icon: {
      type: String,
      default: '🎨',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
