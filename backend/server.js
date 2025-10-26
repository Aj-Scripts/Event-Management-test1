const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/bookings');
const analyticsRoutes = require('./routes/analytics');

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow flexible frontend origin during development. Set FRONTEND_URL in .env for production.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const allowedLocalOrigins = [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-to-server, curl)
    if (!origin) return callback(null, true);
    if (allowedLocalOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: This origin is not allowed')); 
  },
  credentials: true
}));
app.use(express.json());

// Serve uploaded files (event images)
const path = require('path');
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
