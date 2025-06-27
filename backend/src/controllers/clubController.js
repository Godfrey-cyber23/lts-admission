import Club from '../models/Club.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllClubs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Club.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const clubs = await features.query.populate('supervisor', 'firstName lastName');

  res.status(200).json({
    status: 'success',
    results: clubs.length,
    data: {
      clubs
    }
  });
});

export const createClub = catchAsync(async (req, res, next) => {
  const newClub = await Club.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      club: newClub
    }
  });
});

export const updateClub = catchAsync(async (req, res, next) => {
  const club = await Club.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!club) {
    return next(new AppError('No club found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      club
    }
  });
});

export const deleteClub = catchAsync(async (req, res, next) => {
  const club = await Club.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!club) {
    return next(new AppError('No club found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});