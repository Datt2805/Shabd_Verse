const { check } = require('express-validator');

const listBookForSaleValidation = [
    check('price', 'Price is required').isNumeric(),
    check('condition', 'Condition is required').isIn(['new', 'like new', 'good', 'fair']),
    check('quantity', 'Quantity must be at least 1').optional().isInt({ min: 1 })
];

const createOrderValidation = [
    check('quantity', 'Quantity is required and must be at least 1').isInt({ min: 1 }),
    check('buyerName', 'Buyer name is required').notEmpty(),
    check('deliveryAddress', 'Delivery address is required').notEmpty()
];

const updateOrderStatusValidation = [
    check('status', 'Status is required').isIn(['pending', 'accepted', 'shipped', 'delivered', 'rejected', 'cancelled', 'completed'])
];


module.exports = {
    listBookForSaleValidation,
    createOrderValidation,
    updateOrderStatusValidation
};
