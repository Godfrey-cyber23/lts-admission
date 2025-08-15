// server.js - Complete consolidated version
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Environment setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'src', 'config', '.env') });

// Create Express app
const app = express();

// Basic middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Import and mount your routes - CRITICAL FIX HERE
try {
  const { default: router } = await import('./src/routes/index.js');
  
  // Debug route paths before mounting
  router.stack.forEach(layer => {
    if (layer.route) {
      console.log(`Mounting route: ${layer.route.path}`);
      if (layer.route.path.startsWith('?')) {
        throw new Error(`Invalid route path starts with modifier: ${layer.route.path}`);
      }
    }
  });
  
  app.use('/api', router);
} catch (err) {
  console.error('Route initialization failed:', err);
  process.exit(1);
}

// Create HTTP server
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('User connected');
  // Your socket logic here
});

// Start server
const start = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
};

start();