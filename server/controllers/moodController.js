//moodController

const Mood = require("../models/Mood");

// ✅ [GET] Get all moods
const getAllMoods = async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.userId }).sort({ date: -1 });
    res.status(200).json(moods);
  } catch (error) {
    console.error("Error fetching moods:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ [POST] Add a new mood
const addMood = async (req, res) => {
  try {
    console.log("Request body:", req.body); // تسجيل بيانات الطلب

    const { mood, note } = req.body;

    // التحقق من البيانات
    if (!mood) {
      return res.status(400).json({ message: "Mood is required" });
    }

    // إنشاء المزاج الجديد
    const newMood = new Mood({
      userId: req.userId, // استخدم userId من التوكن
      mood,
      note,
    });

    // حفظ المزاج
    const savedMood = await newMood.save();

    console.log("Mood saved successfully:", savedMood); // تسجيل المزاج المحفوظ
    res.status(201).json({ message: "Mood added successfully", mood: savedMood });
  } catch (error) {
    console.error("Error adding mood:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ [PUT] Update mood by ID
const updateMood = async (req, res) => {
  const { mood, note } = req.body;
  try {
    const updatedMood = await Mood.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { mood, note },
      { new: true }
    );

    if (!updatedMood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.status(200).json(updatedMood);
  } catch (err) {
    console.error("Error updating mood:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ [DELETE] Delete mood by ID
const deleteMood = async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    res.status(200).json({ message: "Mood deleted" });
  } catch (err) {
    console.error("Error deleting mood:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ [GET] Get moods for last 7 days
const getWeeklyMoods = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moods = await Mood.find({
      userId: req.userId,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    res.status(200).json(moods);
  } catch (err) {
    console.error("Error fetching weekly moods:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllMoods,
  addMood,
  updateMood,
  deleteMood,
  getWeeklyMoods,
};
