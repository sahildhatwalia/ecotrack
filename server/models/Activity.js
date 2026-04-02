const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['Walking', 'Running', 'Cycling', 'Public Transport', 'EV Trip', 'Recycling', 'Energy Saving']
  },
  co2Saved: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  distance: {
    type: Number
  },
  duration: {
    type: Number
  },
  // Fraud detection metadata
  trustScore: {
    type: Number,
    default: 100
  },
  metadata: {
    gpsAccuracy: Number,
    isMockLocation: { type: Boolean, default: false },
    topSpeed: Number,
    stepCount: Number,
    avgStepFrequency: Number,
    rawPath: [{
      lat: Number,
      lng: Number,
      timestamp: Date,
      speed: Number,
      accuracy: Number
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', ActivitySchema);
