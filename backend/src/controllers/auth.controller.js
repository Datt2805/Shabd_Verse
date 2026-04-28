const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'reader',
            // Sellers require admin approval; all other roles are auto-approved
            isApproved: (role && role.toLowerCase() === 'seller') ? false : true
        });

        await user.save();

        if (user.role === 'seller') {
            return res.status(201).json({
                success: true,
                message: 'Registration successful! Your account is pending admin approval. You will be able to log in once an admin approves your account.'
            });
        }

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Block unapproved sellers from logging in
        console.log(`Login attempt: ${user.email}, Role: ${user.role}, Approved: ${user.isApproved}`);
        if (user.role === 'seller' && user.isApproved !== true) {
            console.log(`Blocking unapproved seller: ${user.email}`);
            return res.status(403).json({
                message: 'Your account is pending admin approval. Please wait for an admin to review your account.'
            });
        }

        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ success: false, message: 'Login failed', error: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extra security: Block unapproved sellers even if they have a token
        if (user.role === 'seller' && user.isApproved !== true) {
            return res.status(403).json({ message: 'Your account is pending admin approval.' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
