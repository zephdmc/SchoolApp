const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    Enroll: { type: String, unique: true, default: null }, // Default set to null
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

  
        // username: { type: String, required: true },
        // email: { type: String, required: true },
        // role: { type: String, required: true, index: true }, // Add index here
  
    role: { type: String, enum: ['user', 'admin', 'sadmin', 'student', 'teacher'], default: 'user' },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

