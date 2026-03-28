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

        // --- DYNAMIC PRICING ALGORITHM ---
        // Reward price is lower for users with higher trust scores
        // Max discount of 20% for trust score of 100
        const trustFactor = (user.trustScore || 0) / 100;
        const discountMultiplier = 1 - (trustFactor * 0.2); 
        const finalPrice = Math.floor(reward.pointsRequired * discountMultiplier);

        if (user.points < finalPrice) {
            return res.status(400).json({ 
                success: false, 
                message: `Insufficient points. For your trust level, this reward costs ${finalPrice} pts.`,
                pointsRequired: finalPrice 
            });
        }

        // Deduct points from user
        user.points -= finalPrice;

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
            message: `Reward redeemed successfully at a ${Math.round((1 - discountMultiplier) * 100)}% trust-based discount!`,
            data: {
                voucherCode,
                rewardName: reward.name,
                pointsDeducted: finalPrice
            }
        });
    } catch (err) {
        next(err);
    }
};

