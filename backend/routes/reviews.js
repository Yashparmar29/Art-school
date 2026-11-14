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
    title: 'Found my artistic voice & confidence',
    comment: 'Create Art School has been an incredible experience! The painting classes helped me discover a style I never knew I had. The teachers are patient and truly passionate about art.',
    course: 'Painting',
    role: 'Adult Hobbyist',
    helpfulCount: 18,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'rev_2',
    name: 'Rohan Mehta',
    rating: 4,
    title: 'Energizing weekend creative escape',
    comment: 'I joined the weekend workshops and they exceeded my expectations. Each session is packed with learning and you get a finished piece to take home. Highly recommended!',
    course: 'Weekend Workshops',
    role: 'Working Professional',
    helpfulCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'rev_3',
    name: 'Priya Iyer',
    rating: 5,
    title: 'My daughter’s highlight of the week!',
    comment: 'My daughter loves the Kids Art Classes! She comes home every week excited to show us what she created. The instructors are wonderful with children.',
    course: 'Kids Art Classes',
    role: 'Parent of Student (Age 8)',
    helpfulCount: 25,
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
  },
  {
    _id: 'rev_4',
    name: 'Vikram Desai',
    rating: 4,
    title: 'Solid fundamentals from scratch',
    comment: 'The Drawing course gave me a solid foundation. I went from barely being able to sketch to creating realistic portraits in just three months. Great curriculum!',
    course: 'Drawing',
    role: 'Beginner Student',
    helpfulCount: 9,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    _id: 'rev_5',
    name: 'Sneha Kulkarni',
    rating: 5,
    title: 'Cracked admission to top design college!',
    comment: 'Portfolio Prep was exactly what I needed for my design-school applications. The mentors provided detailed, constructive feedback and helped me curate my best work.',
    course: 'Portfolio Prep',
    role: 'Design Aspirant',
    helpfulCount: 31,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    _id: 'rev_6',
    name: 'Arjun Nair',
    rating: 4,
    title: 'Top-tier digital illustration techniques',
    comment: 'Digital Art classes here are top-notch. The instructor breaks down complex tools into simple steps. I am now confident using Photoshop and Procreate for my freelance projects.',
    course: 'Digital Art',
    role: 'Freelance Illustrator',
    helpfulCount: 15,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    _id: 'rev_7',
    name: 'Meera Nambiar',
    rating: 5,
    title: 'Therapeutic and deeply fulfilling watercolors',
    comment: 'The watercolor sessions are pure therapy. Learning the fluidity of wet-on-wet painting under master guidance in their Koramangala studio changed how I spend my weekends.',
    course: 'Watercolor',
    role: 'Intermediate Painter',
    helpfulCount: 11,
    createdAt: new Date(Date.now() - 86400000 * 35).toISOString(),
  },
  {
    _id: 'rev_8',
    name: 'Karan Joshi',
    rating: 5,
    title: 'Fast, intuitive urban sketching methods',
    comment: 'Loved the urban sketching sessions! We took our sketchbooks around Koramangala cafes and parks, capturing live city moments with quick ink and wash. Outstanding instructors.',
    course: 'Sketching',
    role: 'Architecture Student',
    helpfulCount: 14,
    createdAt: new Date(Date.now() - 86400000 * 42).toISOString(),
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
    const { name, rating, comment, course, title, role } = req.body;

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
      title: title ? title.trim() : '',
      role: role ? role.trim() : 'Student Artist',
      helpfulCount: 0,
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

// ─── POST /:id/helpful — Upvote a review ─────────────────────────────────────
router.post('/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const updated = await Review.findByIdAndUpdate(
        id,
        { $inc: { helpfulCount: 1 } },
        { new: true }
      );
      if (updated) {
        return res.json({ success: true, helpfulCount: updated.helpfulCount });
      }
    }

    const memoryRev = memoryReviews.find((r) => String(r._id) === String(id));
    if (memoryRev) {
      memoryRev.helpfulCount = (memoryRev.helpfulCount || 0) + 1;
      return res.json({ success: true, helpfulCount: memoryRev.helpfulCount });
    }

    return res.json({ success: true, helpfulCount: 1 });
  } catch (err) {
    console.error('Review helpful vote error:', err);
    return res.status(500).json({ success: false, message: 'Could not record vote' });
  }
});

module.exports = router;
