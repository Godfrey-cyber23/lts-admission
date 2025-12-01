// src/routes/authRoutes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { supabase } from '../config/db.js';
import sendEmail from '../utils/email.js';

const router = express.Router();

// Generate JWT token - using integer ID from your database
const generateToken = (id, role) => {
  return jwt.sign(
    { 
      id, // This is now an integer, not UUID
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '09432ec4a0b4dd3ffa1737e0b806d783b068f9b3a0af2f18316705b7f1888e25230751ebc73cc51d153e7ba150998d36cfdf28efcf5a31ab6030ecd3fcddaa25be6829eb8ae6d2500d4951f52d0a30167f17ec938ab3b364b616dc2c1b9c4f07d25bf88265b1430095a2292d1c45a0e0b88792f6f536e89ad6aab82cd0862e5f1e6306e6b2973090d1059a4975d36912f5981ff80af457dc1edff5fe4ac580f6d802a9c4d19781a01b6a2f7ce0fd6d739dca10f10e4fe4eea6761662a238f39a4a65b432c75c84605ffa7a873807e39efa6362f55e835ccf30247a82fd9d0954f229bfb41bed7607660b09e20c64abc517c1da53edaf92bad0a8be9708a57b29');

    // 3) Check if user still exists - using integer ID
    const { data: currentUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id) // This expects an integer, which matches your database
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

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  body('staffId').notEmpty().withMessage('Staff ID is required')
], catchAsync(async (req, res) => {
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

  try {
    // Find user by email and staff ID using Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('staffId', staffId.trim())
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
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
}));

// Register staff route - FIXED FOR INTEGER ID
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
  
  // Trim and sanitize inputs
  const sanitizedData = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    password: password.trim(),
    phone: phone ? phone.trim() : null,
    staffId: staffId.trim()
  };

  console.log('Processing registration for:', sanitizedData);

  try {
    // Check if user already exists by email
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', sanitizedData.email)
      .single();

    // PGRST116 means "no rows returned" - which is OK
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
    const { data: existingStaff, error: staffError } = await supabase
      .from('users')
      .select('id')
      .eq('staffId', sanitizedData.staffId)
      .single();

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
    const hashedPassword = await hashPassword(sanitizedData.password);

    // Create new staff user - database will auto-generate the integer ID
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        email: sanitizedData.email,
        password: hashedPassword,
        phone: sanitizedData.phone,
        staffId: sanitizedData.staffId,
        role: 'staff',
        isActive: true,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resetPasswordToken: null,
        resetPasswordExpire: null,
        auth_id: null, // This can be null since we're not using Supabase Auth
        profileImage: null
      }])
      .select()
      .single();

    if (createError) {
      console.error('Registration error:', createError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user: ' + createError.message
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

  // Check if email is being updated and if it already exists
  if (updateData.email && updateData.email !== req.user.email) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', updateData.email)
      .neq('id', req.user.id)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
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
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user details'
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

  // Update password
  const { error } = await supabase
    .from('users')
    .update({
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    })
    .eq('id', req.user.id);

  if (error) {
    console.error('Password update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update password'
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
  body('email').isEmail().normalizeEmail(),
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

  const { email, staffId } = req.body;

  // Check if user exists using Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, firstName, lastName')
    .eq('email', email.toLowerCase().trim())
    .eq('staffId', staffId.trim())
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

  // Hash token and find user
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('resetPasswordToken', hashedToken)
    .eq('staffId', staffId.trim())
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
    .eq('staffId', staffId.trim())
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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      staffId: staffId.trim(),
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

// Logout route (client-side only, but included for completeness)
router.post('/logout', catchAsync(async (req, res) => {
  // Since we're using JWT, logout is client-side (just remove token)
  // This endpoint can be used to blacklist tokens if needed
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

export { protect };
export default router;