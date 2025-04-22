// Load environment variables
require('dotenv').config();

// Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');    // Auth routes
const moodRoutes = require('./routes/mood');    // Mood routes

const app = express();

// Middleware
app.use(cors());                   // Handle CORS
app.use(express.json());          // Parse incoming JSON

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);   // http://localhost:5000/api/auth/...
app.use('/api/mood', moodRoutes);   // http://localhost:5000/api/mood/...

// Default route
app.get('/', (req, res) => {
  res.send('🎉 Welcome to MoodFlow Backend!');
});
app.get('/test', (req, res) => {
  res.send('Hello from test!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});




