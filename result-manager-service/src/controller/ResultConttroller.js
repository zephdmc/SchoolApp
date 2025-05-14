const Result = require('../models/Result');
const Student = require('../models/Student');

// Fetch students & check if results exist
const fetchStudentsOrResults = async (req, res) => {
    const { classId, subjectId, sessionId } = req.query;
    
    try {
        const existingResults = await Result.find({ classId, subjectId, sessionId }).populate('studentId');
        
        if (existingResults.length > 0) {
            return res.json({ type: 'update', results: existingResults });
        }
        
        const students = await Student.find({ classId }).select('name _id');
        return res.json({ type: 'fetch', students });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Submit new results
const submitResults = async (req, res) => {
    const { teacherId, classId, subjectId, sessionId, results } = req.body;

    try {
        const newResults = results.map(student => ({
            studentId: student.studentId,
            teacherId,
            classId,
            subjectId,
            sessionId,
            score: student.score,
        }));

        await Result.insertMany(newResults);
        res.json({ message: 'Results submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update existing results
const updateResults = async (req, res) => {
    const { results } = req.body;

    try {
        for (let result of results) {
            await Result.findByIdAndUpdate(result._id, { score: result.score });
        }
        
        res.json({ message: 'Results updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    fetchStudentsOrResults,
    submitResults,
    updateResults
};