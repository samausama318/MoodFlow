console.log('Current working directory:', process.cwd());

process.on('uncaughtException', (err) => {
  console.error('Unhandled exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);
const fs = require('fs');

if (fs.existsSync('.env')) {
    console.log('.env file found!');
} else {
    console.error('.env file is missing!');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');

const app = express();

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:5173', 'http://moodflow-frontend:5173'],
  credentials: true,
}));

if (!process.env.MONGO_URI) {
  console.error('Environment variable MONGO_URI is not defined!');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);

app.get('/', (req, res) => {
  res.send('🎉 Welcome to MoodFlow Backend!');
});

app.get('/test', (req, res) => {
  res.send('Hello from test!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});