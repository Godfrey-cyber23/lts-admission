import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// User Management Functions

export const getUsers = catchAsync(async (req, res, next) => {
  let query = supabase.from('users').select('*', { count: 'exact' });

  // Filter by role if provided
  if (req.query.role) {
    query = query.eq('role', req.query.role);
  }

  // Search functionality
  if (req.query.search) {
    query = query.or(`first_name.ilike.%${req.query.search}%,last_name.ilike.%${req.query.search}%,email.ilike.%${req.query.search}%`);
  }

  // Sorting
  const sortBy = req.query.sort || 'created_at.desc';
  const [sortField, sortOrder] = sortBy.split('.');
  query = query.order(sortField, { ascending: sortOrder === 'asc' });

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: users, error, count } = await query.range(from, to);

  if (error) {
    return next(new AppError('Error fetching users', 500));
  }

  res.status(200).json({
    status: 'success',
    results: users?.length || 0,
    data: {
      users: users || []
    },
    pagination: {
      page,
      limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit)
    }
  });
});

export const getUser = catchAsync(async (req, res, next) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('User not found', 404));
    }
    return next(new AppError('Error fetching user', 500));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const createUser = catchAsync(async (req, res, next) => {
  const { email, password, first_name, last_name, role } = req.body;

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name,
      last_name,
      role: role || 'user'
    }
  });

  if (authError) {
    return next(new AppError(authError.message, 400));
  }

  // Create user profile
  const userData = {
    id: authData.user.id,
    email,
    first_name,
    last_name,
    role: role || 'user',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (userError) {
    // Cleanup auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    return next(new AppError('Failed to create user profile', 400));
  }

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const updateData = {
    ...req.body,
    updated_at: new Date().toISOString()
  };

  // Remove id from update data if present
  delete updateData.id;

  const { data: user, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('User not found', 404));
    }
    return next(new AppError('Error updating user', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  // Prevent deletion of last admin
  if (req.user.role === 'admin' || req.user.role === 'superadmin') {
    const { data: adminUsers, error: countError } = await supabase
      .from('users')
      .select('id')
      .in('role', ['admin', 'superadmin']);

    if (!countError && adminUsers && adminUsers.length <= 1) {
      return next(new AppError('Cannot delete the last admin user', 400));
    }
  }

  // Delete user from Supabase Auth and cascade to users table
  const { error } = await supabase.auth.admin.deleteUser(req.params.id);

  if (error) {
    return next(new AppError('Error deleting user', 400));
  }

  res.status(200).json({
    status: 'success',
    data: null
  });
});

// Subscriber Management Functions

export const getSubscribers = catchAsync(async (req, res, next) => {
  let query = supabase.from('subscribers').select('*', { count: 'exact' });

  // Search functionality
  if (req.query.search) {
    query = query.ilike('email', `%${req.query.search}%`);
  }

  // Sorting
  const sortBy = req.query.sort || 'subscribed_at.desc';
  const [sortField, sortOrder] = sortBy.split('.');
  query = query.order(sortField, { ascending: sortOrder === 'asc' });

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: subscribers, error, count } = await query.range(from, to);

  if (error) {
    return next(new AppError('Error fetching subscribers', 500));
  }

  res.status(200).json({
    status: 'success',
    results: subscribers?.length || 0,
    data: {
      subscribers: subscribers || []
    },
    pagination: {
      page,
      limit,
      total: count || 0,
      pages: Math.ceil((count || 0) / limit)
    }
  });
});

export const subscribe = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  // Check if email is already subscribed
  const { data: existingSubscriber, error: checkError } = await supabase
    .from('subscribers')
    .select('id')
    .eq('email', email)
    .single();

  if (existingSubscriber) {
    return res.status(200).json({
      status: 'success',
      message: 'You are already subscribed to our newsletter.'
    });
  }

  // Add new subscriber
  const { data: newSubscriber, error } = await supabase
    .from('subscribers')
    .insert([{
      email,
      subscribed_at: new Date().toISOString(),
      is_active: true
    }])
    .select()
    .single();

  if (error) {
    return next(new AppError('Failed to subscribe to newsletter', 500));
  }

  res.status(201).json({
    status: 'success',
    message: 'Successfully subscribed to our newsletter.',
    data: {
      subscriber: newSubscriber
    }
  });
});

export const unsubscribe = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  // Find and update subscriber
  const { data: subscriber, error } = await supabase
    .from('subscribers')
    .update({ is_active: false })
    .eq('email', email)
    .select()
    .single();

  if (error || !subscriber) {
    return next(new AppError('Subscriber not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'You have been unsubscribed from our newsletter.'
  });
});

export const deleteSubscriber = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Delete subscriber
  const { error } = await supabase
    .from('subscribers')
    .delete()
    .eq('id', id);

  if (error) {
    return next(new AppError('Error deleting subscriber', 500));
  }

  res.status(200).json({
    status: 'success',
    message: 'Subscriber deleted successfully.'
  });
});

const userController = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getSubscribers,
  subscribe,
  unsubscribe,
  deleteSubscriber
};

export default userController;