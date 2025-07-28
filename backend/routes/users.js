const express = require('express');
const router = express.Router();
const User = require('../models/User');

// PATCH /api/users/:username - update profile fields
router.patch('/:username', async (req, res) => {
  try {
    console.log('PATCH /api/users/:username', req.params.username, req.body);
    const profileFields = ['fullName', 'phone', 'address', 'age', 'department', 'organization'];
    const update = {};
    for (const field of profileFields) {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    }
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: update },
      { new: true }
    ).select('-password');
    if (!user) {
      console.error('User not found:', req.params.username);
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('PATCH /api/users error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:username - get profile fields
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
