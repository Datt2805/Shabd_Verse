const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['reader', 'seller', 'admin'],
        default: 'reader'
    },
    joinedCommunities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    avatar: {
        type: String,
        default: null
    },
    // Sellers require admin approval before they can log in
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
