const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.get('/', verifyToken, (req, res) => {
    res.json({
        success: true,
        message: `Welcome to your profile! Your user ID is: ${req.user._id}`,
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email
        }
    });
});

module.exports = router;
