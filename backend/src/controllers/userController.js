import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  res.status(200).json(res.advancedResults);
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Create user
 * @route   POST /api/users
 * @access  Private/Admin
 */
export const createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Prevent deletion of last admin
  if (user.role === 'admin' || user.role === 'superadmin') {
    const adminCount = await User.countDocuments({ 
      role: { $in: ['admin', 'superadmin'] } 
    });
    
    if (adminCount <= 1) {
      return next(new ErrorResponse('Cannot delete the last admin user', 400));
    }
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Update user permissions
 * @route   PUT /api/users/:id/permissions
 * @access  Private/SuperAdmin
 */
export const updatePermissions = asyncHandler(async (req, res, next) => {
  const { permissions } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Only superadmin can update permissions
  if (req.user.role !== 'superadmin') {
    return next(new ErrorResponse('Not authorized to update permissions', 401));
  }

  user.permissions = permissions;
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

const userController = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePermissions
};

export default userController;