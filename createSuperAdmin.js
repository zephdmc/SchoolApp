const mongoose = require('mongoose');
const User = require('./user-management-service/src/models/User'); // Adjust path based on your project structure

// MongoDB Connection String
const dbURI = "mongodb://127.0.0.1:27017/mghsodatabase";
const seedAdmin = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(dbURI);

        console.log('✅ MongoDB connected.');

        // Check if super admin already exists
        const superAdminExists = await User.findOne({ email: 'admin@example.com' });

        if (superAdminExists) {
            console.log('ℹ️ Super admin already exists.');
        } else {
            // Create super admin
            const superAdmin = new User({
                username: 'superadmin',
                email: 'admin@example.com',
                password: 'superadminpassword', // Store plain text or modify as needed
                role: 'sadmin',
                terminal: 'main',
            });

            await superAdmin.save();
            console.log('✅ Super admin created successfully.');
        }

        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed.');
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    }
};

// Run seeding function
seedAdmin();