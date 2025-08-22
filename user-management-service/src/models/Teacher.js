const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherID: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  middleName: {
    type: String
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  dateOfBirth: {
    type: Date,
  },
  nationality: {
    type: String,
    default: 'Nigerian'
  },
  stateOfOrigin: {
    type: String,
  },
  lgaOfOrigin: {
    type: String,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  staffNumber: {
    type: String,
  },
  higherQualification: {
    type: String,
  },
  employmentType: {
    type: String,
    enum: ['fullTime', 'partTime', 'Contract']
  },
  bankname: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  NIN: {
    type: String,
    unique: true
  },
  section: {
    type: String,
    // enum: ['Science', 'Arts', 'Commercial']
  },
  guardian: {
    fullName: {
      type: String,
    },
    relationship: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
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
  }
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;