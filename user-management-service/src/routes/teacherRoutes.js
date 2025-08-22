const express = require('express');
const { 
  createTeacher, 
  getAllTeachers, 
  getTeacherById, 
  updateTeacher, 
  getTeacherByID,
  deleteTeacher,
  getTeachersBatch
} = require('../controller/teacherController');

const router = express.Router();

router.post('/', createTeacher);
router.get('/', getAllTeachers);
router.get('/:id', getTeacherById);
router.post('/users/batch', getTeachersBatch);
router.get('/teacher/:teacherId', getTeacherByID);
router.put('/:id', updateTeacher);
router.delete('/:id', deleteTeacher);

module.exports = router;