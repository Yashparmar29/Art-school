/**
 * Contact Model
 *
 * Stores messages submitted via the "Contact Us" form on the website.
 * Basic email format validation is applied at the schema level.
 */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      trim: true,
      default: 'General Inquiry',
    },
    preferredContact: {
      type: String,
      trim: true,
      default: 'Email',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
