// src/routes/authRoutes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../config/db.js';
import sendEmail from '../utils/email.js';

const router = express.Router();

// Generate JWT token - using integer ID from PostgreSQL
const generateToken = (id, role) => {
  return jwt.sign(
    {
      id, // This is an integer from PostgreSQL sequence
      role,
      type: 'access'
    },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
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

// Error handling middleware
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Protect middleware for authentication
const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You are not logged in! Please log in to get access.'
    });
  }

  try {
    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production');

    // 3) Check if user still exists - using integer ID from PostgreSQL
    const { data: currentUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (error || !currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.'
      });
    }

    console.error('Protect middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
});

// DEBUG: Check existing users in PostgreSQL
router.get('/debug/users', catchAsync(async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, "staffId", role, "firstName", "lastName", "createdAt", "updatedAt"')
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: users ? users.length : 0,
      users: users || []
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Debug error: ' + error.message
    });
  }
}));

// DEBUG: Clear test users (for development only)
router.delete('/debug/clear-test-users', catchAsync(async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .or('email.ilike.%test%', 'staffId.eq.STAFF001', 'staffId.eq.STAFF002');

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Test users cleared successfully'
    });
  } catch (error) {
    console.error('Clear test users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing test users: ' + error.message
    });
  }
}));

// Login route
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('staffId')
    .notEmpty()
    .withMessage('Staff ID is required')
    .trim()
], catchAsync(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Login validation errors:', errors.array());

    // Format error messages for better readability
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }

  const { email, password, staffId } = req.body;

  console.log('Login attempt for:', {
    email: email,
    staffId: staffId,
    timestamp: new Date().toISOString()
  });

  try {
    // Find user by email and staff ID using PostgreSQL
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('staffId', staffId.trim().toUpperCase())
      .ilike('email', email.toLowerCase().trim())
      .single();

    console.log('Database query result:', { user, error });

    if (error || !user) {
      console.log('No user found or database error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid email, password, or staff ID'
      });
    }

    console.log('User found:', { id: user.id, email: user.email, role: user.role });

    // Check if user is active
    if (!user.isActive) {
      console.log('User account is inactive:', user.email);
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact administrator.'
      });
    }

    // Verify password using bcrypt
    console.log('Verifying password...');
    const isPasswordValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', user.email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email, password, or staff ID'
      });
    }

    // Generate token
    const token = generateToken(user.id, user.role);
    console.log('Token generated for user:', user.id);

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

    console.log('Login successful for:', user.email);
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login process error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login: ' + error.message
    });
  }
}));

