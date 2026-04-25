const Book = require('../models/Book');
const Order = require('../models/Order');

const listBookForSale = async (req, res) => {
    const { price, condition, quantity = 1 } = req.body;
    const { bookId } = req.params;
    const sellerId = req.user.id;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        
        // Only allow seller or admin to list book for sale
        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Only sellers or admins can list books for sale' });
        }

        book.isForSale = true;
        book.price = price;
        book.seller = sellerId;
        book.condition = condition;
        book.quantity = quantity;

        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getBooksForSale = async (req, res) => {
    try {
        const { minPrice, maxPrice, condition, genre, page = 1, limit = 10 } = req.query;

        const filters = { isForSale: true, quantity: { $gt: 0 } };
        const filtersApplied = { isForSale: true };

        if (minPrice) {
            filters.price = { ...filters.price, $gte: parseFloat(minPrice) };
            filtersApplied.minPrice = minPrice;
        }

        if (maxPrice) {
            filters.price = { ...filters.price, $lte: parseFloat(maxPrice) };
            filtersApplied.maxPrice = maxPrice;
        }

        if (condition) {
            filters.condition = condition;
            filtersApplied.condition = condition;
        }

        if (genre) {
            filters.genre = genre;
            filtersApplied.genre = genre;
        }

        const skip = (page - 1) * limit;

        const books = await Book.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('seller', 'name')
            .lean();

        const total = await Book.countDocuments(filters);

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            },
            filtersApplied,
            data: books
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const createOrder = async (req, res) => {
    const { bookId } = req.params;
    const { quantity = 1, buyerName, deliveryAddress } = req.body;
    const buyerId = req.user.id;

    try {
        const book = await Book.findById(bookId);

        if (!book || !book.isForSale || book.quantity < quantity) {
            return res.status(404).json({ success: false, message: 'Book not available or insufficient quantity' });
        }

        if (book.seller.toString() === buyerId) {
            return res.status(400).json({ success: false, message: 'You cannot buy your own book' });
        }

        const order = await Order.create({
            book: bookId,
            buyer: buyerId,
            seller: book.seller,
            price: book.price * quantity,
            quantity,
            buyerName,
            deliveryAddress
        });

        // Update book quantity
        book.quantity -= quantity;
        if (book.quantity <= 0) {
            book.isForSale = false;
        }
        await book.save();

        res.status(201).json({
            success: true,
            data: order
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch orders where user is either buyer or seller
        const orders = await Order.find({
            $or: [{ buyer: userId }, { seller: userId }]
        })
        .populate('book', 'title')
        .populate('buyer', 'name')
        .populate('seller', 'name')
        .sort({ createdAt: -1 })
        .lean();

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.seller.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
        }
        
        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    listBookForSale,
    getBooksForSale,
    createOrder,
    getUserOrders,
    updateOrderStatus
};
