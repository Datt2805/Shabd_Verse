const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

module.exports = function(io) {
    io.on('connection', (socket) => {
        console.log('New connection:', socket.id);

        socket.on('registerUser', (userId) => {
            if (userId) {
                const room = `user_${userId}`;
                socket.join(room);
                console.log(`User ${userId} joined their private room: ${room}`);
            }
        });

        socket.on('joinCommunity', (communityId) => {
            socket.join(communityId);
            console.log(`Socket ${socket.id} joined community room: ${communityId}`);
        });

        socket.on('sendMessage', async ({ communityId, userId, message }) => {
            if (!userId) {
                return socket.emit('messageError', { message: 'You must be logged in to send messages.' });
            }
            try {
                const user = await User.findById(userId).select('name');
                if (!user) return;

                const chatMessage = new ChatMessage({
                    community: communityId,
                    user: userId,
                    message: message
                });

                await chatMessage.save();

                const messageToSend = {
                    _id: chatMessage._id,
                    community: chatMessage.community,
                    user: {
                        _id: user._id,
                        name: user.name
                    },
                    message: chatMessage.message,
                    createdAt: chatMessage.createdAt
                }

                io.to(communityId).emit('newMessage', messageToSend);

            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('messageError', { message: 'Failed to send message.' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};
