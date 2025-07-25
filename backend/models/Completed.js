const mongoose = require('mongoose');

const CompletedSchema = new mongoose.Schema({
  description: String,
  category: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number],
  },
  status: { type: String, default: 'success' },
  createdAt: { type: Date, default: Date.now },
  // Optionally, add more fields as needed
});

module.exports = mongoose.model('Completed', CompletedSchema, 'completed');
