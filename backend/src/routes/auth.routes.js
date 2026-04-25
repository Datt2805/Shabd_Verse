const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');
const { registerValidation, loginValidation } = require('../validations/auth.validation');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.post('/register', registerValidation, handleValidationErrors, registerUser);
router.post('/login', loginValidation, handleValidationErrors, loginUser);
router.get('/me', auth, getMe);

module.exports = router;
