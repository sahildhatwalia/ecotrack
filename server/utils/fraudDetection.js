// Calculate Trust Score and Validate Activities
const validateActivity = (user, activityData) => {
    let trustScore = user.trustScore || 100;
    const { activityType, distance, duration, metadata } = activityData;
    const flags = [];

    // 1. GPS Accuracy Check
    if (metadata?.gpsAccuracy > 50) {
        trustScore -= 20;
        flags.push('poor_gps_accuracy');
    } else if (metadata?.gpsAccuracy > 30) {
        flags.push('suspicious_gps_accuracy');
    }

    // 2. Mock Location Detection
    if (metadata?.isMockLocation) {
        trustScore -= 50; 
        flags.push('fake_gps_app');
    }

    // 3. Speed Consistency Check
    const topSpeedKmH = metadata?.topSpeed || 0;
    if (activityType === 'Walking' && topSpeedKmH > 15) {
        trustScore -= 30;
        flags.push('unrealistic_walking_speed');
    }
    if (activityType === 'Cycling' && (topSpeedKmH > 45 || topSpeedKmH < 5)) {
        trustScore -= 20;
        flags.push('unrealistic_cycling_speed');
    }

    // 4. Step Fraud Detection
    if (activityType === 'Walking') {
        const stepCount = metadata?.stepCount || 0;
        const avgFreq = metadata?.avgStepFrequency || 0;

        // Steps but no movement
        if (stepCount > 1000 && distance < 0.1) {
            trustScore -= 25;
            flags.push('steps_without_movement');
        }

        // High frequency (shaking)
        if (avgFreq > 3) {
            trustScore -= 30;
            flags.push('unrealistic_step_frequency');
        }
    }

    // 5. Behavior Pattern Analysis
    const today = new Date().toISOString().split('T')[0];
    const dailyCount = user.dailyActivityCount?.get(today) || 0;
    
    // Check for identical repeated patterns (simplified)
    const recentIdentical = user.lastActivities?.filter(a => 
        a.type === activityType && 
        Math.abs(a.distance - distance) < 0.01
    ).length || 0;

    if (recentIdentical > 3) {
        trustScore -= 15;
        flags.push('repeated_pattern_detected');
    }

    // Ensure trustScore doesn't go below 0
    trustScore = Math.max(0, trustScore);

    return {
        trustScore,
        isValid: trustScore > 60,
        flags
    };
};

module.exports = { validateActivity };
