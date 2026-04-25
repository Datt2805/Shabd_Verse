const { check } = require('express-validator');

const createBookValidation = [
    check('title', 'Title is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
    check('genre', 'Genre is required').not().isEmpty()
];

module.exports = {
    createBookValidation
};
