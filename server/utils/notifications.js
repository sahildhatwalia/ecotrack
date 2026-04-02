// This utility simulates an automated notification system
// In a real application, you would integrate a service like NodeMailer, SendGrid, or Twilio.

const logNotification = (userId, message, type = 'info') => {
    const timestamp = new Date().toLocaleString();
    const colors = {
        'info': '\x1b[36m', // Cyan
        'alert': '\x1b[31m', // Red
        'success': '\x1b[32m', // Green
        'reset': '\x1b[0m'
    };

    console.log(`${colors.info || ''}[NOTIFICATION][${timestamp}] User ID: ${userId}${colors.reset}`);
    console.log(`> Message: ${message}`);
    console.log(`> Type: ${type.toUpperCase()}`);
};

exports.sendLowTrustAlert = (user) => {
    const message = `Security Alert: Your trust score has dropped to ${user.trustScore}%. To protect our ecosystem, we have temporarily limited your point-earning potential. Please continue verifying your location accurately to recover your status.`;
    logNotification(user._id, message, 'alert');
};

exports.sendMilestoneAlert = (user, voucherCode) => {
    const message = `Congratulations! You've achieved a new sustainability milestone. Your unique voucher code ${voucherCode} is now active in your wallet.`;
    logNotification(user._id, message, 'success');
};

exports.sendDailyTip = (user) => {
    const tips = [
        "Did you know? Switching to a laptop from a desktop computer can save up to 80% on energy consumption.",
        "Take a shorter shower! Reducing your shower time by just 2 minutes saves roughly 30 liters of water.",
        "Eat seasonally. Locally grown food travels less distance and reduces transport-related CO2.",
        "Turn it off! Appliances on standby still use up to 10% of their total power."
    ];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    logNotification(user._id, `Eco-Tip of the Day: ${tip}`, 'info');
};
