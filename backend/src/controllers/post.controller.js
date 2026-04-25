const Post = require('../models/Post');
const Community = require('../models/Community');

const createPost = async (req, res) => {
    const { communityId, content, image } = req.body;
    const userId = req.user.id;

    try {
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ success: false, message: 'Community not found' });
        }

        const post = await Post.create({
            community: communityId,
            user: userId,
            content,
            image
        });

        res.status(201).json({
            success: true,
            data: post
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getPostsByCommunity = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ community: req.params.communityId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'name')
            .populate('comments.user', 'name')
            .lean();

        const total = await Post.countDocuments({ community: req.params.communityId });

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            },
            data: posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const addComment = async (req, res) => {
    const { text } = req.body;
    const userId = req.user.id;

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const newComment = {
            user: userId,
            text
        };

        post.comments.unshift(newComment);
        await post.save();

        res.status(201).json({
            success: true,
            data: post.comments
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await Post.findByIdAndDelete(req.params.postId);

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


module.exports = {
    createPost,
    getPostsByCommunity,
    addComment,
    deletePost
};
