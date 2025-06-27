import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js'; // Note the .js extension

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ 
  path: path.resolve(__dirname, '../config/config.env') 
});

const createFirstAdmin = async () => {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    
    // Add connection options for better stability
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    const adminCount = await User.countDocuments({ 
      role: { $in: ['superadmin', 'admin'] } 
    });
    
    if (adminCount === 0) {
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in config.env');
      }
      
      const admin = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'superadmin',
        permissions: ['all'],
        isActive: true
      });
      
      await admin.save();
      console.log('✅ First admin user created successfully');
    } else {
      console.log('ℹ️ Admin user(s) already exist');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exitCode = 1;
  } finally {
    // Ensure connection is closed even if error occurs
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Add error handling for uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exitCode = 1;
});

createFirstAdmin();