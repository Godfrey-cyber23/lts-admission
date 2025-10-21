import User from '../models/User.js';

const createFirstAdmin = async () => {
  try {
    console.log('Checking for existing admin users...');
    
    // Count admin users
    const adminCount = await User.countDocuments({
      role: 'admin'
    });
    
    if (adminCount === 0) {
      if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in config.env');
      }
      
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'superadmin',
        permissions: ['all'],
        isActive: true
      });
      
      console.log('✅ First admin user created successfully:', admin.id);
    } else {
      console.log('ℹ️ Admin user(s) already exist');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exitCode = 1;
  }
};

createFirstAdmin();