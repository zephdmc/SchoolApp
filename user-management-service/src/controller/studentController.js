const Student = require('../models/Student');

// @desc Create a new student
// @route POST /api/students
const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (error) {
    res.status(400).json({ error: error.message });
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
const getStudentById = async (req, res) => {
  try {
    console.log('drer',req.params.id)
    const {studentID} = req.params.id;
    const student = await Student.findOne(studentID);
    console.log('ftr',student)
    if (!student) return res.status(407).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Fetch student by studentID
exports.getStudentByID = async (req, res) => {
    try {
        const { studentID } = req.params;
        const student = await Student.findOne({ studentID }); // Find student by studentID
        
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
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch students by class
const getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    console.log(className);
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
  updateStudent,
  deleteStudent,
  getStudentsByIdsForExamRecord,
  getStudentsByClass,
  getStudentIdByAdmissionNumber,
  getStudentByAdmissionNumber
};