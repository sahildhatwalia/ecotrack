const Reward = require('../models/Reward');
const User = require('../models/User');

// @desc    Get all rewards
// @route   GET /api/rewards
// @access  Public
exports.getRewards = async (req, res, next) => {
    try {
        const rewards = await Reward.find();
        res.status(200).json({ success: true, data: rewards });
    } catch (err) {
        next(err);
    }
};

// @desc    Redeem a reward
// @route   POST /api/rewards/:id/redeem
// @access  Private
exports.redeemReward = async (req, res, next) => {
    try {
        const reward = await Reward.findById(req.params.id);
        const user = await User.findById(req.user.id);

        if (!reward) {
            return res.status(404).json({ success: false, message: 'Reward not found' });
        }

        if (user.points < reward.pointsRequired) {
            return res.status(400).json({ success: false, message: 'Not enough points to redeem this reward' });
        }

        // Deduct points from user
        user.points -= reward.pointsRequired;
        await user.save();

        // Here you might want to create a record of the redemption
        // For now, we just send a success message

        res.status(200).json({ success: true, message: 'Reward redeemed successfully' });
    } catch (err) {
        next(err);
    }
};
