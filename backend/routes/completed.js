const express = require('express');
const router = express.Router();
const Completed = require('../models/Completed');

// POST: Add a completed complaint
router.post('/', async (req, res) => {
  try {
    const { description, category, location, status } = req.body;
    const completed = new Completed({
      description,
      category,
      location,
      status: status || 'success',
    });
    await completed.save();
    res.status(201).json(completed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Retrieve completed complaints
router.get('/', async (req, res) => {
  try {
    const completed = await Completed.find();
    res.json(completed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
