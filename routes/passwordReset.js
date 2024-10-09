// routes/passwordReset.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const OTP = require('../models/OTP');
const { User } = require('../models/User');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');

// Request OTP
router.post('/request-reset', asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: 'No user found with this email.' });
    }

    // Generate OTP
    const code = crypto.randomBytes(3).toString('hex'); // Generates a 6-digit hex code
    const expiresAt = Date.now() + 15 * 60 * 1000; // Expires in 15 minutes

    // Save OTP
    await OTP.create({ email, code, expiresAt });

    // Send email
    await sendEmail(email, 'Password Reset OTP', `Your OTP code is: ${code}`);

    res.status(200).json({ message: 'OTP sent to your email.' });
}));

// Verify OTP and reset password
router.post('/reset-password', asyncHandler(async (req, res) => {
    const { email, code, newPassword } = req.body;

    const otpEntry = await OTP.findOne({ email, code });
    if (!otpEntry || otpEntry.expiresAt < Date.now()) {
        return res.status(400).json({ error: 'Invalid or expired OTP.' });
    }

    // Update password
    const user = await User.findOne({ email });
    if (user) {
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
    }

    // Clean up OTP entry
    await OTP.deleteOne({ email, code });

    res.status(200).json({ message: 'Password has been reset successfully.' });
}));

module.exports = router;
