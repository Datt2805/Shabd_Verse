const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/upload.controller');
const { auth } = require('../middleware/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', auth, upload.single('image'), uploadImage);

module.exports = router;
