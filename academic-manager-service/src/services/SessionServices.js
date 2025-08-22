const Session = require('../models/Session');

// Create a new session
exports.createSession = async (data) => {
    const session = new Session(data);
    return await session.save();
};

// Get all sessions
exports.getSessions = async () => {
    return await Session.find().sort({ startDate: 1 }); // Sort by start date
};

// Get session by ID
exports.getSessionById = async (id) => {
    return await Session.findById(id);
};

// Update session
exports.updateSession = async (id, updateData) => {
    return await Session.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
};

// Delete session
exports.deleteSession = async (id) => {
    return await Session.findByIdAndDelete(id);
};

// Check if session name exists (for validation)
exports.sessionNameExists = async (name, excludeId = null) => {
    const query = { name };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    return await Session.exists(query);
};

// Get active sessions (optional)
exports.getActiveSessions = async () => {
    const today = new Date();
    return await Session.find({ 
        startDate: { $lte: today },
        endDate: { $gte: today }
    });
};