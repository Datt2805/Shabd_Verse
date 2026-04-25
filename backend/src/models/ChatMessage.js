
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

ChatMessageSchema.index({ community: 1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
