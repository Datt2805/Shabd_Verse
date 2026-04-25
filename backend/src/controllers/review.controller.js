const Review = require('../models/Review');
const Book = require('../models/Book');

// Function to update book's average rating
async function updateBookRating(bookId) {
    const reviews = await Review.find({ book: bookId });
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const averageRating = totalRating / reviews.length;
        await Book.findByIdAndUpdate(bookId, { averageRating: averageRating.toFixed(1) });
    } else {
        await Book.findByIdAndUpdate(bookId, { averageRating: 0 });
    }
}

const addReview = async (req, res) => {
    const { bookId, rating, reviewText } = req.body;
    const userId = req.user.id;

    try {
        // Check if the book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        
        const review = await Review.create({
            book: bookId,
            user: userId,
            rating,
            reviewText
        });

        await updateBookRating(bookId);

        res.status(201).json({
            success: true,
            data: review
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this book' });
        }
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getReviewsByBook = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ book: req.params.bookId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name')
            .lean();

        const total = await Review.countDocuments({ book: req.params.bookId });
        
        res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Check if user is review owner or admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this review' });
        }

        const bookId = review.book;
        await Review.findByIdAndDelete(req.params.reviewId);

        await updateBookRating(bookId);

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    addReview,
    getReviewsByBook,
    deleteReview
};
