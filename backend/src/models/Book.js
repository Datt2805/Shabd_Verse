const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    coverImage: {
        type: String
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    averageRating: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: function() { return this.isForSale; }
    },
    isForSale: {
        type: Boolean,
        default: false
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    condition: {
        type: String,
        enum: ["new", "like new", "good", "fair"]
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

bookSchema.index({ title: "text", author: "text" });

module.exports = mongoose.model('Book', bookSchema);
