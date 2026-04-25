const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    buyerName: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "shipped", "delivered", "rejected", "cancelled", "completed"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
