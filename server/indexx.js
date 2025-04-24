
//index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Root test
app.get('/', (req, res) => {
  res.send('Welcome to MoodFlow backend ❤️');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Backend server is running at http://localhost:${port}`);
});
