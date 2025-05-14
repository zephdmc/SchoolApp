const Subject = require('../models/Subjects');

exports.createSubject = async (data) => {
    console.log(data)
    const subject = new Subject(data);
    return await subject.save();
};

exports.getSubjects = async () => {
    return await Subject.find();
};

exports.deleteSubject = async (id) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(id);
        return deletedSubject; // Returns null if subject not found
    } catch (error) {
        throw new Error("Error deleting subject: " + error.message);
    }
};