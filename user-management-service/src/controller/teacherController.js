const Teacher = require('../models/Teacher');
const User = require('../models/User')

// @desc Create a new teachers
// @route POST /api/teachers
const createTeacher = async (req, res) => {
  try {
    const teacher = new Teacher(req.body);
    await teacher.save();
    res.status(200).json({ message: 'Teacher registered successfully', teacher });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc Get all teacher
// @route GET /api/teacher
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get a single teacher by ID
// @route GET /api/teachers/:id
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const getTeacherByID = async (req, res) => {
//   try {
//     console.log(req.params.teacherId, 'getTeacher By ID for timetable')
//     const teacher = await Teacher.findOne(req.params.teacherId);
//     if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
//     res.status(200).json(teacher);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
const getTeacherByID = async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log(teacherId, 'getTeacher By ID for timetable');

    // Find by the custom teacherID field
    const teacher = await Teacher.findOne({ teacherID: teacherId });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update a Teaher's details
// @route PUT /api/teachers/:id
const updateTeacher = async (req, res) => {
  try {
    // const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body);

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.status(200).json({ message: 'Teacher updated successfully', teacher });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// // @desc Delete a teaher
// // @route DELETE /api/teachers/:id
// const deleteTeacher = async (req, res) => {
//   try {
//     const teacher = await Teacher.findByIdAndDelete(req.params.id);
//     if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
//     res.status(200).json({ message: 'Teacher deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    
    // First find the teacher to get their details
    const teacher = await Teacher.findById(teacherId);
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Delete the teacher - use the Teacher model, not the instance
    await Teacher.findByIdAndDelete(teacherId);
    
    // Find and update the corresponding user's Enroll field to null
    await User.findOneAndUpdate(
      { _id: teacher.teacherID }, // Assuming teacherID is the field that links to User
      { $set: { Enroll: null } },
      { new: true }
    );

    res.status(200).json({ 
      message: 'Teacher deleted and user Enroll field updated successfully' 
    });
    
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};


// In your user controller
const getTeachersBatch = async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Array of user IDs required' });
    }

    const users = await User.find({
      _id: { $in: ids }
    }).select('_id name'); // Only include necessary fields

    res.json(users);
  } catch (error) {
    console.error('Error fetching batch users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

module.exports = {
  getTeachersBatch,
  createTeacher,
  getAllTeachers,
  getTeacherById,
  getTeacherByID,
  updateTeacher,
  deleteTeacher
};