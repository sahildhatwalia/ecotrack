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

        // Generate a random voucher code
        const voucherCode = 'ECO-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // Add to user's vouchers
        user.vouchers.push({
            rewardName: reward.name,
            code: voucherCode,
            dateRedeemed: Date.now()
        });

        await user.save();

        res.status(200).json({ 
            success: true, 
            message: 'Reward redeemed successfully',
            data: {
                voucherCode,
                rewardName: reward.name
            }
        });
    } catch (err) {
        next(err);
    }
};
