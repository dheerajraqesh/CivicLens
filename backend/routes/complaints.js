const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// POST: Create a complaint
router.post('/', async (req, res) => {
  try {
    const { description, category, latitude, longitude } = req.body;
    const complaint = new Complaint({
      description,
      category,
      location: { type: 'Point', coordinates: [longitude, latitude] }
    });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Retrieve complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;