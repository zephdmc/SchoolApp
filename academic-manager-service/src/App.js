const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const subjectRoutes = require('./routes/SubjectRoute');
const classRoutes = require('./routes/ClassRoute');
const sessionRoutes = require('./routes/SessionRoute');
const termRoutes = require("./routes/TermRoute")

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

module.exports = app;
