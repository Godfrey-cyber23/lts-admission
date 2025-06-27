import Scholarship from '../models/Scholarship.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllScholarships = catchAsync(async (req, res, next) => {
  const now = new Date();
  const filter = { 
    isActive: true,
    applicationDeadline: { $gte: now } 
  };
  
  const features = new APIFeatures(Scholarship.find(filter), req.query)
    .filter()
    .sort('applicationDeadline')
    .limitFields()
    .paginate();
  
  const scholarships = await features.query.populate('availableFor', 'name');

  res.status(200).json({
    status: 'success',
    results: scholarships.length,
    data: {
      scholarships
    }
  });
});

export const createScholarship = catchAsync(async (req, res, next) => {
  const newScholarship = await Scholarship.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      scholarship: newScholarship
    }
  });
});

export const updateScholarship = catchAsync(async (req, res, next) => {
  const scholarship = await Scholarship.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!scholarship) {
    return next(new AppError('No scholarship found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      scholarship
    }
  });
});

export const deleteScholarship = catchAsync(async (req, res, next) => {
  const scholarship = await Scholarship.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!scholarship) {
    return next(new AppError('No scholarship found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

