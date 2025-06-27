  
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import ErrorResponse from '../utils/errorResponse.js';
import catchAsync from '../utils/catchAsync.js';  // Added .js
import sendEmail from '../utils/email.js';       // Added .js
import User from '../models/User.js';            // Added .js

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

export const registerAdmin = catchAsync(async (req, res, next) => {
  // Check if any admin exists
  const adminCount = await User.countDocuments({ role: { $in: ['admin', 'superadmin'] } });
  
  if (adminCount > 0) {
    return next(new ErrorResponse('Admin registration is closed', 403));
  }
  
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: 'superadmin',
    permissions: ['all']
  });
  
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }
  
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }
  
  // 3) Check if account is active
  if (!user.isActive) {
    return next(new ErrorResponse('Your account has been deactivated', 403));
  }
  
  // 4) Update last login
  user.lastLogin = Date.now();
  await user.save();
  
  // 5) If everything ok, send token to client
  createSendToken(user, 200, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('There is no user with that email address.', 404));
  }
  
  // 2) Generate the random reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
  
  const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });
    
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(new ErrorResponse('There was an error sending the email. Try again later!', 500));
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new ErrorResponse('Token is invalid or has expired', 400));
  }
  
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  
  // 3) Update changedPasswordAt property for the user
  // Handled in user model pre-save hook
  
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const updateDetails = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone
    },
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  
  // 2) Check if POSTed current password is correct
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Your current password is wrong.', 401));
  }
  
  // 3) If so, update password
  user.password = req.body.newPassword;
  await user.save();
  
  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
