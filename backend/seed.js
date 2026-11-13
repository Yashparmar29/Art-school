/**
 * Database Seeder — Create Art School
 *
 * Populates the MongoDB database with initial services and sample reviews.
 * Usage:  node seed.js   (or:  npm run seed)
 *
 * ⚠️  This script clears ALL existing services and reviews before inserting.
 */

require('dotenv').config();

const mongoose = require('mongoose');
const Service = require('./models/Service');
const Review = require('./models/Review');

// ─── Seed Data ───────────────────────────────────────────────────────────────

const services = [
  {
    title: 'Drawing',
    description:
      'Master the fundamentals of drawing with pencil, charcoal, and ink. Learn perspective, shading, proportions, and composition through guided exercises and still-life studies.',
    price: 2000,
    duration: '1.5 hrs',
    icon: '✏️',
  },
  {
    title: 'Painting',
    description:
      'Explore acrylic and oil painting techniques. From colour theory to brush-work, develop your own style while creating stunning canvases under expert guidance.',
    price: 2500,
    duration: '2 hrs',
    icon: '🎨',
  },
  {
    title: 'Sketching',
    description:
      'Quick, expressive sketching sessions focused on gesture drawing, urban sketching, and rapid visual storytelling. Perfect for building confidence on paper.',
    price: 1800,
    duration: '1 hr',
    icon: '📝',
  },
  {
    title: 'Watercolor',
    description:
      'Discover the beauty of watercolour painting. Learn wet-on-wet, dry-brush, and layering techniques to create luminous landscapes, florals, and portraits.',
    price: 2200,
    duration: '1.5 hrs',
    icon: '💧',
  },
  {
    title: 'Digital Art',
    description:
      'Create stunning digital illustrations using industry-standard tools. Covers digital painting, vector art, photo manipulation, and concept-art workflows.',
    price: 3000,
    duration: '2 hrs',
    icon: '💻',
  },
  {
    title: 'Kids Art Classes',
    description:
      'Fun, age-appropriate art activities for children aged 5–12. Encourage creativity through crafts, colouring, clay modelling, and guided painting projects.',
    price: 1500,
    duration: '1 hr',
    icon: '👶',
  },
  {
    title: 'Weekend Workshops',
    description:
      'Intensive weekend sessions covering a specific medium or theme — from portrait drawing to abstract art. Walk away with a finished piece every session!',
    price: 1000,
    duration: '3 hrs',
    icon: '🖌️',
  },
  {
    title: 'Portfolio Prep',
    description:
      'Tailored mentoring for students preparing art-school applications or professional portfolios. Includes critique sessions, project planning, and presentation coaching.',
    price: 5000,
    duration: '2 hrs',
    icon: '📁',
  },
];

const reviews = [
  {
    name: 'Ananya Sharma',
    rating: 5,
    comment:
      'Create Art School has been an incredible experience! The painting classes helped me discover a style I never knew I had. The teachers are patient and truly passionate about art.',
    course: 'Painting',
  },
  {
    name: 'Rohan Mehta',
    rating: 4,
    comment:
      'I joined the weekend workshops and they exceeded my expectations. Each session is packed with learning and you get a finished piece to take home. Highly recommended!',
    course: 'Weekend Workshops',
  },
  {
    name: 'Priya Iyer',
    rating: 5,
    comment:
      'My daughter loves the Kids Art Classes! She comes home every week excited to show us what she created. The instructors are wonderful with children.',
    course: 'Kids Art Classes',
  },
  {
    name: 'Vikram Desai',
    rating: 4,
    comment:
      'The Drawing course gave me a solid foundation. I went from barely being able to sketch to creating realistic portraits in just three months. Great curriculum!',
    course: 'Drawing',
  },
  {
    name: 'Sneha Kulkarni',
    rating: 5,
    comment:
      'Portfolio Prep was exactly what I needed for my design-school applications. The mentors provided detailed, constructive feedback and helped me curate my best work.',
    course: 'Portfolio Prep',
  },
  {
    name: 'Arjun Nair',
    rating: 4,
    comment:
      'Digital Art classes here are top-notch. The instructor breaks down complex tools into simple steps. I am now confident using Photoshop and Procreate for my freelance projects.',
    course: 'Digital Art',
  },
];

// ─── Seed Runner ─────────────────────────────────────────────────────────────

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    console.log('🗑️   Cleared existing services');

    await Review.deleteMany({});
    console.log('🗑️   Cleared existing reviews');

    // Insert seed data
    const insertedServices = await Service.insertMany(services);
    console.log(`📦  Inserted ${insertedServices.length} services`);

    const insertedReviews = await Review.insertMany(reviews);
    console.log(`📦  Inserted ${insertedReviews.length} reviews`);

    console.log('\n🎉  Database seeded successfully!');
  } catch (err) {
    console.error('❌  Seeding error:', err.message);
    process.exit(1);
  } finally {
    // Always disconnect when done
    await mongoose.disconnect();
    console.log('🔌  Disconnected from MongoDB');
  }
}

seed();
