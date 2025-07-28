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

// PATCH: Update complaint status with assignment logic
router.patch('/:id', async (req, res) => {
  try {
    const { status, govId } = req.body; // govId = gov employee email or id
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status === 'in progress') {
      if (complaint.assignedTo && complaint.assignedTo !== govId) {
        return res.status(400).json({ message: 'This complaint is already in progress by another employee.' });
      }
      // Count in-progress for this gov
      const inProgressCount = await Complaint.countDocuments({ assignedTo: govId, status: 'in progress' });
      if (!complaint.assignedTo && inProgressCount >= 3) {
        return res.status(400).json({ message: 'You already have 3 complaints in progress.' });
      }
      complaint.status = 'in progress';
      complaint.assignedTo = govId;
      await complaint.save();
      return res.json(complaint);
    }

    if (status === 'success') {
      if (complaint.assignedTo !== govId) {
        return res.status(400).json({ message: 'Only the assigned employee can mark this as success.' });
      }
      complaint.status = 'success';
      await complaint.save();
      return res.json(complaint);
    }

    // Pending: anyone can set to pending, clear assignment
    if (status === 'pending') {
      complaint.status = 'pending';
      complaint.assignedTo = null;
      await complaint.save();
      return res.json(complaint);
    }

    // Default: just update status
    complaint.status = status;
    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Remove a complaint by ID
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;