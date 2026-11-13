/**
 * Reviews Router
 *
 * GET  /api/reviews — Return all reviews, newest first.
 * POST /api/reviews — Submit a new review (1–5 star rating).
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Review = require('../models/Review');

const defaultReviews = [
  {
    _id: 'rev_1',
    name: 'Ananya Sharma',
    rating: 5,
    comment: 'Create Art School has been an incredible experience! The painting classes helped me discover a style I never knew I had. The teachers are patient and truly passionate about art.',
    course: 'Painting',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'rev_2',
    name: 'Rohan Mehta',
    rating: 4,
    comment: 'I joined the weekend workshops and they exceeded my expectations. Each session is packed with learning and you get a finished piece to take home. Highly recommended!',
    course: 'Weekend Workshops',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'rev_3',
    name: 'Priya Iyer',
    rating: 5,
    comment: 'My daughter loves the Kids Art Classes! She comes home every week excited to show us what she created. The instructors are wonderful with children.',
    course: 'Kids Art Classes',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    _id: 'rev_4',
    name: 'Vikram Desai',
    rating: 4,
    comment: 'The Drawing course gave me a solid foundation. I went from barely being able to sketch to creating realistic portraits in just three months. Great curriculum!',
    course: 'Drawing',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    _id: 'rev_5',
    name: 'Sneha Kulkarni',
    rating: 5,
    comment: 'Portfolio Prep was exactly what I needed for my design-school applications. The mentors provided detailed, constructive feedback and helped me curate my best work.',
    course: 'Portfolio Prep',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    _id: 'rev_6',
    name: 'Arjun Nair',
    rating: 4,
    comment: 'Digital Art classes here are top-notch. The instructor breaks down complex tools into simple steps. I am now confident using Photoshop and Procreate for my freelance projects.',
    course: 'Digital Art',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

let memoryReviews = [...defaultReviews];

// ─── GET / — List all reviews (newest first) ────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reviews = await Review.find().sort({ createdAt: -1 });
      if (reviews && reviews.length > 0) {
        return res.json({
          success: true,
          count: reviews.length,
          reviews,
        });
      }
    }

    return res.json({
      success: true,
      count: memoryReviews.length,
      reviews: memoryReviews,
    });
  } catch (err) {
    console.error('Reviews fetch error:', err);
    return res.json({
      success: true,
      count: memoryReviews.length,
      reviews: memoryReviews,
    });
  }
});

// ─── POST / — Create a review ───────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, rating, comment, course } = req.body;

    const errors = [];
    if (!name || !name.trim()) errors.push('Name is required');
    if (rating === undefined || rating === null) {
      errors.push('Rating is required');
    } else if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      errors.push('Rating must be a number between 1 and 5');
    }
    if (!comment || !comment.trim()) errors.push('Comment is required');
    if (!course || !course.trim()) errors.push('Course is required');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const reviewData = {
      name: name.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      course: course.trim(),
      createdAt: new Date().toISOString(),
    };

    let savedReview = null;

    if (mongoose.connection.readyState === 1) {
      savedReview = await Review.create(reviewData);
    } else {
      savedReview = { _id: 'rev_' + Date.now(), ...reviewData };
      memoryReviews.unshift(savedReview);
    }

    return res.status(201).json({
      success: true,
      review: savedReview,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }

    console.error('Review creation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

module.exports = router;
