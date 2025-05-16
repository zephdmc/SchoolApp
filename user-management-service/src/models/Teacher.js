const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherID: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  nationality: {
    type: String,
    default: 'Nigerian'
  },
  stateOfOrigin: {
    type: String,
    required: true
  },
  lgaOfOrigin: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  staffNumber: {
    type: String,
    required: true,
    unique: true
  },
  higherQualification: {
    type: String,
    required: true
  },
  employmentType: {
    type: String,
    required: true,
    enum: ['fullTime', 'partTime', 'Contract']
  },
  bankname: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  NIN: {
    type: String,
    required: true,
    unique: true
  },
  section: {
    type: String,
    required: true
    // enum: ['Science', 'Arts', 'Commercial']
  },
  guardian: {
    fullName: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  passportPhoto: {
    type: String // URL to the uploaded image
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
  },
  genotype: {
    type: String,
    enum: ['AA', 'AS', 'SS']
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  status: {
    type: String,
    enum: ['Active', 'Retired', 'Transferred', 'Resigned'],
    default: 'Active'
  },
  session: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;