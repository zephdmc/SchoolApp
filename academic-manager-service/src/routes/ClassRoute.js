const express = require('express');
const { createClass, getClasses, updateClass, deleteClass } = require('../controller/ClassController');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createClass);
router.get('/', getClasses);

// Update an existing class
router.put('/:id', updateClass);

// Delete a class
router.delete('/:id', deleteClass);

module.exports = router;
