const express = require('express');
const router = express.Router();
const {
    listBookForSale,
    getBooksForSale,
    createOrder,
    getUserOrders,
    updateOrderStatus
} = require('../controllers/marketplace.controller');
const { auth } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const {
    listBookForSaleValidation,
    createOrderValidation,
    updateOrderStatusValidation
} = require('../validations/marketplace.validation');
const { handleValidationErrors } = require('../middleware/validation.middleware');

router.put('/list/:bookId', auth, checkRole(['seller', 'admin']), listBookForSaleValidation, handleValidationErrors, listBookForSale);
router.get('/', getBooksForSale);
router.get('/orders', auth, getUserOrders);
router.post('/order/:bookId', auth, createOrderValidation, handleValidationErrors, createOrder);
router.put('/order/:orderId', auth, updateOrderStatusValidation, handleValidationErrors, updateOrderStatus);

module.exports = router;
