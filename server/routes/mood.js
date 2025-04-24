const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Mood = require('../models/moods');

console.log('✅ moodRoutes loaded');

router.get('/test', (req, res) => {
  res.send('Mood routes working ✅');
});

router.post('/add', verifyToken, async (req, res) => {
  console.log("🔍 Debug: User ID from token:", req.userId);
  console.log("🔍 Debug: Request body:", req.body);

  try {
    const { mood, note } = req.body;

    if (!mood) {
      console.error("❌ Error: Mood is required");
      return res.status(400).json({ message: 'Mood is required' });
    }

    if (!req.userId) {
      console.error("❌ Error: User ID is missing from the token");
      return res.status(403).json({ message: 'Authentication is required' });
    }

    const newMood = new Mood({
      userId: req.userId,
      mood,
      note,
      date: new Date(),
    });

    const savedMood = await newMood.save();
    console.log("✅ Debug: Mood saved successfully:", savedMood);

    res.status(201).json({ message: 'Mood added successfully', mood: savedMood });
  } catch (error) {
    console.error("❌ Error adding mood:", error.message);
    res.status(500).json({ message: 'Server he error' });
  }
});

router.get('/all', verifyToken, async (req, res) => {
  console.log("🔍 Debug: User ID from token:", req.userId);

  try {
    const moods = await Mood.find({ userId: req.userId }).sort({ date: -1 });
    console.log("✅ Debug: Retrieved moods:", moods);
    res.status(200).json(moods);
  } catch (err) {
    console.error("❌ Error retrieving moods:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/weekly', verifyToken, async (req, res) => {
  console.log("🔍 Debug: User ID from token:", req.userId);

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moods = await Mood.find({
      userId: req.userId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    console.log("✅ Debug: Retrieved weekly moods:", moods);
    res.status(200).json(moods);
  } catch (err) {
    console.error("❌ Error retrieving weekly moods:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  console.log("🔍 Debug: User ID from token:", req.userId);
  console.log("🔍 Debug: Mood ID to delete:", req.params.id);

  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!mood) {
      console.error("❌ Error: Mood not found");
      return res.status(404).json({ message: 'Mood not found' });
    }

    console.log("✅ Debug: Mood deleted successfully:", mood);
    res.status(200).json({ message: 'Mood deleted' });
  } catch (err) {
    console.error("❌ Error deleting mood:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  console.log("🔍 Debug: User ID from token:", req.userId);
  console.log("🔍 Debug: Mood ID to update:", req.params.id);
  console.log("🔍 Debug: Update data:", req.body);

  const { mood, note } = req.body;
  try {
    const updatedMood = await Mood.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { mood, note },
      { new: true }
    );

    if (!updatedMood) {
      console.error("❌ Error: Mood not found");
      return res.status(404).json({ message: 'Mood not found' });
    }

    console.log("✅ Debug: Mood updated successfully:", updatedMood);
    res.status(200).json(updatedMood);
  } catch (err) {
    console.error("❌ Error updating mood:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/test', verifyToken, (req, res) => {
  res.status(200).json({
    message: '✅ Mood route works!',
    userId: req.userId,
  });
});

module.exports = router;