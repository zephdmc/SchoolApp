const express = require('express');
const router = express.Router();
const adminTimetableController = require('../controller/TimeTableController');

// Admin routes
router.post('/admin/timetable', adminTimetableController.createTimetable);
router.get('/admin/timetables', adminTimetableController.getAllTimetables);
router.get('/admin/timetable/:id', adminTimetableController.getTimetableById);
router.put('/admin/timetable/:id', adminTimetableController.updateTimetable);
router.delete('/admin/timetable/:id', adminTimetableController.deleteTimetable);

// Teacher routes
router.get('/teacher/timetables', adminTimetableController.getTimetablesByClassAndYear);
router.get('/teacher/timetables-class-term', adminTimetableController.getTimetablesByClassAndTerm);
// Student routes
router.get('/student/timetable/today', adminTimetableController.getStudentTimetable);
router.get('/student/timetable/weekly', adminTimetableController.getWeeklyTimetable);

module.exports = router;