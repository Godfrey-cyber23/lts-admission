import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to handle Supabase errors
const handleSupabaseError = (error, next) => {
  console.error('Supabase Error:', error);
  return next(new AppError(`Database error: ${error.message}`, 500));
};

export const getAllClasses = catchAsync(async (req, res, next) => {
  const { data: classes, error } = await supabase
    .from('classes')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      classes: classes || []
    }
  });
});

export const getClass = catchAsync(async (req, res, next) => {
  const { data: classData, error } = await supabase
    .from('classes')
    .select(`
      *,
      students:students(*, admission:admissions(childFirstName, childSurname)),
      teacher:users(firstName, lastName)
    `)
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No class found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      class: classData
    }
  });
});

export const createClass = catchAsync(async (req, res, next) => {
  const {
    name,
    grade_level,
    capacity,
    teacher_id,
    room_number,
    schedule
  } = req.body;

  // Validate required fields
  if (!name || !grade_level) {
    return next(new AppError('Class name and grade level are required', 400));
  }

  const classData = {
    name,
    grade_level,
    capacity: capacity || 30,
    teacher_id: teacher_id || null,
    room_number: room_number || '',
    schedule: schedule || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: newClass, error } = await supabase
    .from('classes')
    .insert([classData])
    .select()
    .single();

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(201).json({
    status: 'success',
    data: {
      class: newClass
    }
  });
});

export const updateClass = catchAsync(async (req, res, next) => {
  const {
    name,
    grade_level,
    capacity,
    teacher_id,
    room_number,
    schedule
  } = req.body;

  const updateData = {
    name,
    grade_level,
    capacity,
    teacher_id,
    room_number,
    schedule,
    updated_at: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data: updatedClass, error } = await supabase
    .from('classes')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No class found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      class: updatedClass
    }
  });
});

export const deleteClass = catchAsync(async (req, res, next) => {
  // Check if class has students
  const { data: students, error: studentError } = await supabase
    .from('students')
    .select('id')
    .eq('class_id', req.params.id)
    .limit(1);

  if (studentError) {
    return handleSupabaseError(studentError, next);
  }

  if (students && students.length > 0) {
    return next(new AppError('Cannot delete class with enrolled students', 400));
  }

  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No class found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const getAcademicStats = catchAsync(async (req, res, next) => {
  // Get total classes count
  const { count: totalClasses, error: classError } = await supabase
    .from('classes')
    .select('*', { count: 'exact', head: true });

  if (classError) {
    return handleSupabaseError(classError, next);
  }

  // Get classes by grade level
  const { data: gradeData, error: gradeError } = await supabase
    .from('classes')
    .select('grade_level');

  const gradeStats = {};
  if (gradeData && !gradeError) {
    gradeData.forEach(classItem => {
      gradeStats[classItem.grade_level] = (gradeStats[classItem.grade_level] || 0) + 1;
    });
  }

  // Get total students per class
  const { data: studentCounts, error: studentError } = await supabase
    .from('students')
    .select('class_id');

  const classOccupancy = {};
  if (studentCounts && !studentError) {
    studentCounts.forEach(student => {
      classOccupancy[student.class_id] = (classOccupancy[student.class_id] || 0) + 1;
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalClasses: totalClasses || 0,
        byGradeLevel: gradeStats,
        classOccupancy
      }
    }
  });
});

const academicController = {
  getAllClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  getAcademicStats
};

export default academicController;