const express = require('express');
const { createSession, getSessions } = require('../controller/SessionController');
// const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/',  createSession);
router.get('/', getSessions);

module.exports = router;
