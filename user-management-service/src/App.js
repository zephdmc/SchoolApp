const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const Student = require('./routes/studenRoutes')
const Teacher = require('./routes/teacherRoutes')

const cors = require('cors');
require('dotenv').config();
const app = express();

// Use the CORS middleware
app.use(cors());

// // OR you can specify the allowed origin
// app.use(cors({
//   origin: 'http://localhost:3000'
// }));

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/student', Student);
app.use('/api/teacher', Teacher);


// Error handling
app.use(errorHandler);

module.exports = app;

