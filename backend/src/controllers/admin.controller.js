const User = require('../models/User');
const Order = require('../models/Order');
const Book = require('../models/Book');

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            pagination: { total, page, pages: Math.ceil(total / limit) },
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find()
            .populate('book', 'title')
            .populate('buyer', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Order.countDocuments();

        res.status(200).json({
            success: true,
            pagination: { total, page, pages: Math.ceil(total / limit) },
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getPendingSellers = async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller', isApproved: false })
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ success: true, data: sellers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const approveSeller = async (req, res) => {
    try {
        const seller = await User.findById(req.params.id);

        if (!seller) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (seller.role !== 'seller') {
            return res.status(400).json({ success: false, message: 'User is not a seller' });
        }

        seller.isApproved = true;
        await seller.save();

        res.status(200).json({ success: true, message: 'Seller approved successfully', data: seller });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getAllOrders,
    deleteBook,
    getPendingSellers,
    approveSeller
};
