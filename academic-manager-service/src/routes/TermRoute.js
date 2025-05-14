const express = require('express');
const { createTerm, getTerms, updateTerm, deleteTerm } = require('../controller/TermController');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createTerm);
router.get('/', getTerms);

// Update an existing term
router.put('/:id', updateTerm);

// Delete a term
router.delete('/:id', deleteTerm);

module.exports = router;
