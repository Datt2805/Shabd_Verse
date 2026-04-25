const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    getAllOrders,
    deleteBook,
    getPendingSellers,
    approveSeller
} = require('../controllers/admin.controller');
const { auth } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');

// All routes in this file require authentication and admin role
router.use(auth, checkRole(['admin']));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.delete('/books/:id', deleteBook);

// Seller approval routes
router.get('/pending-sellers', getPendingSellers);
router.patch('/sellers/:id/approve', approveSeller);

module.exports = router;
