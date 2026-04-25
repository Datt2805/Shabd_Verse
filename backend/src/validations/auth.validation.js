const { check } = require('express-validator');

const registerValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('role', 'Invalid role').optional().isIn(['reader', 'seller', 'admin'])
];

const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];

module.exports = {
    registerValidation,
    loginValidation
};
