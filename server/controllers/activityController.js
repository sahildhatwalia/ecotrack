const Activity = require('../models/Activity');
const User = require('../models/User');

// @desc    Log an activity
// @route   POST /api/activities
// @access  Private
exports.logActivity = async (req, res, next) => {
    const { activityType, duration } = req.body; 
    let { distance } = req.body;
    const userId = req.user.id;

    // Simulate location API: if distance is not provided, generate a random one based on duration or default
    if (!distance) {
         const randomMultiplier = duration ? (duration / 10) : (Math.random() * 5 + 1);
         if (activityType === 'Walking') distance = 1.5 * randomMultiplier;
         else if (activityType === 'Cycling') distance = 3.5 * randomMultiplier;
         else if (activityType === 'Public Transport') distance = 10 * randomMultiplier;
         else distance = 1; // Default for non-movement
    }

    // CO2 saved and points calculation (simple example)
    let co2Saved = 0;
    let points = 0;

    switch (activityType) {
        case 'Walking':
            co2Saved = distance * 0.15; // kg of CO2 saved per km
            points = Math.floor(distance * 12);
            break;
        case 'Public Transport':
            co2Saved = distance * 0.08;
            points = Math.floor(distance * 5);
            break;
        case 'Cycling':
            co2Saved = distance * 0.25;
            points = Math.floor(distance * 20);
            break;
        case 'Recycling':
            co2Saved = 1.2; // kg of CO2 saved per recycling action
            points = 25;
            break;
        case 'Energy Saving':
            co2Saved = 2.5; // kg of CO2 saved per energy saving action
            points = 40;
            break;
        default:
            return res.status(400).json({ success: false, message: 'Invalid activity type' });
    }

    try {
        const activity = await Activity.create({
            user: userId,
            activityType,
            co2Saved,
            points
        });

        // Update user's carbon footprint and points
        const user = await User.findById(userId);
        const oldPoints = user.points;
        const newPoints = oldPoints + points;
        
        user.carbonFootprint += co2Saved;
        user.points = newPoints;

        // Milestone reward logic: every 500 points
        const oldMilestone = Math.floor(oldPoints / 500);
        const newMilestone = Math.floor(newPoints / 500);

        let milestoneAwarded = false;
        if (newMilestone > oldMilestone) {
            const voucherCode = 'MILE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            user.vouchers.push({
                rewardName: `Milestone Reward (${newMilestone * 500} pts)`,
                code: voucherCode,
                dateRedeemed: Date.now()
            });
            milestoneAwarded = true;
        }

        await user.save();

        res.status(201).json({
            success: true,
            data: activity,
            milestone: milestoneAwarded
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all activities for a user
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res, next) => {
    try {
        const activities = await Activity.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: activities.length,
            data: activities
        });
    } catch (err) {
        next(err);
    }
};
