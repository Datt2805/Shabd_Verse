const { check } = require('express-validator');

const createCommunityValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('genre', 'Genre is required').not().isEmpty()
];

module.exports = {
    createCommunityValidation
};
