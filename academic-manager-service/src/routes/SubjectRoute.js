const express = require('express');
const { createSubject, getSubjects, getSubjectsByTeacher, getSubjectByName, deleteSubject } = require('../controller/SubjectController');
// const authMiddleware = require('../middleware/');

const router = express.Router();

router.post('/', createSubject);
router.get('/',  getSubjects);
router.get('/by-teacher', getSubjectsByTeacher);
router.get("/:name", getSubjectByName);
router.delete('/:id', deleteSubject);
module.exports = router;





