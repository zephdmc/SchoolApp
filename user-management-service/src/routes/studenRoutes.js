const express = require('express');
const Student = require('../models/Student');

const { 
  createStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent,
  getStudentsByIdsForExamRecord,
  getStudentsByClass,
  getStudentByID,
  getStudentIdByAdmissionNumber,
  getStudentByAdmissionNumber
} = require('../controller/studentController');

const router = express.Router();

router.post('/', createStudent);
router.get('/', getAllStudents);

// Existing batch endpoint (query by studentID)
router.get('/batch', async (req, res) => {
    try {
        const studentIDs = req.query.ids?.split(',') || [];
        
        const students = await Student.find({ studentID: { $in: studentIDs } })
            .select('firstName lastName middleName admissionNumber studentID _id');
        
        res.json(students);
    } catch (error) {
        console.error('Batch student fetch error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch students',
            error: error.message 
        });
    }
});



// // New endpoint to map MongoDB _ids to studentIDs
// router.get('/mongo-id-to-student-id', async (req, res) => {
//     try {
//         const mongoIds = req.query.ids?.split(',') || [];
//         console.log(mongoIds,'man den hj')
        
//         // Convert to ObjectIds and filter invalid ones
//         const objectIds = mongoIds.map(id => {
//             try {
//                 return new mongoose.Types.ObjectId(id);
//             } catch (err) {
//                 console.error(`Invalid ObjectId: ${id}`);
//                 return null;
//             }
//         }).filter(id => id !== null);

//         // Find matching students and return minimal data
//         const students = await Student.find({ _id: { $in: objectIds } })
//             .select('_id studentID');
        
//         res.json(students);
//     } catch (error) {
//         console.error('Student ID mapping error:', error);
//         res.status(500).json({ 
//             success: false,
//             message: 'Failed to fetch student ID mappings',
//             error: error.message 
//         });
//     }
// });


// Student service route
router.get('/batch-by-studentid', async (req, res) => {
    try {
      const { studentIds } = req.query;
      if (!studentIds) {
        return res.status(400).json({ message: 'studentIds parameter required' });
      }
  
      const idsArray = studentIds.split(',');
      const students = await Student.find({ studentID: { $in: idsArray } });
      
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/mongo-id-to-student-id', async (req, res) => {
  try {
    const incomingIds = req.query.ids?.split(',') || [];


    // First, try to find students by _id
    const objectIds = incomingIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    const studentsByObjectId = await Student.find({
      _id: { $in: objectIds }
    }).select('_id studentID firstName lastName admissionNumber');

    // Extract matched _ids
    const matchedObjectIds = new Set(studentsByObjectId.map(s => s._id.toString()));

    // Now find the rest by studentID (exclude any already matched as _id)
    const remainingAsStudentIDs = incomingIds.filter(id => !matchedObjectIds.has(id));
    const studentsByStudentID = await Student.find({
      studentID: { $in: remainingAsStudentIDs }
    }).select('_id studentID firstName lastName admissionNumber');

    // Merge both results
    const allStudents = [...studentsByObjectId, ...studentsByStudentID];

    // Optionally create a map (optional)
    const studentMap = {};
    allStudents.forEach(student => {
      studentMap[student._id.toString()] = student;
      studentMap[student.studentID] = student;
    });


    res.json(allStudents);
  } catch (error) {
    console.error('Student ID mapping error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student ID mappings',
      error: error.message
    });
  }
});

router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.get('/class/:className', getStudentsByClass);
router.post('/student-by-ids', getStudentsByIdsForExamRecord);
router.get('/students/:studentID', getStudentByID);
router.get('/admission/:admissionNumber', getStudentIdByAdmissionNumber);
router.get('/admissionNumber/:admissionNumber', getStudentByAdmissionNumber);

const mongoose = require('mongoose');
// ... rest of your existing student routes

module.exports = router;
module.exports = router;




