const { check } = require('express-validator');

const createPostValidation = [
    check('communityId', 'Community ID is required').not().isEmpty(),
    // content is required only when no image is provided
    check('content').if((value, { req }) => !req.body.image).not().isEmpty().withMessage('Content is required when no image is provided'),
    check('image').optional().isURL().withMessage('Invalid image URL')
];

const addCommentValidation = [
    check('text', 'Text is required').not().isEmpty()
];

module.exports = {
    createPostValidation,
    addCommentValidation
};
