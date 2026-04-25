const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ["comment", "review", "order"],
        required: true
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

NotificationSchema.index({ recipient: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);
