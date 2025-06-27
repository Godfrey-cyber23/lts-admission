import app from './app.js';
import connectDB from './src/config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
// eslint-disable-next-line no-unused-vars
import colors from 'colors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST
dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

// Verify environment variables
console.log('Environment variables loaded:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- PORT: ${process.env.PORT}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? 'Exists' : 'MISSING'}`);

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,  
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected'.cyan);
  
  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`.cyan);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected'.cyan);
  });
});

// Attach Socket.IO to app for use in controllers
app.set('io', io);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;  // Changed from process.config.env
    const NODE_ENV = process.env.NODE_ENV || 'development';  // Changed from process.config.env
    
    server.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.yellow.bold);
      console.log(`MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Missing'}`.yellow);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`.red.bold);
    process.exit(1);
  }
};

startServer()

// Error handling
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`.red);
  process.exit(1);
});