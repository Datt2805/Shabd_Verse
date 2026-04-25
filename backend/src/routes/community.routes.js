const express = require('express');
const router = express.Router();
const { createCommunity, getAllCommunities, joinCommunity, getChatHistory, getCommunityById } = require('../controllers/community.controller');
const { auth, optionalAuth } = require('../middleware/auth.middleware');
const { createCommunityValidation } = require('../validations/community.validation');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.get('/', optionalAuth, getAllCommunities);
router.get('/:id', optionalAuth, getCommunityById);
router.post('/', auth, createCommunityValidation, handleValidationErrors, createCommunity);
router.post('/:id/join', auth, joinCommunity);
router.get('/:id/chat', optionalAuth, getChatHistory);

module.exports = router;
