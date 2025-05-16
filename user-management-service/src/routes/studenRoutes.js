const express = require('express');
const { 
  createStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent,
  getStudentsByIdsForExamRecord,
  getStudentsByClass,
  // getStudentByID,
  getStudentIdByAdmissionNumber,
  getStudentByAdmissionNumber
} = require('../controller/studentController');

const router = express.Router();

router.post('/', createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.get('/class/:className', getStudentsByClass);
router.post('/student-by-ids', getStudentsByIdsForExamRecord);
router.get('/students/:studentID', getStudentById);
router.get('/admission/:admissionNumber', getStudentIdByAdmissionNumber);
router.get('/admissionNumber/:admissionNumber', getStudentByAdmissionNumber);

module.exports = router;




