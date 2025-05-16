const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

const registerUser = async (userData) => {
    const { username, email, password } = userData;
    const userExists = await User.findOne({ email }, "re");

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = new User({
        username,
        email,
        password,
        terminal,
        role
    });

    await user.save();

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    };
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
        throw new Error('Invalid email or password');
    }

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    };
};

module.exports = { generateToken, registerUser, loginUser };
