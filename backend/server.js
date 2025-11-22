import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB, { supabase } from './src/config/db.js';
import aiAssistantRoutes from './src/api/ai-assistant.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'src', '.env') });

// Create Express app
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.43.26:3000',
  'http://127.0.0.1:3000',
  'https://lts-admission.vercel.app',
  'https://lts-admission-git-main-godfrey-bwalyas-projects-33224b1d.vercel.app',
  'https://lts-admission-itxd5p2d0-godfrey-bwalyas-projects-33224b1d.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '10mb' }));

// Middleware to attach Supabase client
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    database: 'supabase',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/ai', aiAssistantRoutes);

// Import and use routes with error handling
const initializeRoutes = async () => {
  try {
    const { default: router } = await import('./src/routes/index.js');
    app.use('/api', router);
    console.log('✅ Routes mounted successfully');
  } catch (err) {
    console.error('❌ Route initialization failed:', err);
    
    // Provide basic routes if main routes fail
    app.use('/api', (req, res) => {
      res.status(500).json({ 
        error: 'Routes not available', 
        message: 'Check route configuration' 
      });
    });
  }
};

// Create HTTP server
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
});

// Start server
const start = async () => {
  try {
    console.log('🚀 Starting server...');
    
    // Initialize routes before starting server
    await initializeRoutes();
    
    // Connect to database
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
};

start();