// src/routes/authRoutes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../config/db.js';
import catchAsync from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      id: userId, // Changed from userId to id for consistency
      role,
      type: 'access'
    }, 
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production', 
    {
      expiresIn: '7d',
    }
  );
};

// Hash password using bcrypt
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Verify password using bcrypt
const verifyPassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  body('staffId').notEmpty().withMessage('Staff ID is required')
], catchAsync(async (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { email, password, staffId } = req.body;

  // Find user by email and staff ID using Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('staffId', staffId)
    .single();

  if (error || !user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email, password, or staff ID'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact administrator.'
    });
  }

  // Verify password using bcrypt
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email, password, or staff ID'
    });
  }

  // Generate token
  const token = generateToken(user.id, user.role);

  // Update last login
  await supabase
    .from('users')
    .update({ 
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .eq('id', user.id);

  // Return user data (excluding password) and token
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: userWithoutPassword
  });
}));

// Register staff route
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('staffId').notEmpty().withMessage('Staff ID is required')
], catchAsync(async (req, res, next) => {
  console.log('Registration request received:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { firstName, lastName, email, password, phone, staffId } = req.body;
  console.log('Processing registration for:', { firstName, lastName, email, staffId });

  try {
    // Check if user already exists
    console.log('Checking if user exists...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    console.log('User check result:', { existingUser, checkError });

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database error checking existing user:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while checking user'
      });
    }

    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if staff ID already exists
    console.log('Checking if staff ID exists...');
    const { data: existingStaff, error: staffError } = await supabase
      .from('users')
      .select('id')
      .eq('staffId', staffId)
      .single();

    console.log('Staff ID check result:', { existingStaff, staffError });

    if (staffError && staffError.code !== 'PGRST116') {
      console.error('Database error checking existing staff ID:', staffError);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while checking staff ID'
      });
    }

    if (existingStaff) {
      console.log('Staff ID already exists');
      return res.status(400).json({
        success: false,
        message: 'Staff ID already exists'
      });
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await hashPassword(password);

    // Create new staff user
    console.log('Creating new user...');
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        staffId,
        role: 'staff',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    console.log('User creation result:', { newUser, error });

    if (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user: ' + error.message
      });
    }

    const { password: _, ...userWithoutPassword } = newUser;

    console.log('Registration successful');
    res.status(201).json({
      success: true,
      message: 'Staff registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Unexpected error during registration:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during registration'
    });
  }
}));

// Get current user route
router.get('/me', catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '09432ec4a0b4dd3ffa1737e0b806d783b068f9b3a0af2f18316705b7f1888e25230751ebc73cc51d153e7ba150998d36cfdf28efcf5a31ab6030ecd3fcddaa25be6829eb8ae6d2500d4951f52d0a30167f17ec938ab3b364b616dc2c1b9c4f07d25bf88265b1430095a2292d1c45a0e0b88792f6f536e89ad6aab82cd0862e5f1e6306e6b2973090d1059a4975d36912f5981ff80af457dc1edff5fe4ac580f6d802a9c4d19781a01b6a2f7ce0fd6d739dca10f10e4fe4eea6761662a238f39a4a65b432c75c84605ffa7a873807e39efa6362f55e835ccf30247a82fd9d0954f229bfb41bed7607660b09e20c64abc517c1da53edaf92bad0a8be9708a57b29');
    
    // Find user by ID using Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id) // Changed from decoded.userId to decoded.id
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}));

// Forgot password route
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
  body('staffId').notEmpty().withMessage('Staff ID is required')
], catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { email, staffId } = req.body;

  // Check if user exists using Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, firstName, lastName')
    .eq('email', email)
    .eq('staffId', staffId)
    .single();

  // For security, don't reveal if email exists or not
  if (error || !user) {
    return res.json({
      success: true,
      message: 'If an account with that email and staff ID exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Save hashed token and expiry to database
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const { error: updateError } = await supabase
    .from('users')
    .update({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: resetTokenExpiry.toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating reset token:', updateError);
    return res.status(500).json({
      success: false,
      message: 'Error generating reset token'
    });
  }

  // Send email with reset token
  const resetURL = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const message = `You requested a password reset. Please click the following link to reset your password: ${resetURL}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - Literacy Tree School',
      message
    });

    res.json({
      success: true,
      message: 'Password reset link sent to your email.'
    });
  } catch (err) {
    console.error('Error sending reset email:', err);
    // Reset token if email fails
    await supabase
      .from('users')
      .update({
        resetPasswordToken: null,
        resetPasswordExpire: null
      })
      .eq('id', user.id);

    return res.status(500).json({
      success: false,
      message: 'There was an error sending the email. Try again later.'
    });
  }
}));

// Reset password route
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('staffId').notEmpty().withMessage('Staff ID is required')
], catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { token, password, staffId } = req.body;

  // Hash token and find user
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('resetPasswordToken', hashedToken)
    .eq('staffId', staffId)
    .gt('resetPasswordExpire', new Date().toISOString())
    .single();

  if (userError || !user) {
    return res.status(400).json({
      success: false,
      message: 'Token is invalid or has expired, or staff ID is incorrect'
    });
  }

  // Hash new password
  const hashedPassword = await hashPassword(password);

  // Update password and clear reset token
  const { error: updateError } = await supabase
    .from('users')
    .update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
      updatedAt: new Date().toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('Error updating password:', updateError);
    return res.status(500).json({
      success: false,
      message: 'Error updating password'
    });
  }

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

// Register admin route (first-time setup)
router.post('/register-admin', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('staffId').notEmpty().withMessage('Staff ID is required')
], catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  // Check if any admin already exists
  const { data: existingAdmins, error: countError } = await supabase
    .from('users')
    .select('id')
    .in('role', ['admin', 'superadmin']);

  if (countError) {
    console.error('Error checking existing admins:', countError);
    return res.status(500).json({
      success: false,
      message: 'Database error'
    });
  }

  if (existingAdmins && existingAdmins.length > 0) {
    return res.status(403).json({
      success: false,
      message: 'Admin registration is closed'
    });
  }

  const { firstName, lastName, email, password, staffId } = req.body;

  // Check if staff ID already exists
  const { data: existingStaff, error: staffError } = await supabase
    .from('users')
    .select('id')
    .eq('staffId', staffId)
    .single();

  // Handle database error properly
  if (staffError && staffError.code !== 'PGRST116') {
    console.error('Database error checking existing staff ID:', staffError);
    return res.status(500).json({
      success: false,
      message: 'Database error occurred while checking staff ID'
    });
  }

  if (existingStaff) {
    return res.status(400).json({
      success: false,
      message: 'Staff ID already exists'
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create admin user in Supabase
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([{
      firstName,
      lastName,
      email,
      password: hashedPassword,
      staffId, // Using shorthand property name
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Admin registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create admin user: ' + error.message
    });
  }

  // Generate token for immediate login
  const token = generateToken(newUser.id, newUser.role);
  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: 'Admin user created successfully',
    token,
    user: userWithoutPassword
  });
}));

export default router;