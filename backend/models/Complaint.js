const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

complaintSchema.index({ location: '2dsphere' }); // Geospatial index

module.exports = mongoose.model('Complaint', complaintSchema);