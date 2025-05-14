// const mongoose = require('mongoose');
// require('dotenv').config(); // Load environment variables

// const connectDB = async () => {
//     try {
//         await mongoose.connect("mongodb+srv://imoict93:2019Password1@imoitc.erkoc.mongodb.net/ictdatabase?retryWrites=true&w=majority&appName=imoitc", {
          
//         });
//         console.log('MongoDB Connected');
//     } catch (error) {
//         console.error('MongoDB connection failed:', error);
//         process.exit(1);
//     }
// };

// module.exports = connectDB;


// config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;


// const connectDB = async () => {
//     try {
//         const uri = "mongodb+srv://imoict93:2019Password1@imoitc.erkoc.mongodb.net/ictdatabase?retryWrites=true&w=majority&appName=imoitc";
//         console.log('Connecting to:', uri);  // Add this line to check the URI
//         await mongoose.connect(uri, {});
//         console.log('MongoDB Connected');
//     } catch (error) {
//         console.error('MongoDB connection failed:', error);
//         process.exit(1);
//     }
// };
