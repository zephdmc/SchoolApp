const express = require('express');
const { 
  createComputation, 
  getComputations, 
//   getComputationById, 
//   updateStudent, 
//   deleteStudent,
//   getStudentsByIdsForExamRecord,
//   getStudentsByClass
} = require('../controller/examComputation');

const router = express.Router();

router.post('/', createComputation);
router.get('/', getComputations);
// router.get('/:id', getComputationById);
// router.put('/:id', updateStudent);
// router.delete('/:id', deleteStudent);
// router.get('/class/:className', getStudentsByClass);
// router.post('/student-by-ids', getStudentsByIdsForExamRecord);

module.exports = router;




