/**
 * Bookings Router
 *
 * POST /api/bookings — Create a new class-booking request.
 * Validates required fields and Indian phone-number format before persisting.
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Booking = require('../models/Booking');

// In-memory backup store for development / offline resilience
const memoryBookings = [];

// ─── POST / — Create a booking ──────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, service, date, timeSlot, classType, note } = req.body;

    // --- Validation ---
    const errors = [];

    if (!name || !name.trim()) {
      errors.push('Name is required');
    }
    if (!phone) {
      errors.push('Phone is required');
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, '').slice(-10))) {
      errors.push('Please enter a valid 10-digit Indian phone number (starting with 6-9)');
    }
    if (!service || !service.trim()) {
      errors.push('Service is required');
    }
    if (!date || !date.trim()) {
      errors.push('Date is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const bookingData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : '',
      service: service.trim(),
      date: date.trim(),
      timeSlot: timeSlot ? timeSlot.trim() : 'Morning (10:00 AM - 12:00 PM)',
      classType: classType ? classType.trim() : 'In-Studio Class',
      note: note ? note.trim() : '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    let savedBooking = null;

    if (mongoose.connection.readyState === 1) {
      savedBooking = await Booking.create(bookingData);
    } else {
      savedBooking = { _id: 'mem_' + Date.now(), ...bookingData };
      memoryBookings.push(savedBooking);
    }

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      booking: savedBooking,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    console.error('Booking creation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

module.exports = router;
