const Student = require('../models/Student');
const User = require('../models/User')
// @desc Create a new student
// @route POST /api/students
// const createStudent = async (req, res) => {
//   try {
//     const student = new Student(req.body);
//     await student.save();
//     res.status(201).json({ message: 'Student registered successfully', student });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const createStudent = async (req, res) => {
  try {
    // Validate required fields first
    // const requiredFields = [
    //   'studentID', 'firstName', 'lastName', 'gender', 
    //    'admissionNumber',
    //   'class', 
    // ];
    
    // for (const field of requiredFields) {
    //   if (!req.body[field]) {
    //     return res.status(400).json({ 
    //       error: `Missing required field: ${field}` 
    //     });
    //   }
    // }

  

  
    // Check for duplicate studentID or admissionNumber
    const existingStudent = await Student.findOne({
      $or: [
        { studentID: req.body.studentID },
        { admissionNumber: req.body.admissionNumber }
      ]
    });

    if (existingStudent) {
      return res.status(400).json({
        error: existingStudent.studentID === req.body.studentID 
          ? 'Student ID already exists' 
          : 'Admission number already exists'
      });
    }

    const student = new Student(req.body);
    await student.save();
    
    res.status(201).json({ 
      message: 'Student registered successfully', 
      student 
    });

  } catch (error) {
    console.error('Student creation error:', error);
    
    // More specific error messages
    let errorMessage = error.message;
    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors)
        .map(err => err.message)
        .join(', ');
    }
    
    res.status(400).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
// @desc Get all students
// @route GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get a single student by ID
// @route GET /api/students/:id
// const getStudentById = async (req, res) => {
//   try {
   
//     const { studentID } = req.params.id;
//     console.log(studentID,"wewewsdsds")
//     const student = await Student.findOne(studentID);
//     console.log('ftr',student)
//     if (!student) return res.status(407).json({ message: 'Student not found' });
//     res.status(200).json(student);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from URL params
    
    
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: 'Student ID is required'
      });
    }

    // First try to find by MongoDB _id
    let student = await Student.findById(id);
    
    if (!student) {
      // If not found by _id, try by studentID field
      student = await Student.findOne({ studentID: id });
    }
    
    if (!student) {
      return res.status(404).json({ 
        success: false,
        message: 'Student not found',
        attemptedId: id
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });

  } catch (error) {
    console.error('Error finding student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Fetch student by studentID
const getStudentByID = async (req, res) => {
    try {
        const { studentID } = req.params;
        const student = await Student.find({ studentID: { $in: studentID } }) // Find student by studentID
        
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const getStudentsByIdsForExamRecord = async (req, res) => {
  try {
    // console.log(req.body, "Received student IDs"); // Debugging line
    const { studentIds } = req.body;
    if (!studentIds || !studentIds.length) {
      return res.status(400).json({ message: "Student IDs are required" });
    }
    const students = await Student.find({ studentID: { $in: studentIds } }).select("studentID admissionNumber firstName lastName");

    // console.log(students, "Fetched students from DB"); // Debugging line
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Error fetching students" });
  }
};


// @desc Update a student's details
// @route PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Delete a student
// @route DELETE /api/students/:id
// const deleteStudent = async (req, res) => {
//   try {
//     const student = await Student.findByIdAndDelete(req.params.id);
//     if (!student) return res.status(404).json({ message: 'Student not found' });
//     res.status(200).json({ message: 'Student deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const deleteStudent = async (req, res) => {
  try {
    // First find the student to get their details
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete the student
    await Student.findByIdAndDelete(req.params.id);
    // Find and update the corresponding user's Enroll field to null
    await User.findOneAndUpdate(
      { _id: student.studentID }, // Assuming email is the common field
      { $set: { Enroll: null } },
      { new: true }
    );


    res.status(200).json({ 
      message: 'Student deleted and user Enroll field updated successfully' 
    });
    
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};



// Fetch students by class
const getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const students = await Student.find({ class: className });

    if (!students.length) {
      return res.status(404).json({ message: "No students found in this class" });
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


 const getStudentIdByAdmissionNumber = async (req, res) => {
  try {
    const { admissionNumber } = req.params;
    
    const student = await Student.findOne({ admissionNumber })
      .select('studentID -_id')
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with the provided admission number'
      });
    }

    res.status(200).json({
      success: true,
      studentID: student.studentID
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving student ID',
      error: error.message
    });
  }
};




const getStudentByAdmissionNumber = async (req, res) => {
  try {
    const { admissionNumber } = req.params;
    
    const student = await Student.findOne({ admissionNumber })
      .select('studentID -_id')
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with the provided admission number'
      });
    }

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving student ID',
      error: error.message
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByID,
  updateStudent,
  deleteStudent,
  getStudentsByIdsForExamRecord,
  getStudentsByClass,
  getStudentIdByAdmissionNumber,
  getStudentByAdmissionNumber
};