const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Mood = require('../models/Mood');

// Debug log
console.log('✅ moodRoutes loaded');


router.get('/test', (req, res) => {
  res.send('Mood routes working ✅');
});


// ✅ [POST] Add new mood
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { mood, note } = req.body;

    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }

    const newMood = new Mood({
      userId: req.userId,
      mood,
      note,
    });

    const savedMood = await newMood.save();
    res.status(201).json({ message: 'Mood added successfully', mood: savedMood });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ [GET] Get all moods for user
router.get('/all', verifyToken, async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ [GET] Get moods for last 7 days
router.get('/weekly', verifyToken, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moods = await Mood.find({
      userId: req.userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    res.status(200).json(moods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ [DELETE] Delete mood by ID
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!mood) {
      return res.status(404).json({ message: 'Mood not found' });
    }

    res.status(200).json({ message: 'Mood deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ [PUT] Edit mood by ID
router.put('/:id', verifyToken, async (req, res) => {
  const { mood, note } = req.body;
  try {
    const updatedMood = await Mood.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { mood, note },
      { new: true }
    );

    if (!updatedMood) {
      return res.status(404).json({ message: 'Mood not found' });
    }

    res.status(200).json(updatedMood);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ [GET] Test route (Protected)
router.get('/test', verifyToken, (req, res) => {
  res.status(200).json({
    message: '✅ Mood route works!',
    userId: req.userId
  });
});

module.exports = router;
