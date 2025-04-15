const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find user by id from decoded token
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token - User not found'
                });
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

module.exports = verifyToken;
