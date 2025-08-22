const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');
// const { registerValidation, validateRequest } = require('../utils/validate');

const generateToken = (id) => {
    return jwt.sign({ id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        username,
        email,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Email not found',
                errorType: 'EMAIL_NOT_FOUND'
            });
        }

        // Verify password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Incorrect password',
                errorType: 'INCORRECT_PASSWORD'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error during login',
            errorType: 'SERVER_ERROR',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
module.exports = { registerUser, loginUser };
