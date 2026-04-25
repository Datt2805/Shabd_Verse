const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('joinedCommunities', 'name');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    const { name, email, avatar } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar) user.avatar = avatar;

        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getProfile,
    updateProfile
};
