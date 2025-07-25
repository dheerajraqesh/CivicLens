const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['citizen', 'gov'], required: true }, // citizen or gov
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