router.post('/test-email', catchAsync(async (req, res) => {
  try {
    const { email, subject, message } = req.body || {};
    
    console.log('Test email request received:', { email, subject, message });
    
    const result = await sendEmail({
      email: email || 'test@example.com',
      subject: subject || 'Test Email from Literacy Tree School',
      message: message || 'This is a test email to verify the email service is working.',
      resetURL: 'https://example.com/reset-password?token=test-token-123'
    });
    
    res.json({
      success: true,
      message: 'Test email sent successfully',
      details: {
        previewUrl: result.previewUrl,
        messageId: result.messageId,
        note: result.previewUrl ? `Check email at: ${result.previewUrl}` : 'Email sent to real address'
      }
    });
    
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to send test email: ${error.message}`,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      suggestion: 'Check your email configuration in environment variables'
    });
  }
}));

// Debug email configuration
router.get('/email-config', catchAsync(async (req, res) => {
  // Don't expose passwords in response
  const config = {
    EMAIL_HOST: process.env.EMAIL_HOST ? 'SET' : 'NOT SET',
    EMAIL_PORT: process.env.EMAIL_PORT ? 'SET' : 'NOT SET',
    EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
    EMAIL_FROM: process.env.EMAIL_FROM ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'NOT SET'
  };
  
  res.json({
    success: true,
    config: config,
    timestamp: new Date().toISOString()
  });
}));

// Register staff route - PostgreSQL compatible
router.post('/register', [
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('staffId').notEmpty().trim().withMessage('Staff ID is required')
], catchAsync(async (req, res) => {
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

  // Trim and sanitize inputs for PostgreSQL
  const sanitizedData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    password: password.trim(),
    phone: phone ? phone.trim() : null,
    staffId: staffId.trim().toUpperCase() // Convert to uppercase for consistency
  };

  console.log('Processing registration for:', sanitizedData);

  try {
    // Check if user already exists by email (case-insensitive for email)
    const { data: existingByEmail, error: emailCheckError } = await supabase
      .from('users')
      .select('id, email, "staffId"')
      .ilike('email', sanitizedData.email) // Use ilike for case-insensitive comparison in PostgreSQL
      .single();

    console.log('Email check result - Existing user by email:', existingByEmail);

    // PostgreSQL error PGRST116 means "no rows returned"
    if (emailCheckError && emailCheckError.code !== 'PGRST116') {
      console.error('PostgreSQL error checking existing user:', emailCheckError);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while checking user'
      });
    }

    if (existingByEmail) {
      console.log('User with this email already exists:', existingByEmail.email);
      return res.status(400).json({
        success: false,
        message: `User with email ${sanitizedData.email} already exists. Please use a different email.`
      });
    }

    // Check if staff ID already exists (case-sensitive as per your UNIQUE constraint)
    const { data: existingByStaffId, error: staffCheckError } = await supabase
      .from('users')
      .select('id, email, "staffId"')
      .eq('staffId', sanitizedData.staffId) // Use eq for case-sensitive comparison
      .single();

    console.log('Staff ID check result - Existing user by staffId:', existingByStaffId);

    if (staffCheckError && staffCheckError.code !== 'PGRST116') {
      console.error('PostgreSQL error checking existing staff ID:', staffCheckError);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred while checking staff ID'
      });
    }

    if (existingByStaffId) {
      console.log('Staff ID already exists:', existingByStaffId.staffId);
      return res.status(400).json({
        success: false,
        message: `Staff ID ${sanitizedData.staffId} already exists. Please use a different staff ID.`
      });
    }

    // Hash password for PostgreSQL storage
    const hashedPassword = await hashPassword(sanitizedData.password);

    // Create new staff user - PostgreSQL will auto-generate the integer ID via sequence
    // Note: Column names must match exactly with your PostgreSQL table definition
    const userData = {
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      email: sanitizedData.email,
      password: hashedPassword,
      phone: sanitizedData.phone,
      staffId: sanitizedData.staffId, // This matches column name "staffId" (case-sensitive with quotes)
      role: 'staff', // Must be one of: 'admin', 'staff', 'parent' (per your check constraint)
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resetPasswordToken: null,
      resetPasswordExpire: null,
      auth_id: null, // Can be null since we're not using Supabase Auth
      profileImage: null
    };

    console.log('Attempting to insert user into PostgreSQL:', userData);

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (createError) {
      console.error('PostgreSQL registration error:', {
        message: createError.message,
        code: createError.code,
        details: createError.details,
        hint: createError.hint
      });

      // Handle PostgreSQL specific errors
      let errorMessage = 'Failed to create user in database';

      // PostgreSQL error codes:
      // 23505 = unique_violation
      // 23503 = foreign_key_violation
      // 23502 = not_null_violation
      // 23514 = check_violation

      if (createError.code === '23505') { // Unique violation
        if (createError.details && createError.details.includes('email')) {
          errorMessage = 'User with this email already exists';
        } else if (createError.details && createError.details.includes('staffId')) {
          errorMessage = 'Staff ID already exists';
        } else if (createError.details && createError.details.includes('users_email_key')) {
          errorMessage = 'Email address already registered';
        } else if (createError.details && createError.details.includes('users_staff_id_key')) {
          errorMessage = 'Staff ID already registered';
        }
      } else if (createError.code === '23514') { // Check violation
        if (createError.details && createError.details.includes('role')) {
          errorMessage = 'Invalid role specified. Must be admin, staff, or parent';
        }
      }

      return res.status(500).json({
        success: false,
        message: `${errorMessage}: ${createError.message}`
      });
    }

    const { password: _, ...userWithoutPassword } = newUser;

    console.log('PostgreSQL registration successful:', userWithoutPassword);
    res.status(201).json({
      success: true,
      message: 'Staff registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Unexpected error during PostgreSQL registration:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during registration: ' + error.message
    });
  }
}));

// Get current user route
router.get('/me', protect, catchAsync(async (req, res) => {
  const { password, ...userWithoutPassword } = req.user;

  res.json({
    success: true,
    user: userWithoutPassword
  });
}));

// Update user details
router.put('/update-details', protect, [
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().trim(),
  body('profileImage').optional().trim()
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { firstName, lastName, email, phone, profileImage } = req.body;

  const updateData = {
    ...(firstName && { firstName: firstName.trim() }),
    ...(lastName && { lastName: lastName.trim() }),
    ...(email && { email: email.toLowerCase().trim() }),
    ...(phone && { phone: phone.trim() }),
    ...(profileImage && { profileImage: profileImage.trim() }),
    updatedAt: new Date().toISOString()
  };

  // Check if email is being updated and if it already exists in PostgreSQL
  if (updateData.email && updateData.email !== req.user.email) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .ilike('email', updateData.email)
      .neq('id', req.user.id)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use by another user'
      });
    }
  }

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    console.error('PostgreSQL update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user details in database'
    });
  }

  const { password: _, ...userWithoutPassword } = updatedUser;

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: userWithoutPassword
  });
}));

// Update password
router.put('/update-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { currentPassword, newPassword } = req.body;

  // Verify current password
  const isPasswordCorrect = await verifyPassword(currentPassword, req.user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password in PostgreSQL
  const { error } = await supabase
    .from('users')
    .update({
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    })
    .eq('id', req.user.id);

  if (error) {
    console.error('PostgreSQL password update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password in database'
    });
  }

  // Generate new token
  const token = generateToken(req.user.id, req.user.role);

  res.json({
    success: true,
    message: 'Password updated successfully',
    token
  });
}));

// Forgot password route
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .customSanitizer(value => {
      if (!value) return value;
      return value.toLowerCase().trim();
    }),
  body('staffId')
    .notEmpty()
    .withMessage('Staff ID is required')
    .trim()
    .customSanitizer(value => value.toUpperCase())
], catchAsync(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Forgot password validation errors:', errors.array());
    
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
    });
  }

  const { email, staffId } = req.body;
  
  // Sanitize inputs
  const sanitizedEmail = email.toLowerCase().trim();
  const sanitizedStaffId = staffId.trim().toUpperCase();
  
  console.log('Forgot password request:', { 
    email: sanitizedEmail,
    staffId: sanitizedStaffId
  });

  // CRITICAL FIX: Handle dots in email for comparison
  // Some email providers treat dots differently (Gmail ignores dots in local part)
  const emailVariations = [sanitizedEmail];
  
  // If email has dots in local part, create variations
  const [localPart, domain] = sanitizedEmail.split('@');
  if (localPart && domain) {
    // Remove dots from local part for comparison
    const dotlessLocal = localPart.replace(/\./g, '');
    if (dotlessLocal !== localPart) {
      emailVariations.push(`${dotlessLocal}@${domain}`);
    }
    
    // Also try with different dot combinations
    const withDots = localPart.split('').join('.');
    if (withDots !== localPart) {
      emailVariations.push(`${withDots}@${domain}`);
    }
  }

  console.log('Checking email variations:', emailVariations);

  // Check if user exists using PostgreSQL
  // Try exact match first, then try variations
  let user = null;
  let dbError = null;
  
  for (const emailVar of emailVariations) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, firstName, lastName, staffId')
      .eq('staffId', sanitizedStaffId)
      .ilike('email', emailVar)
      .single();
    
    if (data && !error) {
      user = data;
      console.log(`Found user with email variation: ${emailVar} (stored as: ${user.email})`);
      break;
    }
    
    if (error && error.code !== 'PGRST116') {
      dbError = error;
      break;
    }
  }

  // For security, don't reveal if email exists or not
  if (!user) {
    console.log('User not found after checking all variations:', {
      requestedEmail: sanitizedEmail,
      staffId: sanitizedStaffId,
      error: dbError?.message
    });
    return res.json({
      success: true,
      message: 'If an account with that email and staff ID exists, a password reset link has been sent.'
    });
  }

  console.log('User found for password reset:', {
    id: user.id,
    email: user.email, // Actual stored email
    staffId: user.staffId,
    firstName: user.firstName
  });

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
  
  console.log('Attempting to send password reset email:', {
    to: user.email, // Use the ACTUAL stored email
    resetURL: resetURL,
    timestamp: new Date().toISOString()
  });
  
  try {
    const emailResult = await sendEmail({
      email: user.email, // Use the ACTUAL stored email
      subject: 'Password Reset Request - Literacy Tree School',
      message: `You requested a password reset. Please click the following link to reset your password: ${resetURL}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
      resetURL: resetURL
    });
    
    console.log('Password reset email sent successfully:', {
      messageId: emailResult.messageId,
      previewUrl: emailResult.previewUrl,
      to: user.email
    });
    
    const response = {
      success: true,
      message: 'Password reset link sent to your email.'
    };
    
    // Include preview URL for Ethereal emails
    if (emailResult.previewUrl) {
      response.previewUrl = emailResult.previewUrl;
      response.note = 'Check your email or view at the link above.';
    }
    
    res.json(response);
    
  } catch (emailError) {
    console.error('Error sending reset email:', {
      error: emailError.message,
      stack: emailError.stack,
      to: user.email
    });
    
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
      message: 'There was an error sending the email. Try again later.',
      debug: process.env.NODE_ENV === 'development' ? emailError.message : undefined
    });
  }
}));

