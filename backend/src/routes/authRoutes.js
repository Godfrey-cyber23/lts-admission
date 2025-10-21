// src/routes/authRoutes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      userId, 
      role,
      type: 'access'
    }, 
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production', 
    {
      expiresIn: '7d',
    }
  );
};

// Simple password verification (replace with bcrypt in production)
const verifyPassword = (inputPassword, storedPassword) => {
  // For now, using simple comparison since passwords are stored in plain text
  // In production, you should use bcrypt.compare()
  return inputPassword === storedPassword;
};

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }).withMessage('Password is required')
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

  const { email, password } = req.body;

  // Find user by email using Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Your account has been deactivated. Please contact administrator.'
    });
  }

  // Verify password
  const isPasswordValid = verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
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

router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['parent', 'staff']).withMessage('Invalid role')
], catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { firstName, lastName, email, password, phone, role } = req.body;

  // Check if user already exists
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([{
      firstName,
      lastName,
      email,
      password, // In production, hash this password
      phone,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Registration error:', error);
    return res.status(400).json({
      success: false,
      message: 'Failed to create user: ' + error.message
    });
  }

  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: userWithoutPassword
  });
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    // Find user by ID using Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
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

    const { password: _, ...userWithoutPassword } = user;

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
  body('email').isEmail().normalizeEmail()
], catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { email } = req.body;

  // Check if user exists using Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, firstName, lastName')
    .eq('email', email)
    .single();

  // For security, don't reveal if email exists or not
  if (error || !user) {
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { 
      userId: user.id, 
      action: 'password_reset',
      type: 'reset'
    },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    { expiresIn: '1h' }
  );

  // TODO: In production, implement email service
  // For now, we'll log the token (remove this in production)
  console.log('Password reset token for', user.email, ':', resetToken);

  // In a real application, you would:
  // 1. Save the reset token to the database with an expiry
  // 2. Send an email with a reset link containing the token

  res.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.'
  });
}));

// Reset password route
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }

  const { token, password } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');
    
    if (decoded.action !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Update user password in Supabase
    const { error } = await supabase
      .from('users')
      .update({ 
        password: password, // In production, hash this password
        updatedAt: new Date().toISOString()
      })
      .eq('id', decoded.userId);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Error updating password'
      });
    }

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}));

// Register admin route (first-time setup)
router.post('/register-admin', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
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

  const { firstName, lastName, email, password } = req.body;

  // Create admin user in Supabase
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([{
      firstName,
      lastName,
      email,
      password, // In production, hash this password
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Admin registration error:', error);
    return res.status(400).json({
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