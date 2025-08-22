const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    description: { 
        type: String,
        trim: true
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Add pre-save hook to validate dates
SessionSchema.pre('save', function(next) {
    if (this.endDate <= this.startDate) {
        throw new Error('End date must be after start date');
    }
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Session', SessionSchema);