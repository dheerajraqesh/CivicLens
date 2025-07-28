const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, enum: ['citizen', 'gov'], required: true }, // citizen or gov
  fullName: { type: String },
  phone: { type: String },
  address: { type: String },
  age: { type: String },
  department: { type: String, required: function() { return this.type === 'gov' } },
  organization: { type: String, required: function() { return this.type === 'gov' } },
  createdAt: { type: Date, default: Date.now },
  completedTasks: { type: [String], default: [] }, // array of completed complaint IDs
});

module.exports = mongoose.model('User', UserSchema);
