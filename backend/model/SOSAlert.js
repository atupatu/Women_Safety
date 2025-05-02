const mongoose = require('mongoose');

const sosAlertSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Document expires after 1 hour
  }
});

module.exports = mongoose.model('SOSAlert', sosAlertSchema);
