const express = require('express');
const { 
    createSubject, 
    getSubjects,
    getSubjectsByTeacher,
    getSubjectByName,
    getSubjectById,
    deleteSubject,
    updateSubject,
        getSubjectsByClass // Add this
} = require('../controller/SubjectController');

const router = express.Router();

router.post('/', createSubject);
router.get('/', getSubjects);
router.get('/by-teacher', getSubjectsByTeacher);
router.get('/by-class/:classId', getSubjectsByClass); // Add this route
router.get('/:name', getSubjectByName);
router.get('/id/:id', getSubjectById);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

module.exports = router;
