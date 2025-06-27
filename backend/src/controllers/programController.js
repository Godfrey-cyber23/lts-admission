import Program from '../models/Program.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getPrograms = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Program.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const programs = await features.query;

  res.status(200).json({
    status: 'success',
    results: programs.length,
    data: {
      programs
    }
  });
});

export const getProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findById(req.params.id);
  
  if (!program) {
    return next(new AppError('No program found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      program
    }
  });
});

export const createProgram = catchAsync(async (req, res, next) => {
  const newProgram = await Program.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      program: newProgram
    }
  });
});

export const updateProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!program) {
    return next(new AppError('No program found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      program
    }
  });
});

export const deleteProgram = catchAsync(async (req, res, next) => {
  const program = await Program.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!program) {
    return next(new AppError('No program found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const programController = {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
};

export default programController;