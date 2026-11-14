/**
 * Booking Model
 *
 * Represents a class-booking request submitted by a student.
 * Phone validation enforces the standard 10-digit Indian mobile format.
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [
        /^[6-9]\d{9}$/,
        'Please enter a valid 10-digit Indian phone number',
      ],
    },
    email: {
      type: String,
      trim: true,
      default: '',
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
    },
    timeSlot: {
      type: String,
      default: 'Morning (10:00 AM - 12:00 PM)',
    },
    classType: {
      type: String,
      default: 'In-Studio Class',
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    note: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'confirmed', 'cancelled'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
