import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to handle Supabase errors
const handleSupabaseError = (error, next) => {
  console.error('Supabase Error:', error);
  return next(new AppError(`Database error: ${error.message}`, 500));
};

export const getAllStudents = catchAsync(async (req, res, next) => {
  try {
    const { data: students, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false }); // Changed to snake_case

    if (error) {
      // If students table doesn't exist yet, return empty array
      if (error.code === 'PGRST205') {
        return res.status(200).json({
          status: 'success',
          data: {
            students: []
          }
        });
      }
      return handleSupabaseError(error, next);
    }

    res.status(200).json({
      status: 'success',
      data: {
        students: students || []
      }
    });
  } catch (error) {
    console.error('Error in getAllStudents:', error);
    return res.status(200).json({
      status: 'success',
      data: {
        students: []
      }
    });
  }
});

// Simple function to convert admission to student
export const createStudentFromAdmission = catchAsync(async (req, res, next) => {
  const { admissionId, classId, studentCode } = req.body;

  // First get the admission (camelCase)
  const { data: admission, error: admissionError } = await supabase
    .from('admissions')
    .select('*')
    .eq('id', admissionId)
    .single();

  if (admissionError || !admission) {
    return next(new AppError('Admission not found', 404));
  }

  // Create student record with snake_case column names
  const studentData = {
    admission_id: admissionId,
    class_id: classId,
    student_code: studentCode,
    first_name: admission.childFirstName,
    last_name: admission.childSurname,
    date_of_birth: admission.childDob,
    age: admission.childAge,
    parent_name: admission.fathersName || admission.mothersName,
    parent_contact: admission.fathersContact || admission.mothersContact,
    emergency_contact: Array.isArray(admission.emergencyContacts) 
      ? admission.emergencyContacts.join(', ') 
      : (admission.emergencyContacts || ''),
    medical_notes: admission.allergyDetails || admission.vaccinationDetails || '',
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'active'
  };

  const { data: newStudent, error } = await supabase
    .from('students')
    .insert([studentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating student:', error);
    return next(new AppError('Error creating student: ' + error.message, 500));
  }

  // Update admission status to 'accepted' (camelCase)
  await supabase
    .from('admissions')
    .update({ status: 'accepted' })
    .eq('id', admissionId);

  res.status(201).json({
    status: 'success',
    data: {
      student: newStudent
    }
  });
});

export const getStudent = catchAsync(async (req, res, next) => {
  const { data: student, error } = await supabase
    .from('students')
    .select(`
      *,
      class:classes(name, grade_level),
      admission:admissions(*)
    `)
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No student found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      student
    }
  });
});

export const updateStudent = catchAsync(async (req, res, next) => {
  const { classId, status, medicalNotes } = req.body;

  const updateData = {
    class_id: classId, // Changed to snake_case
    status: status,
    medical_notes: medicalNotes, // Changed to snake_case
    updated_at: new Date().toISOString() // Changed to snake_case
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data: updatedStudent, error } = await supabase
    .from('students')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No student found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      student: updatedStudent
    }
  });
});

export const deleteStudent = catchAsync(async (req, res, next) => {
  const { error } = await supabase
    .from('students')
    .update({ 
      status: 'inactive',
      updated_at: new Date().toISOString() // Changed to snake_case
    })
    .eq('id', req.params.id);

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No student found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    message: 'Student deactivated successfully'
  });
});

export const getStudentStats = catchAsync(async (req, res, next) => {
  try {
    // Get total students count
    const { count: totalStudents, error: countError } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (countError) {
      // If table doesn't exist, return zero stats
      if (countError.code === 'PGRST205') {
        return res.status(200).json({
          status: 'success',
          data: {
            stats: {
              totalStudents: 0,
              byStatus: {},
              byClass: {}
            }
          }
        });
      }
      throw countError;
    }

    // Get students by status
    const { data: statusData, error: statusError } = await supabase
      .from('students')
      .select('status');

    const statusStats = {};
    if (statusData && !statusError) {
      statusData.forEach(student => {
        statusStats[student.status] = (statusStats[student.status] || 0) + 1;
      });
    }

    // Get students by class
    const { data: classData, error: classError } = await supabase
      .from('students')
      .select('class_id, class:classes(name)'); // Changed to snake_case

    const classStats = {};
    if (classData && !classError) {
      classData.forEach(student => {
        const className = student.class?.name || 'Unassigned';
        classStats[className] = (classStats[className] || 0) + 1;
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalStudents: totalStudents || 0,
          byStatus: statusStats,
          byClass: classStats
        }
      }
    });
  } catch (error) {
    console.error('Error in getStudentStats:', error);
    // Return empty stats if there's an error
    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          totalStudents: 0,
          byStatus: {},
          byClass: {}
        }
      }
    });
  }
});

// Add a separate createStudent function for direct student creation
export const createStudent = catchAsync(async (req, res, next) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    age,
    gender,
    parentName,
    parentContact,
    emergencyContact,
    medicalNotes,
    classId,
    studentCode
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !dateOfBirth || !studentCode) {
    return next(new AppError('First name, last name, date of birth, and student code are required', 400));
  }

  // Convert to snake_case for database
  const studentData = {
    first_name: firstName,
    last_name: lastName,
    date_of_birth: dateOfBirth,
    age: age,
    gender: gender,
    parent_name: parentName,
    parent_contact: parentContact,
    emergency_contact: emergencyContact,
    medical_notes: medicalNotes,
    class_id: classId,
    student_code: studentCode,
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'active'
  };

  const { data: newStudent, error } = await supabase
    .from('students')
    .insert([studentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating student:', error);
    return next(new AppError('Error creating student: ' + error.message, 500));
  }

  res.status(201).json({
    status: 'success',
    data: {
      student: newStudent
    }
  });
});

const studentController = {
  getAllStudents,
  getStudent,
  createStudent, // Added this
  createStudentFromAdmission,
  updateStudent,
  deleteStudent,
  getStudentStats
};

export default studentController;