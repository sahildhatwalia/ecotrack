/**
 * Advanced AI-based Trust Score & Activity Validation
 * Simulates a behavior-based pattern recognition system
 */
const validateActivity = (user, activityData) => {
    let currentTrust = user.trustScore || 100;
    const { activityType, distance, duration, metadata } = activityData;
    const flags = [];
    
    // START ANALYSIS: Base Trust for this activity
    let activityTrust = 100;

    // 1. Time-of-Day Contextual Analysis
    const hour = new Date().getHours();
    if ((hour >= 1 && hour <= 4) && activityType !== 'Public Transport') {
        // High intensity activities at odd hours are suspicious
        activityTrust -= 15;
        flags.push('odd_hour_activity');
    }

    // 2. GPS Accuracy & Mock Detection
    if (metadata?.gpsAccuracy > 50) {
        activityTrust -= 20;
        flags.push('poor_gps_accuracy');
    }
    if (metadata?.isMockLocation) {
        activityTrust -= 70; // Heavy penalty for mock GPS
        flags.push('mock_location_detected');
    }

    // 3. Velocity Consistency AI (Simulated)
    // Avg Speed = Distance (km) / (Duration (min) / 60)
    const durationHours = (duration || 5) / 60; // Assume 5 mins if not provided
    const avgSpeed = (distance || 0) / durationHours;
    
    const speedLimits = {
        'Walking': { max: 15, min: 2, typical: 5 },
        'Cycling': { max: 55, min: 5, typical: 15 },
        'Public Transport': { max: 140, min: 10, typical: 40 }
    };

    const limit = speedLimits[activityType];
    if (limit) {
        if (avgSpeed > limit.max) {
            activityTrust -= 50;
            flags.push('impossible_velocity');
        } else if (avgSpeed < limit.min && distance > 0.1) {
            activityTrust -= 15;
            flags.push('unusually_slow_movement');
        }
        
        // Deviation from typical speed (stochastic model)
        const deviation = Math.abs(avgSpeed - limit.typical) / limit.typical;
        if (deviation > 2.0 && activityType !== 'Public Transport') {
            activityTrust -= 10;
            flags.push('abnormal_behavior_pattern');
        }
    }

    // 4. Teleportation Check (GPS Jumps)
    if (metadata?.lastLocation && metadata?.currentLocation) {
        const timeDiff = (new Date() - new Date(metadata.lastLocationTime)) / 1000; // seconds
        const distDiff = calculateDistance(metadata.lastLocation, metadata.currentLocation);
        const jumpSpeed = (distDiff / (timeDiff / 3600)); // km/h
        
        if (jumpSpeed > 400) { 
            activityTrust -= 60;
            flags.push('gps_teleportation_detected');
        }
    }

    // 5. Robotic Pattern Analysis (ML Sequence Prediction Simulation)
    const recentActivities = user.lastActivities || [];
    const identicalMatches = recentActivities.filter(a => 
        a.type === activityType && 
        Math.abs(a.distance - distance) < 0.0001
    ).length;

    if (identicalMatches >= 2) {
        activityTrust -= 30;
        flags.push('robotic_pattern_detected');
    }

    // 6. Step vs Distance Correlation
    if (activityType === 'Walking' && metadata?.stepCount) {
        const expectedStepsPerKm = 1350; 
        const actualStepsPerKm = metadata.stepCount / (distance || 0.001);
        
        if (actualStepsPerKm < 600 || actualStepsPerKm > 4000) {
            activityTrust -= 30;
            flags.push('unnatural_step_distribution');
        }
    }

    // --- TRUST UPDATING ALGORITHM ---
    // If activity is clean, trust score recovers slowly (+1 per clean activity)
    // If activity is suspicious, trust score drops significantly
    
    let newScore;
    if (activityTrust >= 80 && flags.length === 0) {
        newScore = Math.min(100, currentTrust + 2); // Correct behavior rewarded
    } else {
        newScore = Math.max(0, currentTrust - (100 - activityTrust));
    }

    return {
        trustScore: newScore,
        activityTrust,
        isValid: activityTrust >= 65 && newScore >= 50, 
        flags,
        probabilityOfFraud: (100 - activityTrust) / 100
    };
};

/**
 * Helper to calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(loc1, loc2) {
    if (!loc1 || !loc2) return 0;
    const R = 6371; // Radius of the Earth in km
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLon = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

module.exports = { validateActivity };

