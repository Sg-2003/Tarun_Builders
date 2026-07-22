require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const seedDatabase = require('./config/seeder');

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsRoutes = require('./routes/newsRoutes');
const tenderRoutes = require('./routes/tenderRoutes');
const careerRoutes = require('./routes/careerRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Connect DB and seed
connectDB().then(() => {
  seedAdmin();
  seedDatabase();
});

const app = express();

// Security
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: 'Too many requests' }));

// CORS
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:4200', 'http://localhost:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => res.json({
  success: true,
  message: '🏗️ Tarun Builders API is running!',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tenders', tenderRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Tarun Builders Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
