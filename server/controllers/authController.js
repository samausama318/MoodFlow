const User = require('../models/user');
const jwt = require('jsonwebtoken');



// إنشاء توكن
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// تسجيل حساب
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'Username already exists' });

    const newUser = await User.create({ username, password });
    const token = generateToken(newUser._id);

    res.status(201).json({ user: newUser.username, token });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// تسجيل دخول
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.status(200).json({ user: user.username, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser };
