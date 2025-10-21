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
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype
    };
  } catch (error) {
    throw new Error(`File upload error: ${error.message}`);
  }
};

// Helper function to delete file from Supabase Storage
const deleteFromSupabase = async (bucketName, filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  } catch (error) {
    console.error('File deletion error:', error);
    throw error;
  }
};

// Helper function to build resource query with filters
const buildResourceQuery = (req) => {
  let query = supabase.from('resources').select('*', { count: 'exact' });

  // Apply filters
  if (req.query.category) {
    query = query.eq('category', req.query.category);
  }

  if (req.query.forAudience) {
    query = query.eq('for_audience', req.query.forAudience);
  }

  if (req.query.academicYear) {
    query = query.eq('academic_year', req.query.academicYear);
  }

  // Search functionality
  if (req.query.search) {
    query = query.or(`title.ilike.%${req.query.search}%,description.ilike.%${req.query.search}%`);
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

  query = query.range(from, to);

  return { query, page, limit };
};

export const getAllResources = catchAsync(async (req, res, next) => {
  const { query, page, limit } = buildResourceQuery(req);
  
  const { data: resources, error, count } = await query;

  if (error) {
    return handleSupabaseError(error, next);
  }

  // Get total count for pagination
  const { count: totalCount, error: countError } = await supabase
    .from('resources')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    return handleSupabaseError(countError, next);
  }

  res.status(200).json({
    status: 'success',
    results: resources?.length || 0,
    data: {
      resources: resources || []
    },
    pagination: {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    }
  });
});

export const getResource = catchAsync(async (req, res, next) => {
  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No resource found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      resource
    }
  });
});

export const createResource = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }

  let uploadedFile = null;
  
  try {
    // Upload file to Supabase Storage
    const uploadResult = await uploadToSupabase(
      req.file,
      'resources',
      req.body.category || 'general'
    );

    uploadedFile = {
      bucket: 'resources',
      path: uploadResult.path
    };

    // Create resource record in database
    const resourceData = {
      title: req.body.title,
      description: req.body.description,
      file_url: uploadResult.url,
      file_path: uploadResult.path,
      file_name: uploadResult.fileName,
      file_size: uploadResult.fileSize,
      file_type: uploadResult.fileType,
      category: req.body.category || 'general',
      for_audience: req.body.forAudience || 'both',
      academic_year: req.body.academicYear,
      download_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newResource, error } = await supabase
      .from('resources')
      .insert([resourceData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      status: 'success',
      data: {
        resource: newResource
      }
    });

  } catch (error) {
    // Cleanup uploaded file if error occurs
    if (uploadedFile) {
      await deleteFromSupabase(uploadedFile.bucket, uploadedFile.path)
        .catch(cleanupError => 
          console.error('Cleanup error during resource creation:', cleanupError)
        );
    }
    
    if (error instanceof AppError) {
      return next(error);
    }
    handleSupabaseError(error, next);
  }
});

export const downloadResource = catchAsync(async (req, res, next) => {
  // First get the resource to get file URL and increment download count
  const { data: resource, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No resource found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  // Increment download count
  const { error: updateError } = await supabase
    .from('resources')
    .update({ 
      download_count: (resource.download_count || 0) + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', req.params.id);

  if (updateError) {
    console.error('Error updating download count:', updateError);
  }

  // Redirect to the file URL (Supabase Storage public URL)
  res.redirect(resource.file_url);
});

export const updateResource = catchAsync(async (req, res, next) => {
  const { title, description, category, forAudience, academicYear } = req.body;

  const updateData = {
    title,
    description,
    category,
    for_audience: forAudience,
    academic_year: academicYear,
    updated_at: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data: updatedResource, error } = await supabase
    .from('resources')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No resource found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      resource: updatedResource
    }
  });
});

export const deleteResource = catchAsync(async (req, res, next) => {
  // First get the resource to get file path for deletion
  const { data: resource, error: fetchError } = await supabase
    .from('resources')
    .select('file_path')
    .eq('id', req.params.id)
    .single();

  if (fetchError) {
    if (fetchError.code === 'PGRST116') {
      return next(new AppError('No resource found with that ID', 404));
    }
    return handleSupabaseError(fetchError, next);
  }

  // Delete file from Supabase Storage
  if (resource.file_path) {
    await deleteFromSupabase('resources', resource.file_path)
      .catch(error => console.error('Error deleting file from storage:', error));
  }

  // Delete resource record from database
  const { error } = await supabase
    .from('resources')
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

const resourceController = {
  getAllResources,
  getResource,
  createResource,
  downloadResource,
  updateResource,
  deleteResource
};

export default resourceController;