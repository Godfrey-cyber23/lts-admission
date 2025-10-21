import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const getPrograms = catchAsync(async (req, res, next) => {
  let query = supabase
    .from('programs')
    .select('*', { count: 'exact' })
    .eq('isActive', true);

  // Sorting
  const sortBy = req.query.sort || 'created_at.desc';
  const [sortField, sortOrder] = sortBy.split('.');
  query = query.order(sortField, { ascending: sortOrder === 'asc' });

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: programs, error, count } = await query.range(from, to);

  if (error) {
    return next(new AppError('Error fetching programs', 500));
  }

  res.status(200).json({
    status: 'success',
    results: programs?.length || 0,
    data: {
      programs: programs || []
    },
    pagination: {
      page,
      limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit)
    }
  });
});

export const getProgram = catchAsync(async (req, res, next) => {
  const { data: program, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No program found with that ID', 404));
    }
    return next(new AppError('Error fetching program', 500));
  }

  res.status(200).json({
    status: 'success',
    data: {
      program
    }
  });
});

export const createProgram = catchAsync(async (req, res, next) => {
  const programData = {
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: newProgram, error } = await supabase
    .from('programs')
    .insert([programData])
    .select()
    .single();

  if (error) {
    return next(new AppError('Error creating program', 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      program: newProgram
    }
  });
});

export const updateProgram = catchAsync(async (req, res, next) => {
  const updateData = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  const { data: program, error } = await supabase
    .from('programs')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No program found with that ID', 404));
    }
    return next(new AppError('Error updating program', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      program
    }
  });
});

export const deleteProgram = catchAsync(async (req, res, next) => {
  const { data: program, error } = await supabase
    .from('programs')
    .update({ 
      isActive: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No program found with that ID', 404));
    }
    return next(new AppError('Error deleting program', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      program
    }
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