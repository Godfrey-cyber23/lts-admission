import Resource from '../models/Resource.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getAllResources = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Resource.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  
  const resources = await features.query;

  res.status(200).json({
    status: 'success',
    results: resources.length,
    data: {
      resources
    }
  });
});

export const createResource = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a file', 400));
  }
  
  const result = await uploadToCloudinary(req.file);
  
  const newResource = await Resource.create({
    title: req.body.title,
    description: req.body.description,
    fileUrl: result.secure_url,
    fileSize: result.bytes,
    fileType: result.format,
    category: req.body.category,
    forAudience: req.body.forAudience,
    academicYear: req.body.academicYear
  });

  res.status(201).json({
    status: 'success',
    data: {
      resource: newResource
    }
  });
});

export const downloadResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);
  
  if (!resource) {
    return next(new AppError('No resource found with that ID', 404));
  }
  
  // Increment download count
  resource.downloadCount += 1;
  await resource.save();
  
  res.redirect(resource.fileUrl);
});

export const deleteResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  
  if (!resource) {
    return next(new AppError('No resource found with that ID', 404));
  }
  
  // TODO: Delete from Cloudinary if needed
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

const resourceController = {
  getAllResources,
  createResource,
  downloadResource,
  deleteResource
};

export default resourceController;