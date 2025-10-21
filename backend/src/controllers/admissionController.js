import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to handle Supabase errors
const handleSupabaseError = (error, next) => {
  console.error('Supabase Error:', error);
  return next(new AppError(`Database error: ${error.message}`, 500));
};

// Helper function to upload file to Supabase Storage
const uploadToSupabase = async (file, bucketName, folderPath = '') => {
  try {
    const fileName = `${folderPath}/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      path: data.path,
      fileName: file.originalname
    };
  } catch (error) {
    throw new Error(`File upload error: ${error.message}`);
  }
};

// Helper function to parse form data from flat structure to nested objects
const parseFormData = (body) => {
  const parsedData = {
    childInfo: {},
    parentInfo: {},
    healthInfo: {},
    declaration: {},
    otherInfo: ''
  };

  // Parse flat form data into nested structure
  Object.entries(body).forEach(([key, value]) => {
    if (key.startsWith('childInfo.')) {
      const field = key.replace('childInfo.', '');
      parsedData.childInfo[field] = value;
    } else if (key.startsWith('parentInfo.')) {
      const field = key.replace('parentInfo.', '');
      parsedData.parentInfo[field] = value;
    } else if (key.startsWith('healthInfo.')) {
      const field = key.replace('healthInfo.', '');
      // Handle array fields (emergencyContacts)
      if (field.startsWith('emergencyContacts')) {
        if (!Array.isArray(parsedData.healthInfo.emergencyContacts)) {
          parsedData.healthInfo.emergencyContacts = [];
        }
        if (value && !parsedData.healthInfo.emergencyContacts.includes(value)) {
          parsedData.healthInfo.emergencyContacts.push(value);
        }
      } else {
        parsedData.healthInfo[field] = value;
      }
    } else if (key.startsWith('declaration.')) {
      const field = key.replace('declaration.', '');
      parsedData.declaration[field] = value;
    } else if (key === 'otherInfo') {
      parsedData.otherInfo = value;
    }
  });

  return parsedData;
};

export const createAdmission = catchAsync(async (req, res, next) => {
  const files = req.files;
  const documents = {};
  let uploadedFiles = [];

  try {
    // Parse the form data from the flat structure
    const formData = parseFormData(req.body);
    const { childInfo, parentInfo, healthInfo, declaration, otherInfo } = formData;

    console.log('Parsed form data:', formData);

    // Add validation for required fields
    if (!childInfo?.firstName || !childInfo?.surname) {
      return next(new AppError('Child first name and surname are required', 400));
    }

    // Process files
    if (!files?.passportPhoto) {
      throw new AppError('Passport photo is required', 400);
    }

    // Process passport photo
    const passportResult = await uploadToSupabase(
      files.passportPhoto[0],
      'admission-documents',
      'passport-photos'
    );
    documents.passportPhoto = {
      url: passportResult.url,
      path: passportResult.path,
      fileName: passportResult.fileName
    };
    uploadedFiles.push({ bucket: 'admission-documents', path: passportResult.path });

    // Process under five card if exists
    if (files?.underFiveCard) {
      const underFiveResult = await uploadToSupabase(
        files.underFiveCard[0],
        'admission-documents',
        'under-five-cards'
      );
      documents.underFiveCard = {
        url: underFiveResult.url,
        path: underFiveResult.path,
        fileName: underFiveResult.fileName
      };
      uploadedFiles.push({ bucket: 'admission-documents', path: underFiveResult.path });
    }

    // Transform data for Supabase - match your database column names
    const admissionData = {
      // Child Information
      "childFirstName": childInfo.firstName,
      "childSurname": childInfo.surname,
      "childDob": childInfo.dob,
      "childAge": childInfo.age,
      "childPlaceOfBirth": childInfo.placeOfBirth,
      "childNationality": childInfo.nationality,
      "childReligion": childInfo.religion,

      // Parent Information
      "fathersName": parentInfo.fathersName,
      "fathersContact": parentInfo.fathersContact,
      "mothersName": parentInfo.mothersName,
      "mothersContact": parentInfo.mothersContact,
      "residentialAddress": parentInfo.residentialAddress,

      // Health Information
      "hasAllergies": healthInfo.hasAllergies || 'No',
      "allergyDetails": healthInfo.allergyDetails,
      "isVaccinated": healthInfo.isVaccinated || 'Yes',
      "vaccinationDetails": healthInfo.vaccinationDetails,
      "doctorDetails": healthInfo.doctorDetails,
      "doctorContact": healthInfo.doctorContact,
      "emergencyContacts": Array.isArray(healthInfo.emergencyContacts)
        ? healthInfo.emergencyContacts
        : (healthInfo.emergencyContacts ? [healthInfo.emergencyContacts] : []),

      // Documents
      "underFiveCardUrl": documents.underFiveCard?.url,
      "passportPhotoUrl": documents.passportPhoto?.url,

      // Declaration
      "declarationName": declaration.declarationName,
      "signatureData": declaration.signatureData,

      // Other Information
      "otherInfo": otherInfo,

      // System fields
      "status": 'pending',
      "admissionDate": new Date().toISOString().split('T')[0],
      "documents": documents,
      "createdAt": new Date().toISOString(),
      "updatedAt": new Date().toISOString()
    };

    console.log('Creating admission with data:', admissionData);

    // Create admission
    const { data: newAdmission, error } = await supabase
      .from('admissions')
      .insert([admissionData])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    res.status(201).json({
      status: 'success',
      message: 'Admission application submitted successfully',
      data: {
        admission: newAdmission
      }
    });

  } catch (error) {
    // Cleanup uploaded files if error occurs
    if (uploadedFiles.length > 0) {
      await Promise.all(
        uploadedFiles.map(file =>
          deleteFromSupabase(file.bucket, file.path).catch(cleanupError =>
            console.error('Cleanup error:', cleanupError)
          )
        )
      );
    }

    if (error instanceof AppError) {
      return next(error);
    }
    handleSupabaseError(error, next);
  }
});

// Helper function to delete file from Supabase Storage
const deleteFromSupabase = async (bucketName, filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
    }
  } catch (error) {
    console.error('File deletion error:', error);
  }
};

// Helper function to build admission query with filters
const buildAdmissionQuery = (req) => {
  let query = supabase.from('admissions').select(`
    *,
    assigned_to:users!admissions_assignedTo_fkey (
      id, firstName, lastName, email
    ),
    notes:admission_notes(
      *,
      created_by:users!admission_notes_createdBy_fkey (
        id, firstName, lastName
      )
    )
  `);

  // Apply filters
  if (req.query.status) {
    query = query.eq('status', req.query.status);
  }

  if (req.query.assignedTo) {
    query = query.eq('assignedTo', req.query.assignedTo);
  }

  // Search functionality
  if (req.query.search) {
    query = query.or(`childFirstName.ilike.%${req.query.search}%,childSurname.ilike.%${req.query.search}%,fathersName.ilike.%${req.query.search}%,mothersName.ilike.%${req.query.search}%`);
  }

  // Sorting
  const sortBy = req.query.sort || 'createdAt.desc';
  const [sortField, sortOrder] = sortBy.split('.');
  query = query.order(sortField, { ascending: sortOrder === 'asc' });

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  return { query, page, limit };
};

export const getAllAdmissions = catchAsync(async (req, res, next) => {
  const { query, page, limit } = buildAdmissionQuery(req);

  const { data: admissions, error } = await query;

  if (error) {
    return handleSupabaseError(error, next);
  }

  // Get total count for pagination
  const { count: totalCount, error: countError } = await supabase
    .from('admissions')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    return handleSupabaseError(countError, next);
  }

  res.status(200).json({
    status: 'success',
    results: admissions.length,
    data: {
      admissions: admissions || []
    },
    pagination: {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    }
  });
});

export const getAdmission = catchAsync(async (req, res, next) => {
  const { data: admission, error } = await supabase
    .from('admissions')
    .select(`
      *,
      assigned_to:users!admissions_assignedTo_fkey (
        id, firstName, lastName, email
      ),
      notes:admission_notes(
        *,
        created_by:users!admission_notes_createdBy_fkey (
          id, firstName, lastName
        )
      )
    `)
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No admission found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      admission
    }
  });
});

export const updateAdmissionStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new AppError('Status is required', 400));
  }

  const validStatuses = ['pending', 'under_review', 'accepted', 'rejected', 'waitlisted'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const { data: admission, error } = await supabase
    .from('admissions')
    .update({
      status: status,
      updatedAt: new Date().toISOString()
    })
    .eq('id', req.params.id)
    .select(`
      *,
      assigned_to:users!admissions_assignedTo_fkey (
        id, firstName, lastName
      )
    `)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No admission found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      admission
    }
  });
});

export const assignAdmission = catchAsync(async (req, res, next) => {
  const { staffId } = req.body;

  if (!staffId) {
    return next(new AppError('Staff ID is required', 400));
  }

  // Verify staff exists and has appropriate role
  const { data: staff, error: staffError } = await supabase
    .from('users')
    .select('id, role')
    .eq('id', staffId)
    .in('role', ['admin', 'staff'])
    .single();

  if (staffError || !staff) {
    return next(new AppError('Invalid staff member', 400));
  }

  const { data: admission, error } = await supabase
    .from('admissions')
    .update({
      assignedTo: staffId,
      updatedAt: new Date().toISOString()
    })
    .eq('id', req.params.id)
    .select(`
      *,
      assigned_to:users!admissions_assignedTo_fkey (
        id, firstName, lastName, email
      )
    `)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No admission found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      admission
    }
  });
});

export const addNote = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new AppError('Note content is required', 400));
  }

  const noteData = {
    admissionId: req.params.id,
    content: content,
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };

  // First, verify admission exists
  const { data: admission, error: admissionError } = await supabase
    .from('admissions')
    .select('id')
    .eq('id', req.params.id)
    .single();

  if (admissionError || !admission) {
    return next(new AppError('No admission found with that ID', 404));
  }

  // Add note
  const { data: newNote, error } = await supabase
    .from('admission_notes')
    .insert([noteData])
    .select(`
      *,
      created_by:users!admission_notes_createdBy_fkey (
        id, firstName, lastName
      )
    `)
    .single();

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      note: newNote
    }
  });
});

export const deleteAdmission = catchAsync(async (req, res, next) => {
  // First get admission to check for documents to delete
  const { data: admission, error: fetchError } = await supabase
    .from('admissions')
    .select('documents')
    .eq('id', req.params.id)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      return next(new AppError('No admission found with that ID', 404));
    }
    return handleSupabaseError(fetchError, next);
  }

  // Delete associated files from Supabase Storage
  if (admission.documents) {
    const filesToDelete = [];
    if (admission.documents.passportPhoto) {
      filesToDelete.push(admission.documents.passportPhoto.path);
    }
    if (admission.documents.underFiveCard) {
      filesToDelete.push(admission.documents.underFiveCard.path);
    }

    if (filesToDelete.length > 0) {
      await supabase.storage
        .from('admission-documents')
        .remove(filesToDelete)
        .catch(error => console.error('Error deleting files:', error));
    }
  }

  // Delete admission notes first (due to foreign key constraint)
  await supabase
    .from('admission_notes')
    .delete()
    .eq('admissionId', req.params.id);

  // Delete admission
  const { error } = await supabase
    .from('admissions')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const admissionController = {
  getAllAdmissions,
  getAdmission,
  createAdmission,
  updateAdmissionStatus,
  assignAdmission,
  addNote,
  deleteAdmission
};

export default admissionController;