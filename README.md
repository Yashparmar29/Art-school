# 🎨 Create Art School

A modern, full-stack website for **Create Art School** — an art education platform offering drawing, painting, sketching, watercolor, digital art, kids classes, weekend workshops, and portfolio preparation courses.

**Project 22/64** | Category: Art School

![Status](https://img.shields.io/badge/status-live-brightgreen)

## ✨ Features

- **7 fully-designed pages**: Home, Services, Gallery, Pricing, Booking, Reviews, Contact
- **Modern design**: Paint-splash SVG accents, Caveat font, deep purple & orange color scheme
- **Responsive**: Mobile-first design with hamburger menu, works on all screen sizes
- **Accessible**: Semantic HTML, alt text, focus states, AA contrast compliance
- **Slide Left animations**: Content slides in from right on scroll (IntersectionObserver)
- **API-powered**: Services, bookings, reviews, and contact form backed by MongoDB
- **Client-side validation**: Phone format (Indian 10-digit), required fields, date validation

## 🛠️ Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML + CSS + Vanilla JavaScript   |
| Backend  | Node.js + Express.js              |
| Database | MongoDB (Mongoose ODM)            |
| Deploy   | Vercel (frontend) + Render (API)  |

## 📁 Project Structure

```
create-art-school/
├── frontend/
│   ├── index.html          # Home page
│   ├── services.html       # Services listing
│   ├── gallery.html        # Student artwork gallery
│   ├── pricing.html        # Pricing plans
│   ├── booking.html        # Class booking form
│   ├── reviews.html        # Student reviews
│   ├── contact.html        # Contact information & form
│   ├── config.js           # Site configuration (colors, fonts, name)
│   ├── css/
│   │   └── styles.css      # Complete stylesheet
│   ├── js/
│   │   ├── main.js         # Shared functionality (nav, animations)
│   │   └── api.js          # API helper module
│   └── assets/             # Images and static assets
├── backend/
│   ├── server.js           # Express server entry point
│   ├── seed.js             # Database seeder
│   ├── package.json        # Node.js dependencies
│   ├── .env.example        # Environment variables template
│   ├── models/
│   │   ├── Booking.js      # Booking schema
│   │   ├── Service.js      # Service schema
│   │   ├── Review.js       # Review schema
│   │   └── Contact.js      # Contact message schema
│   └── routes/
│       ├── bookings.js     # POST /api/bookings
│       ├── services.js     # GET /api/services
│       ├── reviews.js      # GET & POST /api/reviews
│       └── contact.js      # POST /api/contact
├── README.md
└── .gitignore
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ 
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/create-art-school.git
cd create-art-school
```

### 2. Set up the backend
```bash
cd backend
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your values:
```env
MONGO_URI=mongodb://localhost:27017/create-art-school
PORT=5000
FRONTEND_URL=http://localhost:5500
NODE_ENV=development
```

### 4. Seed the database
```bash
npm run seed
```
This populates the database with 8 services and 6 sample reviews.

### 5. Start the backend server
```bash
npm run dev    # Development (auto-reload with nodemon)
# or
npm start      # Production
```
The API will be running at `http://localhost:5000`.

### 6. Serve the frontend
Open `frontend/index.html` with a local server (e.g., VS Code Live Server on port 5500), or:
```bash
cd ../frontend
npx serve -p 5500
```

## 🔌 API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/health`     | Health check             |
| GET    | `/api/services`   | List all services        |
| POST   | `/api/bookings`   | Create a booking         |
| GET    | `/api/reviews`    | List all reviews         |
| POST   | `/api/reviews`    | Submit a review          |
| POST   | `/api/contact`    | Send a contact message   |

### Example: Create a Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Sharma",
    "phone": "9876543210",
    "service": "Painting",
    "date": "2024-12-15",
    "note": "Beginner level, interested in acrylics"
  }'
```

## 🌐 Deployment

### Database (MongoDB Atlas)
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist `0.0.0.0/0` for network access
3. Get the connection string and set it as `MONGO_URI`

### Backend (Render)
1. Connect your GitHub repo to [render.com](https://render.com)
2. Create a new **Web Service**
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables: `MONGO_URI`, `FRONTEND_URL`, `NODE_ENV=production`

### Frontend (Vercel)
1. Connect your GitHub repo to [vercel.com](https://vercel.com)
2. Create a new project
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Other (static)
4. Update `frontend/js/api.js` with your Render backend URL before deploying

## 🎨 Design System

| Property       | Value                  |
|----------------|------------------------|
| Primary Color  | `#2B1A4A` (Deep Purple)|
| Secondary Color| `#FF7A00` (Orange)     |
| Heading Font   | Caveat (Google Fonts)  |
| Body Font      | system-ui, sans-serif  |
| Animation      | Slide Left (0.7s ease) |
| Border Radius  | 16px (cards)           |

## 📄 License

This project is built for educational and portfolio purposes.

---

**Built with ❤️ for Create Art School** | Project 22/64
