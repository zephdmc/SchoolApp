const express = require('express');
const { createClass, getClasses,getClassById, updateClass, deleteClass } = require('../controller/ClassController');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createClass);
router.get('/', getClasses);
router.get('/:id', getClassById);
// Update an existing class
router.put('/:id', updateClass);

// Delete a class
router.delete('/:id', deleteClass);

module.exports = router;
