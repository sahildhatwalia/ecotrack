const Activity = require('../models/Activity');
const User = require('../models/User');
const { validateActivity } = require('../utils/fraudDetection');
const { sendLowTrustAlert, sendMilestoneAlert } = require('../utils/notifications');


// @desc    Log an activity
// @route   POST /api/activities
// @access  Private
exports.logActivity = async (req, res, next) => {
    const { activityType, duration, metadata } = req.body; 
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

    try {
        const user = await User.findById(userId);
        
        // --- 1. Fraud Detection & Trust Scoring ---
        const validation = validateActivity(user, { activityType, distance, duration, metadata });
        
        // Always record the activity attempt
        const activity = await Activity.create({
            user: userId,
            activityType,
            distance,
            duration,
            co2Saved: 0, // Placeholder, calculated below
            points: 0,   // Placeholder, calculated below
            trustScore: validation.trustScore,
            metadata: {
                ...metadata,
                flags: validation.flags
            }
        });

        // Only reward points if trust score is acceptable (> 60)
        if (!validation.isValid) {
            user.trustScore = validation.trustScore;
            await user.save();
            
            // --- ALERT INTEGRATION ---
            sendLowTrustAlert(user);

            return res.status(403).json({
                success: false,
                message: 'Activity flagged for suspicious patterns. Reward withheld.',
                trustScore: validation.trustScore,
                flags: validation.flags
            });
        }

    // CO2 saved and points calculation (Refined Coefficients)
    // Values based on average displacement from internal combustion engine vehicles (approx 0.2kg/km)
    const COEFFICIENTS = {
        'Walking': { co2: 0.16, points: 15 },
        'Running': { co2: 0.18, points: 25 },
        'Cycling': { co2: 0.21, points: 20 },
        'Public Transport': { co2: 0.10, points: 8 },
        'EV Trip': { co2: 0.06, points: 5 },
        'Recycling': { co2: 1.5, points: 30 },
        'Energy Saving': { co2: 3.0, points: 50 }
    };

    let baseCalc = COEFFICIENTS[activityType] || { co2: 0.1, points: 10 };
    let co2Saved = (activityType === 'Recycling' || activityType === 'Energy Saving') 
        ? baseCalc.co2 
        : distance * baseCalc.co2;
    
    let basePoints = (activityType === 'Recycling' || activityType === 'Energy Saving')
        ? baseCalc.points
        : Math.floor(distance * baseCalc.points);

    // --- SPECIALIZED TRACKING MODULES ---
    
    let multiplier = 1.0;
    const now = new Date();
    const currentHour = now.getHours();

    // 1. Peak Hour Impact Module (Reducing urban congestion)
    const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 19);
    if (isPeakHour) {
        multiplier += 0.25; // 25% bonus for reducing peak traffic
    }

    // 2. Weather Hardship Module (Data from metadata)
    if (metadata?.weather?.toLowerCase().includes('rain') || metadata?.weather?.toLowerCase().includes('snow')) {
        multiplier += 0.15; // 15% bonus for eco-effort in bad weather
    }

    // 3. User Consistency Streak Module
    const lastActivity = user.lastActivities[user.lastActivities.length - 1];
    if (lastActivity) {
        const timeDiff = now - new Date(lastActivity.date);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        if (hoursDiff < 24) {
            multiplier += 0.1; // 10% daily consistency boost
        }
    }

    const finalPoints = Math.floor(basePoints * multiplier);

        // Update activity record with final values
        activity.co2Saved = Math.round(co2Saved * 100) / 100;
        activity.points = finalPoints;
        activity.metadata.multipliers = {
            peakHour: isPeakHour,
            weatherBonus: multiplier > 1.25, // simple flag
            totalMultiplier: multiplier
        };
        await activity.save();

        // --- 2. Update User Stats & Behavior Data ---
        const oldPoints = user.points;
        const newPoints = oldPoints + finalPoints;
        
        user.carbonFootprint += co2Saved;
        user.points = newPoints;
        user.trustScore = validation.trustScore;

        // Behavior tracking: store last 5 activities
        user.lastActivities.push({ 
            type: activityType, 
            distance: Math.round(distance * 10) / 10, 
            date: now 
        });
        if (user.lastActivities.length > 10) user.lastActivities.shift();

        // Daily activity capping/tracking
        const todayStr = now.toISOString().split('T')[0];
        const currentCount = user.dailyActivityCount.get(todayStr) || 0;
        user.dailyActivityCount.set(todayStr, currentCount + 1);

        // Milestone reward logic: every 500 points
        const oldMilestone = Math.floor(oldPoints / 500);
        const newMilestone = Math.floor(newPoints / 500);

        let milestoneAwarded = false;
        if (newMilestone > oldMilestone) {
            const voucherCode = 'ECO-ELITE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            user.vouchers.push({
                rewardName: `Impact Milestone (${newMilestone * 500} pts)`,
                code: voucherCode,
                dateRedeemed: now,
                bonusApplied: true
            });
            
            // --- ALERT INTEGRATION ---
            sendMilestoneAlert(user, voucherCode);
            
            milestoneAwarded = true;
        }

        await user.save();

        res.status(201).json({
            success: true,
            data: activity,
            multipliers: {
                total: multiplier,
                peak: isPeakHour
            },
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

