const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const payment = require ('./routes/paymentRoutes' )
const walletRoutes = require('./routes/walletRoutes')

require('../../user-management-service/src/models/Student');
require('../../academic-manager-service/src/models/Session');
require('../../academic-manager-service/src/models/Class');




require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/fee', payment);
app.use('/api/wallet', walletRoutes);

module.exports = app;
