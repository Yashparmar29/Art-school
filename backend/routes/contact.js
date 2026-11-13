/**
 * Contact Router
 *
 * POST /api/contact — Submit a "Contact Us" message.
 * Validates name, email format, and message body before persisting.
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Contact = require('../models/Contact');

const memoryContacts = [];

// ─── POST / — Submit a contact message ──────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const errors = [];
    if (!name || !name.trim()) errors.push('Name is required');
    if (!email || !email.trim()) {
      errors.push('Email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.push('Please enter a valid email');
    }
    if (!message || !message.trim()) errors.push('Message is required');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    if (mongoose.connection.readyState === 1) {
      await Contact.create(contactData);
    } else {
      memoryContacts.push({ _id: 'cnt_' + Date.now(), ...contactData });
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    console.error('Contact message error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

module.exports = router;
