const express = require('express');
const http = require('http');  // To create a server
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const app = express();

// Initialize HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: "*",  // Adjust this for security
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);

// Middleware to pass Socket.IO instance to the routes
app.use('/api/events', (req, res, next) => {
    req.io = io;  // Attach socket.io instance to request object
    next();
}, eventRoutes);

// Example route to check API is working
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Listen on PORT
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});
