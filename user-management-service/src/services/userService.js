const User = require('../models/User');

const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const updateUser = async (userId, updateData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    user.username = updateData.username || user.username;
    user.email = updateData.email || user.email;
    if (updateData.password) {
        user.password = updateData.password;
    }

    await user.save();
    return user;
};

const deleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    await user.remove();
};

module.exports = { getUserById, updateUser, deleteUser };
