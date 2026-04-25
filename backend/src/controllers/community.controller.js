const Community = require('../models/Community');
const User = require('../models/User');

const createCommunity = async (req, res) => {
    const { name, genre, description } = req.body;

    try {
        // Enforce max 20 communities per user
        const existingCount = await Community.countDocuments({ createdBy: req.user.id });
        if (existingCount >= 20) {
            return res.status(400).json({ message: 'You have reached the maximum limit of 20 tribes. Please delete an existing one to create a new tribe.' });
        }

        const newCommunity = new Community({
            name,
            genre,
            description,
            createdBy: req.user.id, 
            members: [req.user.id] 
        });

        const community = await newCommunity.save();

        await User.findByIdAndUpdate(req.user.id, { $addToSet: { joinedCommunities: community._id } });

        res.status(201).json(community);
    } catch (error) {
        console.error(error.message);
        if (error.code === 11000) {
             return res.status(400).json({ message: 'A community with this name already exists.' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).send('Server error');
    }
};

const getAllCommunities = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 100;
        const skip = (page - 1) * limit;

        const communities = await Community.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Map through communities to add a flag if the current user is a member
        const userId = req.user?.id;
        const communitiesWithMemberFlag = communities.map(community => ({
            ...community,
            isMember: userId && community.members ? community.members.some(m => m.toString() === userId) : false
        }));

        const total = await Community.countDocuments();

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: communitiesWithMemberFlag
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

const joinCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id);

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        if (community.members.includes(req.user.id)) {
            return res.status(400).json({ message: 'User is already a member of this community' });
        }

        community.members.push(req.user.id);
        await community.save();

        await User.findByIdAndUpdate(req.user.id, { $addToSet: { joinedCommunities: community._id } });

        res.json({ message: 'Successfully joined community', success: true });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Community not found' });
        }
        res.status(500).send('Server error');
    }
};

const getChatHistory = async (req, res) => {
    try {
        const { id } = req.params;
        
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 50;
        const skip = (page - 1) * limit;

        const ChatMessage = require('../models/ChatMessage');
        
        const messages = await ChatMessage.find({ community: id })
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await ChatMessage.countDocuments({ community: id });

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: messages.reverse()
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getCommunityById = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id)
            .populate('createdBy', 'name')
            .lean();

        if (!community) {
            return res.status(404).json({ success: false, message: 'Community not found' });
        }

        res.status(200).json({ success: true, data: community });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Community not found' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createCommunity,
    getAllCommunities,
    joinCommunity,
    getChatHistory,
    getCommunityById
};
