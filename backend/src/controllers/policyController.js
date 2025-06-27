import Policy from '../models/Policy.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllPolicies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Policy.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const policies = await features.query;

  res.status(200).json({
    status: 'success',
    results: policies.length,
    data: {
      policies
    }
  });
});

export const getPolicyByCategory = catchAsync(async (req, res, next) => {
  const policies = await Policy.find({ 
    category: req.params.category,
    isActive: true 
  });
  
  res.status(200).json({
    status: 'success',
    results: policies.length,
    data: {
      policies
    }
  });
});

export const createPolicy = catchAsync(async (req, res, next) => {
  const newPolicy = await Policy.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      policy: newPolicy
    }
  });
});

export const updatePolicy = catchAsync(async (req, res, next) => {
  const policy = await Policy.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!policy) {
    return next(new AppError('No policy found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      policy
    }
  });
});

export const deletePolicy = catchAsync(async (req, res, next) => {
  const policy = await Policy.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!policy) {
    return next(new AppError('No policy found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const policyController = {
  getAllPolicies,
  getPolicyByCategory,
  createPolicy,
  updatePolicy,
  deletePolicy
};

export default policyController;