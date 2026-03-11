const User = require('../models/User');

// @desc    Register user
// @route   POST /api/user/register
// @access  Public
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res);
};

// @desc    Get current logged in user
// @route   POST /api/user/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
};


// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res, next) => {
    try {
        let leaderboard = await User.find().sort({ carbonFootprint: -1 }).limit(10).select('username carbonFootprint points');
        
        // Dummy Data Fallback for rich UI display if database is empty/small
        if (leaderboard.length < 5) {
            const dummyUsers = [
                { _id: 'd1', username: 'EcoWarrior', carbonFootprint: 1420.5, points: 5200 },
                { _id: 'd2', username: 'GreenBean', carbonFootprint: 980.2, points: 3100 },
                { _id: 'd3', username: 'PlanetSaver', carbonFootprint: 850.0, points: 2850 },
                { _id: 'd4', username: 'NatureLover', carbonFootprint: 640.8, points: 1900 },
                { _id: 'd5', username: 'TreeHugger', carbonFootprint: 410.3, points: 1200 }
            ];
            
            // Filter out dummy users whose names match existing DB users just in case
            const existingNames = leaderboard.map(u => u.username);
            const neededDummies = dummyUsers.filter(d => !existingNames.includes(d.username));
            
            leaderboard = [...leaderboard, ...neededDummies].sort((a,b) => b.carbonFootprint - a.carbonFootprint).slice(0, 10);
        }

        res.status(200).json({ success: true, data: leaderboard });
    } catch (err) {
        next(err);
    }
};


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};
