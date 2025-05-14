const Result = require('../models/Result.js');
const resultService = require('../services/resultService');

exports.uploadResult = async (req, res) => {
    try {
        const resultData = req.body;
        const result = await resultService.createResult(resultData);
        res.status(201).json({ message: 'Result uploaded successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudentResults = async (req, res) => {
    try {
        const { studentId } = req.params;
        const results = await resultService.getResultsByStudentId(studentId);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
