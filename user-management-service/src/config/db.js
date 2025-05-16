const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = async () => {
    try {
        const ODAS = process.env.MONGO_URL;
        await mongoose.connect(ODAS, );
        console.log(ODAS, 'oda')
        console.log('User MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