// Reset password route
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('staffId').notEmpty().withMessage('Staff ID is required')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { token, password, staffId } = req.body;

  // Hash token and find user in PostgreSQL
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('resetPasswordToken', hashedToken)
    .eq('staffId', staffId.trim().toUpperCase())
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

  // Update password and clear reset token in PostgreSQL
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
    console.error('PostgreSQL error updating password:', updateError);
    return res.status(500).json({
      success: false,
      message: 'Error updating password in database'
    });
  }

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}));

// Register admin route (first-time setup)
router.post('/register-admin', [
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('staffId').notEmpty().trim().withMessage('Staff ID is required')
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Check if any admin already exists in PostgreSQL
  const { data: existingAdmins, error: countError } = await supabase
    .from('users')
    .select('id')
    .in('role', ['admin', 'superadmin']);

  if (countError) {
    console.error('PostgreSQL error checking existing admins:', countError);
    return res.status(500).json({
      success: false,
      message: 'Database error checking for existing admins'
    });
  }

  if (existingAdmins && existingAdmins.length > 0) {
    return res.status(403).json({
      success: false,
      message: 'Admin registration is closed. An admin already exists.'
    });
  }

  const { firstName, lastName, email, password, staffId } = req.body;

  // Check if staff ID already exists in PostgreSQL
  const { data: existingStaff, error: staffError } = await supabase
    .from('users')
    .select('id')
    .eq('staffId', staffId.trim().toUpperCase())
    .single();

  // Handle PostgreSQL error properly
  if (staffError && staffError.code !== 'PGRST116') {
    console.error('PostgreSQL error checking existing staff ID:', staffError);
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

  // Create admin user in PostgreSQL
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([{
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      staffId: staffId.trim().toUpperCase(),
      role: 'admin',
      isActive: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resetPasswordToken: null,
      resetPasswordExpire: null,
      auth_id: null,
      phone: null,
      profileImage: null
    }])
    .select()
    .single();

  if (error) {
    console.error('PostgreSQL admin registration error:', error);
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

// Logout route
router.post('/logout', catchAsync(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

export { protect };
export default router;