const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, sendSignupConfirmation } = require('../utils/email');

const router = express.Router();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password hashing handled by pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Send signup confirmation email
    try {
      await sendSignupConfirmation(email, name);
    } catch (emailError) {
      console.error('Failed to send signup confirmation email:', emailError);
      // Don't fail the signup if email fails
    }

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Prevent login for deactivated users
      if (user.isActive === false) {
        return res.status(403).json({ message: 'Your account has been deactivated. Please contact support.' });
      }

      // Generate token
      const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    await user.storeOTP(otp);

    // Send OTP email
    await sendOTP(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    const storedOTP = user.getOTP();
    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update password (hashing handled by pre-save middleware)
    user.password = newPassword;
    await user.save();

    // Clear OTP
    await user.clearOTP();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
