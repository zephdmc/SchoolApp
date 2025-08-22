const express = require('express');
const router = express.Router();
const examTimetableController = require('../controller/examtimetableController');

// Admin routes
router.post('/', examTimetableController.createExamTimetable);
router.get('/admin', examTimetableController.getAllExamTimetables);
router.get('/admin/:id', examTimetableController.getExamTimetableById);
router.put('/:id', examTimetableController.updateExamTimetable);
router.delete('/:id', examTimetableController.deleteExamTimetable);
router.patch('/:id/publish', examTimetableController.publishExamTimetable);

// Student/Teacher routes
router.get('/class/:classId',examTimetableController.getExamTimetableByClass);
router.get('/student', examTimetableController.getStudentExamTimetable);
router.get('/teacher', examTimetableController.getExamTimetablesByTeacher);

module.exports = router;
