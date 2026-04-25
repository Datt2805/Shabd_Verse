require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const app = require('./src/app');
const connectDB = require('./src/db/db');
const chatSocket = require('./src/sockets/chatSocket');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Redis Adapter Configuration (Horizontal Scaling)
const setupRedisAdapter = async () => {
    if (process.env.REDIS_URL) {
        try {
            const pubClient = createClient({ url: process.env.REDIS_URL });
            const subClient = pubClient.duplicate();

            await Promise.all([pubClient.connect(), subClient.connect()]);

            io.adapter(createAdapter(pubClient, subClient));
            console.log('Redis Adapter initialized successfully');
        } catch (err) {
            console.error('Redis Adapter initialization failed, falling back to local adapter:', err.message);
        }
    } else {
        console.log('No REDIS_URL provided, using local adapter');
    }
};

setupRedisAdapter().then(() => {
    // Initialize Socket Handlers
    chatSocket(io);

    // Start Server
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
