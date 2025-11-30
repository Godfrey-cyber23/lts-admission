import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs'; // Add bcrypt for password hashing
import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-fallback-secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  
  // Remove password from output
  const { password, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: userWithoutPassword
    }
  });
};

// Hash password middleware
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password middleware
const comparePassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const registerAdmin = catchAsync(async (req, res, next) => {
  // Check if any admin exists
  const { data: existingAdmins, error: countError } = await supabase
    .from('users')
    .select('id')
    .in('role', ['admin', 'superadmin']);

  if (countError) {
    return next(new AppError('Database error', 500));
  }

  if (existingAdmins && existingAdmins.length > 0) {
    return next(new AppError('Admin registration is closed', 403));
  }

  // Hash password
  const hashedPassword = await hashPassword(req.body.password);

  // Create user directly in your users table (no Supabase Auth)
  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert([{
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: 'admin',
      isActive: true
    }])
    .select()
    .single();

  if (userError) {
    return next(new AppError('Failed to create user: ' + userError.message, 400));
  }

  createSendToken(newUser, 201, res);
});

export const registerStaff = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phone, password, staffId } = req.body;

  // Check if staff ID already exists
  const { data: existingStaff, error: staffError } = await supabase
    .from('users')
    .select('id')
    .eq('staffId', staffId);

  if (staffError) {
    return next(new AppError('Database error', 500));
  }

  if (existingStaff && existingStaff.length > 0) {
    return next(new AppError('Staff ID already exists', 400));
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create staff user
  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert([{
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      staffId,
      role: 'staff',
      isActive: true
    }])
    .select()
    .single();

  if (userError) {
    return next(new AppError('Failed to create user: ' + userError.message, 400));
  }

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password, staffId } = req.body;
  
  // 1) Check if email, password and staffId exist
  if (!email || !password || !staffId) {
    return next(new AppError('Please provide email, password and staff ID', 400));
  }
  
  // 2) Check if user exists in your users table with matching email and staffId
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('staffId', staffId)
    .single();

  if (userError || !user) {
    return next(new AppError('Incorrect email, password or staff ID', 401));
  }

  // 3) Check if password is correct using bcrypt
  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect email, password or staff ID', 401));
  }

  // 4) Check if account is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated', 403));
  }

  // 5) Update last login
  await supabase
    .from('users')
    .update({ lastLogin: new Date().toISOString() })
    .eq('id', user.id);

  // 6) If everything ok, send token to client
  createSendToken(user, 200, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email, staffId } = req.body;

  if (!email || !staffId) {
    return next(new AppError('Please provide email address and staff ID', 400));
  }

  // 1) Get user based on email and staffId
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('staffId', staffId)
    .single();

  if (userError || !user) {
    // Don't reveal if email exists for security
    return res.status(200).json({
      status: 'success',
      message: 'If an account with that email and staff ID exists, a reset link has been sent.'
    });
  }

  // 2) Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3) Save hashed token and expiry to database
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const { error: updateError } = await supabase
    .from('users')
    .update({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: resetTokenExpiry.toISOString()
    })
    .eq('id', user.id);

  if (updateError) {
    return next(new AppError('Error generating reset token', 500));
  }

  // 4) Send email with reset token
  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const message = `You requested a password reset. Please click the following link to reset your password: ${resetURL}\n\nThis link will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - Literacy Tree School',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to your email.'
    });
  } catch (err) {
    // Reset token if email fails
    await supabase
      .from('users')
      .update({
        resetPasswordToken: null,
        resetPasswordExpire: null
      })
      .eq('id', user.id);

    return next(new AppError('There was an error sending the email. Try again later.', 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password, staffId } = req.body;

  if (!token || !password || !staffId) {
    return next(new AppError('Token, new password and staff ID are required', 400));
  }

  // 1) Hash token and find user
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
    return next(new AppError('Token is invalid or has expired, or staff ID is incorrect', 400));
  }

  // 2) Hash new password
  const hashedPassword = await hashPassword(password);

  // 3) Update password and clear reset token
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
    return next(new AppError('Error updating password', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully'
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (error || !user) {
    return next(new AppError('User not found', 404));
  }

  // Remove password from output
  const { password, ...userWithoutPassword } = user;

  res.status(200).json({
    status: 'success',
    data: {
      user: userWithoutPassword
    }
  });
});

export const updateDetails = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phone, profileImage } = req.body;

  const updateData = {
    firstName,
    lastName,
    email,
    phone,
    profileImage,
    updatedAt: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data: user, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', req.user.id)
    .select()
    .single();

  if (error) {
    return next(new AppError('Failed to update user details', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret');

  // 3) Check if user still exists
  const { data: currentUser, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', decoded.id)
    .single();

  if (error || !currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // 1) Get user with password
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (userError || !user) {
    return next(new AppError('User not found', 404));
  }

  // 2) Check if current password is correct
  const isPasswordCorrect = await comparePassword(currentPassword, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // 4) Update password
  const { error: updateError } = await supabase
    .from('users')
    .update({
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    })
    .eq('id', req.user.id);

  if (updateError) {
    return next(new AppError('Error updating password', 500));
  }

  // 5) Get updated user data
  const { data: updatedUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  createSendToken(updatedUser, 200, res);
});

const authController = {
  registerAdmin,
  registerStaff,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateDetails,
  updatePassword
};

export default authController;