const Class = require('../models/Class');

// Create a new class
exports.createClass = async (data) => {
    const newClass = new Class(data);
    return await newClass.save();
};

// Get all classes
exports.getClasses = async () => {
    return await Class.find();
};

// Get a single class by ID
exports.getClassById = async (id) => {
    return await Class.findById(id);
};

// Update a class
exports.updateClass = async (id, updateData) => {
    return await Class.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
};

// Delete a class
exports.deleteClass = async (id) => {
    return await Class.findByIdAndDelete(id);
};

// Additional useful methods (optional)
// ---------------------------------
// Get classes by session
exports.getClassesBySession = async (sessionId) => {
    return await Class.find({ session: sessionId });
};

// Check if class name exists (for validation)
exports.classNameExists = async (name, excludeId = null) => {
    const query = { name };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    return await Class.exists(query);
};