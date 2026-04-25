const express = require('express');
const router = express.Router();
const { createBook, getAllBooks, getBookById, updateBook, deleteBook } = require('../controllers/book.controller');
const { auth } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const { createBookValidation } = require('../validations/book.validation');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', auth, checkRole(['seller', 'admin']), createBookValidation, handleValidationErrors, createBook);
router.put('/:id', auth, checkRole(['seller', 'admin']), createBookValidation, handleValidationErrors, updateBook);
router.delete('/:id', auth, checkRole(['seller', 'admin']), deleteBook);

module.exports = router;
