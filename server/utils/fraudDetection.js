/**
 * Advanced AI-based Trust Score & Activity Validation
 * Simulates a behavior-based pattern recognition system
 */
const validateActivity = (user, activityData) => {
    let trustScore = user.trustScore || 100;
    const { activityType, distance, duration, metadata } = activityData;
    const flags = [];
    
    // 1. Time-of-Day Contextual Analysis
    const hour = new Date().getHours();
    if ((hour >= 1 && hour <= 4) && activityType !== 'Public Transport') {
        // High intensity activities at odd hours are suspicious
        trustScore -= 10;
        flags.push('odd_hour_activity');
    }

    // 2. GPS Accuracy & Mock Detection
    if (metadata?.gpsAccuracy > 50) {
        trustScore -= 15;
        flags.push('poor_gps_accuracy');
    }
    if (metadata?.isMockLocation) {
        trustScore -= 60; // Heavy penalty for mock GPS
        flags.push('mock_location_detected');
    }

    // 3. Velocity Consistency AI (Simulated)
    // Avg Speed = Distance (km) / (Duration (min) / 60)
    const durationHours = (duration || 1) / 60;
    const avgSpeed = distance / durationHours;
    
    const speedLimits = {
        'Walking': { max: 12, min: 2 },
        'Cycling': { max: 50, min: 5 },
        'Public Transport': { max: 120, min: 10 }
    };

    const limit = speedLimits[activityType];
    if (limit) {
        if (avgSpeed > limit.max) {
            trustScore -= 40;
            flags.push('impossible_velocity');
        } else if (avgSpeed < limit.min && distance > 0.1) {
            trustScore -= 10;
            flags.push('unusually_slow_movement');
        }
    }

    // 4. Teleportation Check (GPS Jumps)
    if (metadata?.lastLocation && metadata?.currentLocation) {
        const timeDiff = (new Date() - new Date(metadata.lastLocationTime)) / 1000; // seconds
        const distDiff = calculateDistance(metadata.lastLocation, metadata.currentLocation);
        const jumpSpeed = (distDiff / (timeDiff / 3600)); // km/h
        
        if (jumpSpeed > 300) { // Over 300km/h jump is likely a VPN or fake GPS
            trustScore -= 50;
            flags.push('gps_teleportation_detected');
        }
    }

    // 5. Repetitive Pattern Analysis
    const recentActivities = user.lastActivities || [];
    const identicalMatches = recentActivities.filter(a => 
        a.type === activityType && 
        Math.abs(a.distance - distance) < 0.001
    ).length;

    if (identicalMatches >= 2) {
        trustScore -= 20;
        flags.push('robotic_pattern_detected');
    }

    // 6. Step vs Distance Correlation
    if (activityType === 'Walking' && metadata?.stepCount) {
        const expectedStepsPerKm = 1200; // Rough average
        const actualStepsPerKm = metadata.stepCount / (distance || 0.001);
        
        if (actualStepsPerKm < 400 || actualStepsPerKm > 3000) {
            trustScore -= 25;
            flags.push('unnatural_step_distribution');
        }
    }

    // Ensure trustScore bounds
    trustScore = Math.min(100, Math.max(0, trustScore));

    return {
        trustScore,
        isValid: trustScore >= 65, // Stricter threshold for "Production Ready"
        flags,
        probabilityOfFraud: (100 - trustScore) / 100
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
