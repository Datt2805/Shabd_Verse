const Notification = require('../models/Notification');

const getUserNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('sender', 'name')
            .lean();

        const total = await Notification.countDocuments({ recipient: req.user.id });

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        // Ensure the user is the recipient of the notification
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this notification' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


module.exports = {
    getUserNotifications,
    markAsRead
};
