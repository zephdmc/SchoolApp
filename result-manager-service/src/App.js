const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const resultRoutes = require('./routes/examRecordRoute');
const examComputation = require('./routes/examComputation');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/results', resultRoutes);
app.use('/api/examcomputation', examComputation);

module.exports = app;
