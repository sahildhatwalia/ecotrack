const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');

const {
    logActivity,
    getActivities
} = require('../controllers/activityController');

const {
    getLeaderboard
} = require('../controllers/userController');

const {
    getRewards,
    redeemReward
} = require('../controllers/rewardController');

const {
    getAnalytics
} = require('../controllers/analyticsController');

const {
    getWeather
} = require('../controllers/weatherController');


// Activity routes
router.route('/activities').post(protect, logActivity).get(protect, getActivities);

// Leaderboard route
router.route('/leaderboard').get(getLeaderboard);

// Rewards routes
router.route('/rewards').get(getRewards);
router.route('/rewards/:id/redeem').post(protect, redeemReward);

// Analytics route
router.route('/analytics').get(protect, getAnalytics);

// Weather route
router.route('/weather').get(getWeather);

// Notification endpoint
router.post('/notifications/reminders', (req, res) => {
    // In a real app, this would trigger a push notification, email, etc.
    res.status(200).json({ success: true, message: 'Eco reminder sent!' });
});


module.exports = router;
