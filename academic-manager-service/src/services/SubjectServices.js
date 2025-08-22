const Subject = require('../models/Subjects');

exports.createSubject = async (data) => {
    const subject = new Subject(data);
    return await subject.save();
};

exports.getSubjects = async () => {
    return await Subject.find().populate('teacher class session term');
};

exports.getSubjectById = async (id) => {
    return await Subject.findById(id).populate('teacher class session term');
};

// NEW: Add update functionality
exports.updateSubject = async (id, updateData) => {
    return await Subject.findByIdAndUpdate(
        id,
        updateData,
        { 
            new: true, 
            runValidators: true 
        }
    ).populate('teacher class session term');
};

exports.deleteSubject = async (id) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(id);
        return deletedSubject;
    } catch (error) {
        throw new Error("Error deleting subject: " + error.message);
    }
};

// Additional useful methods
exports.subjectCodeExists = async (code, excludeId = null) => {
    const query = { code };
    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    return await Subject.exists(query);
};

exports.getSubjectsByClass = async (classId) => {
    return await Subject.find({ class: classId }).populate('teacher session term');
};