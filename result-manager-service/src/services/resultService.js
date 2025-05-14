const Result = require('../models/Result.js');

exports.createResult = async (data) => {
    const newResult = new Result(data);
    return await newResult.save();
};

exports.getResultsByStudentId = async (studentId) => {
    return await Result.find({ studentId }).populate('teacherId', 'name');
};


