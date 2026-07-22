const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });

// @desc    Login
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account is deactivated' });

    user.lastLogin = new Date();
    const refreshToken = signRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);
    const userData = { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, designation: user.designation };

    res.status(200).json({ success: true, token, refreshToken, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
const refreshToken = async (req, res) => {
  try {
    const { refreshToken: rToken } = req.body;
    if (!rToken) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = jwt.verify(rToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== rToken)
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    const token = signToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// @desc    Seed superadmin
const seedAdmin = async () => {
  try {
    const count = await User.countDocuments({ role: 'superadmin' });
    if (count === 0) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Tarun',
        email: process.env.ADMIN_EMAIL || 'admin@tarunbuilders.in',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'superadmin',
        isActive: true,
        isEmailVerified: true,
        designation: 'Founder & Managing Director',
      });
      console.log('✅ SuperAdmin seeded');
    }
  } catch (err) {
    console.error('Seed admin error:', err.message);
  }
};

module.exports = { login, getMe, refreshToken, seedAdmin };
