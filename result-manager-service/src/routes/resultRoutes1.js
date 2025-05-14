const express = require('express');
const { uploadResult, getStudentResults } = require('../controller/resultController');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/upload', uploadResult);
router.get('/:studentId',  getStudentResults);

module.exports = router;
