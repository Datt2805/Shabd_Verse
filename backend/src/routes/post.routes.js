const express = require('express');
const router = express.Router();
const { createPost, getPostsByCommunity, addComment, deletePost } = require('../controllers/post.controller');
const { auth } = require('../middleware/auth.middleware');
const { createPostValidation, addCommentValidation } = require('../validations/post.validation');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.post('/', auth, createPostValidation, handleValidationErrors, createPost);
router.get('/community/:communityId', getPostsByCommunity);
router.post('/:postId/comment', auth, addCommentValidation, handleValidationErrors, addComment);
router.delete('/:postId', auth, deletePost);

module.exports = router;
