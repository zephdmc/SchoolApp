const mongoose = require ('mongoose');

const CourseMaterialSchema = new mongoose.Schema({
  subject: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  fileUrl: { 
    type: String, 
    required: true 
  },
  
  fileType: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
        required: true
  },
 
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  class: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Class',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual for formatted date
CourseMaterialSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model('CourseMaterial', CourseMaterialSchema);