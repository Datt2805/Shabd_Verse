const express = require('express');
const router = express.Router();
const {
    getUserNotifications,
    markAsRead
} = require('../controllers/notification.controller');
const { auth } = require('../middleware/auth.middleware');

router.get('/', auth, getUserNotifications);
router.put('/:id/read', auth, markAsRead);

module.exports = router;
