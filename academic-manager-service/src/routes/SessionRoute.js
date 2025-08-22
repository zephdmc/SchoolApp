const express = require('express');
const { 
    createSession, 
    getSessions, 
    updateSession, 
    deleteSession,
    getSession 
} = require('../controller/SessionController');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', createSession);
router.get('/', getSessions);
router.get('/:id', getSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;