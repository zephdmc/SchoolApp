const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const subjectRoutes = require('./routes/SubjectRoute');
const classRoutes = require('./routes/ClassRoute');
const sessionRoutes = require('./routes/SessionRoute');
const termRoutes = require("./routes/TermRoute");
const timetable = require(`./routes/TimetableRoute`);
const Examtimetable = require(`./routes/examTimetable`);
const CalendarTime = require(`./routes/calendarEvent`);
const Librari = require(`./routes/Library`);


require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/subjects', subjectRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/terms', termRoutes);
app.use('/api/timetable', timetable )
app.use('/api/examtimetable', Examtimetable )
app.use('/api/calendar', CalendarTime )
app.use('/api/Library', Librari )

module.exports = app;
