const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const payment = require ('./routes/paymentRoutes' )

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/fee', payment);

module.exports = app;
