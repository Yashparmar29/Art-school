/**
 * Services Router
 *
 * GET /api/services — Return all art courses / workshops sorted by title.
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Service = require('../models/Service');

const defaultServices = [
  {
    title: 'Drawing',
    description: 'Master the fundamentals of drawing with pencil, charcoal, and ink. Learn perspective, shading, proportions, and composition.',
    price: 2000,
    duration: '1.5 hrs',
    icon: '✏️',
  },
  {
    title: 'Painting',
    description: 'Explore acrylic and oil painting techniques. From colour theory to brush-work, develop your own style while creating stunning canvases.',
    price: 2500,
    duration: '2 hrs',
    icon: '🎨',
  },
  {
    title: 'Sketching',
    description: 'Quick, expressive sketching sessions focused on gesture drawing, urban sketching, and rapid visual storytelling.',
    price: 1800,
    duration: '1 hr',
    icon: '📝',
  },
  {
    title: 'Watercolor',
    description: 'Discover the beauty of watercolour painting. Learn wet-on-wet, dry-brush, and layering techniques for luminous artworks.',
    price: 2200,
    duration: '1.5 hrs',
    icon: '💧',
  },
  {
    title: 'Digital Art',
    description: 'Create stunning digital illustrations using tablets and industry software. Covers digital brushes, layers, and concept-art workflows.',
    price: 3000,
    duration: '2 hrs',
    icon: '💻',
  },
  {
    title: 'Kids Art Classes',
    description: 'Fun, age-appropriate art activities for children aged 5–12. Encourage creativity through crafts, colouring, and guided painting.',
    price: 1500,
    duration: '1 hr',
    icon: '👶',
  },
  {
    title: 'Weekend Workshops',
    description: 'Intensive weekend sessions covering a specific medium or theme. Walk away with a finished, framed piece every session!',
    price: 1000,
    duration: '3 hrs',
    icon: '🖌️',
  },
  {
    title: 'Portfolio Prep',
    description: 'Tailored mentoring for students preparing art-school applications or professional portfolios with detailed critique.',
    price: 5000,
    duration: '2 hrs',
    icon: '📁',
  },
];

// ─── GET / — List all services ──────────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const services = await Service.find().sort({ title: 1 });
      if (services && services.length > 0) {
        return res.json({
          success: true,
          count: services.length,
          services,
        });
      }
    }

    // Default fallback when DB is empty or connecting
    return res.json({
      success: true,
      count: defaultServices.length,
      services: defaultServices,
    });
  } catch (err) {
    console.error('Services fetch error:', err);
    return res.json({
      success: true,
      count: defaultServices.length,
      services: defaultServices,
    });
  }
});

module.exports = router;
