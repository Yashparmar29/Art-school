/**
 * Database Seeder — Art School
 *
 * Populates the MongoDB database with initial services and sample reviews.
 * Usage:  node seed.js   (or:  npm run seed)
 *
 * ⚠️  This script clears ALL existing services and reviews before inserting.
 */

require('dotenv').config();

const dns = require('dns');
if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');

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
    title: 'Found my artistic voice & confidence',
    comment:
      'Art School has been an incredible experience! The painting classes helped me discover a style I never knew I had. The teachers are patient and truly passionate about art.',
    course: 'Painting',
    role: 'Adult Hobbyist',
    helpfulCount: 18,
  },
  {
    name: 'Rohan Mehta',
    rating: 4,
    title: 'Energizing weekend creative escape',
    comment:
      'I joined the weekend workshops and they exceeded my expectations. Each session is packed with learning and you get a finished piece to take home. Highly recommended!',
    course: 'Weekend Workshops',
    role: 'Working Professional',
    helpfulCount: 12,
  },
  {
    name: 'Priya Iyer',
    rating: 5,
    title: 'My daughter’s highlight of the week!',
    comment:
      'My daughter loves the Kids Art Classes! She comes home every week excited to show us what she created. The instructors are wonderful with children.',
    course: 'Kids Art Classes',
    role: 'Parent of Student (Age 8)',
    helpfulCount: 25,
  },
  {
    name: 'Vikram Desai',
    rating: 4,
    title: 'Solid fundamentals from scratch',
    comment:
      'The Drawing course gave me a solid foundation. I went from barely being able to sketch to creating realistic portraits in just three months. Great curriculum!',
    course: 'Drawing',
    role: 'Beginner Student',
    helpfulCount: 9,
  },
  {
    name: 'Sneha Kulkarni',
    rating: 5,
    title: 'Cracked admission to top design college!',
    comment:
      'Portfolio Prep was exactly what I needed for my design-school applications. The mentors provided detailed, constructive feedback and helped me curate my best work.',
    course: 'Portfolio Prep',
    role: 'Design Aspirant',
    helpfulCount: 31,
  },
  {
    name: 'Arjun Nair',
    rating: 4,
    title: 'Top-tier digital illustration techniques',
    comment:
      'Digital Art classes here are top-notch. The instructor breaks down complex tools into simple steps. I am now confident using Photoshop and Procreate for my freelance projects.',
    course: 'Digital Art',
    role: 'Freelance Illustrator',
    helpfulCount: 15,
  },
  {
    name: 'Meera Nambiar',
    rating: 5,
    title: 'Therapeutic and deeply fulfilling watercolors',
    comment:
      'The watercolor sessions are pure therapy. Learning the fluidity of wet-on-wet painting under master guidance in their Koramangala studio changed how I spend my weekends.',
    course: 'Watercolor',
    role: 'Intermediate Painter',
    helpfulCount: 11,
  },
  {
    name: 'Karan Joshi',
    rating: 5,
    title: 'Fast, intuitive urban sketching methods',
    comment:
      'Loved the urban sketching sessions! We took our sketchbooks around Koramangala cafes and parks, capturing live city moments with quick ink and wash. Outstanding instructors.',
    course: 'Sketching',
    role: 'Architecture Student',
    helpfulCount: 14,
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
