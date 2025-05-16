const express = require('express');
const { registerUser, loginUser } = require('../controller/authController');
const { registerValidation, validateRequest } = require('../utils/validate');
const apiLimiter = require('../middleware/rateLimiter');
const router = express.Router();
router.post('/register', apiLimiter, registerValidation, validateRequest, registerUser);
router.post('/login', apiLimiter, loginUser);

module.exports = router;
