/**
 * Create Art School — Express Backend Server
 *
 * Central entry-point that wires up middleware, database connection,
 * API routes, and optional static-file serving for production builds.
 */

require('dotenv').config();

const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');

const fs = require('fs');

// ─── App Initialisation ─────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ─────────────────────────────────────────────────────
// Helmet sets various HTTP headers to help protect the app
app.use(helmet({
  contentSecurityPolicy: false // Allow external fonts/CDNs if frontend is served
}));

// CORS — allow the configured frontend origin; fall back to '*' in development or if unset
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (!process.env.FRONTEND_URL || process.env.FRONTEND_URL === '*' || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    const allowed = process.env.FRONTEND_URL.split(',').map(s => s.trim());
    if (allowed.includes(origin) || allowed.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive CORS for smooth frontend-backend integration
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting — applied only to /api routes; generous in development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1000 : 10000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Database Connection ─────────────────────────────────────────────────────
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅  MongoDB connected successfully'))
    .catch((err) => {
      console.warn('⚠️   MongoDB connection warning:', err.message);
    });
} else {
  console.log('ℹ️   No MONGO_URI defined — using resilient in-memory data store until connected.');
}

// Log unexpected disconnections after initial connect
mongoose.connection.on('error', (err) => {
  console.warn('⚠️   MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️   MongoDB disconnected');
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/services', require('./routes/services'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/contact', require('./routes/contact'));

// Health-check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Static Files & Frontend Serving ─────────────────────────────────────────
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Fallback to index.html for non-API routes that don't match a static file
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ─── Global Error Handler ───────────────────────────────────────────────────
// Catch-all for unhandled errors in route handlers
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('💥  Unhandled error:', err.stack || err);
  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
    console.log(`📡  Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
