const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  pointsRequired: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    default: 'EcoTrack'
  },
  logo: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png'
  },
  category: {
    type: String,
    enum: ['Shopping', 'Food', 'Travel', 'Entertainment', 'Other'],
    default: 'Shopping'
  },
  validUntil: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reward', RewardSchema);
