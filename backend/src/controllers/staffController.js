import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to handle Supabase errors
const handleSupabaseError = (error, next) => {
  console.error('Supabase Error:', error);
  return next(new AppError(`Database error: ${error.message}`, 500));
};

export const getAllStaff = catchAsync(async (req, res, next) => {
  const { data: staff, error } = await supabase
    .from('users')
    .select('*')
    .in('role', ['staff', 'admin', 'teacher'])
    .order('created_at', { ascending: false });

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      staff: staff || []
    }
  });
});

export const getStaff = catchAsync(async (req, res, next) => {
  const { data: staff, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .in('role', ['staff', 'admin', 'teacher'])
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No staff member found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      staff
    }
  });
});

export const createStaff = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
    department,
    position,
    salary,
    hireDate,
    isActive
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !role) {
    return next(new AppError('First name, last name, email, password, and role are required', 400));
  }

  // Check if email already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  const staffData = {
    firstName,
    lastName,
    email,
    password, // In production, hash this password
    phone: phone || '',
    role: role || 'staff',
    department: department || '',
    position: position || '',
    salary: salary || null,
    hire_date: hireDate || new Date().toISOString().split('T')[0],
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const { data: newStaff, error } = await supabase
    .from('users')
    .insert([staffData])
    .select()
    .single();

  if (error) {
    return handleSupabaseError(error, next);
  }

  // Remove password from response
  const { password: _, ...staffWithoutPassword } = newStaff;

  res.status(201).json({
    status: 'success',
    data: {
      staff: staffWithoutPassword
    }
  });
});

export const updateStaff = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    department,
    position,
    salary,
    isActive
  } = req.body;

  const updateData = {
    firstName,
    lastName,
    email,
    phone,
    role,
    department,
    position,
    salary,
    isActive,
    updatedAt: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  // Check if email is being changed and if it already exists
  if (email) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .neq('id', req.params.id)
      .single();

    if (existingUser) {
      return next(new AppError('Another user with this email already exists', 400));
    }
  }

  const { data: updatedStaff, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', req.params.id)
    .in('role', ['staff', 'admin', 'teacher'])
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No staff member found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  // Remove password from response
  const { password: _, ...staffWithoutPassword } = updatedStaff;

  res.status(200).json({
    status: 'success',
    data: {
      staff: staffWithoutPassword
    }
  });
});

export const deleteStaff = catchAsync(async (req, res, next) => {
  // Don't allow deleting your own account
  if (req.params.id === req.user.id) {
    return next(new AppError('You cannot delete your own account', 400));
  }

  const { error } = await supabase
    .from('users')
    .update({ isActive: false })
    .eq('id', req.params.id)
    .in('role', ['staff', 'admin', 'teacher']);

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No staff member found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    message: 'Staff member deactivated successfully'
  });
});

export const getStaffStats = catchAsync(async (req, res, next) => {
  // Get total staff count
  const { count: totalStaff, error: countError } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .in('role', ['staff', 'admin', 'teacher'])
    .eq('isActive', true);

  if (countError) {
    return handleSupabaseError(countError, next);
  }

  // Get staff by role
  const { data: roleData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .in('role', ['staff', 'admin', 'teacher'])
    .eq('isActive', true);

  if (roleError) {
    return handleSupabaseError(roleError, next);
  }

  const roleStats = {};
  if (roleData) {
    roleData.forEach(staff => {
      roleStats[staff.role] = (roleStats[staff.role] || 0) + 1;
    });
  }

  // Get staff by department
  const { data: deptData, error: deptError } = await supabase
    .from('users')
    .select('department')
    .in('role', ['staff', 'admin', 'teacher'])
    .eq('isActive', true);

  const deptStats = {};
  if (deptData && !deptError) {
    deptData.forEach(staff => {
      const dept = staff.department || 'Unassigned';
      deptStats[dept] = (deptStats[dept] || 0) + 1;
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalStaff: totalStaff || 0,
        byRole: roleStats,
        byDepartment: deptStats
      }
    }
  });
});

const staffController = {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffStats
};

export default staffController;