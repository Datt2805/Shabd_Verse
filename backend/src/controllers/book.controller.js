const Book = require('../models/Book');

const createBook = async (req, res) => {
    const { title, author, genre, description, coverImage, price, isForSale, condition, quantity } = req.body;
    
    try {
        const newBook = new Book({
            title,
            author,
            genre,
            description,
            coverImage,
            price,
            isForSale,
            condition,
            quantity,
            seller: req.user.id,
            addedBy: req.user.id
        });

        const book = await newBook.save();
        res.status(201).json(book);
    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).send('Server error');
    }
};

const getAllBooks = async (req, res) => {
    try {
        const { search, genre, minRating, isForSale, addedBy, seller, page = 1, limit = 10 } = req.query;
        
        const filters = {};
        const filtersApplied = {};

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            filters.$or = [{ title: searchRegex }, { author: searchRegex }];
            filtersApplied.search = search;
        }

        if (genre) {
            filters.genre = genre;
            filtersApplied.genre = genre;
        }

        if (minRating) {
            filters.averageRating = { $gte: parseFloat(minRating) };
            filtersApplied.minRating = minRating;
        }

        if (isForSale !== undefined) {
            filters.isForSale = isForSale === 'true';
            filtersApplied.isForSale = isForSale;
        }

        if (addedBy) {
            filters.addedBy = addedBy;
            filtersApplied.addedBy = addedBy;
        }

        if (seller) {
            filters.seller = seller;
            filtersApplied.seller = seller;
        }

        const skip = (page - 1) * limit;

        const books = await Book.find(filters)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('addedBy', 'name')
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
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('addedBy', 'name').lean();

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(500).send('Server error');
    }
};

const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, description, coverImage, price, isForSale, condition, quantity } = req.body;
    
    try {
        let book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        // Only owner or admin can update
        if (book.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to update this book' });
        }

        book = await Book.findByIdAndUpdate(id, {
            $set: { title, author, genre, description, coverImage, price, isForSale, condition, quantity }
        }, { new: true });

        res.status(200).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        // Only owner or admin can delete
        if (book.addedBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this book' });
        }

        await Book.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Book removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
};
