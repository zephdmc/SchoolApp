
// Correct way to define routes:
const express = require('express');
const router = express.Router();
const calendarEventController = require('../controller/calendarEvent'); // Verify this path

// Make sure all routes have proper handlers
router.post('/', calendarEventController.createEvent); 
router.get('/admin', calendarEventController.getAllEvents); // This is likely line 7
router.put('/:id', calendarEventController.updateEvent);
router.delete('/:id', calendarEventController.deleteEvent);

// Student routes
router.get('/student', calendarEventController.getStudentEvents);
router.get('/month/:year/:month', calendarEventController.getEventsByMonth);

module.exports = router;