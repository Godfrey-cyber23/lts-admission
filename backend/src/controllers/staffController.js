import Staff from '../models/Staff.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllStaff = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Staff.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const staff = await features.query;

  res.status(200).json({
    status: 'success',
    results: staff.length,
    data: {
      staff
    }
  });
});

export const createStaff = catchAsync(async (req, res, next) => {
  const newStaff = await Staff.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      staff: newStaff
    }
  });
});

export const updateStaff = catchAsync(async (req, res, next) => {
  const staff = await Staff.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!staff) {
    return next(new AppError('No staff member found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      staff
    }
  });
});

export const deleteStaff = catchAsync(async (req, res, next) => {
  const staff = await Staff.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!staff) {
    return next(new AppError('No staff member found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

