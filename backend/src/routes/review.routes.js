const express = require('express');
const router = express.Router();
const { addReview, getReviewsByBook, deleteReview } = require('../controllers/review.controller');
const { auth } = require('../middleware/auth.middleware');
const { addReviewValidation } = require('../validations/review.validation');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.post('/', auth, addReviewValidation, handleValidationErrors, addReview);
router.get('/book/:bookId', getReviewsByBook);
router.delete('/:reviewId', auth, deleteReview);

module.exports = router;
