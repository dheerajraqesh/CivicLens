const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, type } = req.body;
    if (!username || !email || !password || !type) {
      return res.status(400).json({ message: 'All fields required' });
    }
    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    // Password validation: min 8 chars, uppercase, lowercase, digit, special char
    const passwordValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
    if (!passwordValid) {
      return res.status(400).json({ message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character." });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, type });
    await user.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Allow login by username or email
    const user = await User.findOne({ $or: [ { username }, { email } ] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ username: user.username, email: user.email, type: user.type });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
