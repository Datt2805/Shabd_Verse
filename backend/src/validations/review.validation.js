const { check } = require('express-validator');

const addReviewValidation = [
    check('bookId', 'Book ID is required').not().isEmpty(),
    check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
    check('reviewText', 'Review text is required').not().isEmpty()
];

module.exports = {
    addReviewValidation
};
