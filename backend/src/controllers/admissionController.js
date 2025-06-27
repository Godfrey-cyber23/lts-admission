import Admission from '../models/Admission.js';
import User from '../models/User.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

export const getAllAdmissions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Admission.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .search(['childInfo.firstName', 'childInfo.surname', 'parentInfo.fathersName', 'parentInfo.mothersName']);
  
  const admissions = await features.query.populate('assignedTo', 'firstName lastName email');

  res.status(200).json({
    status: 'success',
    results: admissions.length,
    data: {
      admissions
    }
  });
});

export const getAdmission = catchAsync(async (req, res, next) => {
  const admission = await Admission.findById(req.params.id)
    .populate('assignedTo', 'firstName lastName email')
    .populate('notes.createdBy', 'firstName lastName');
  
  if (!admission) {
    return next(new AppError('No admission found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      admission
    }
  });
});

export const createAdmission = catchAsync(async (req, res, next) => {
  // Handle file uploads
  const files = req.files;
  const documents = {};
  
  try {
    if (files) {
      if (files['underFiveCard']) {
        const result = await uploadToCloudinary(files['underFiveCard'][0]);
        documents.underFiveCard = result.secure_url;
      }
      
      if (files['passportPhoto']) {
        const result = await uploadToCloudinary(files['passportPhoto'][0]);
        documents.passportPhoto = result.secure_url;
      }
    }
    
    // Create new admission with form data and files
    const newAdmission = await Admission.create({
      ...req.body,
      documents
    });

    // Notify admins via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('newAdmission', newAdmission);
    }

    res.status(201).json({
      status: 'success',
      data: {
        admission: newAdmission
      }
    });
  } catch (error) {
    console.error('Error creating admission:', error);
    return next(new AppError('Failed to create admission. Please try again.', 500));
  }
});

export const updateAdmissionStatus = catchAsync(async (req, res, next) => {
  const admission = await Admission.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  ).populate('assignedTo', 'firstName lastName');

  if (!admission) {
    return next(new AppError('No admission found with that ID', 404));
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
  
  // Verify staff exists
  const staff = await User.findById(staffId);
  if (!staff || !['admin', 'staff'].includes(staff.role)) {
    return next(new AppError('Invalid staff member', 400));
  }
  
  const admission = await Admission.findByIdAndUpdate(
    req.params.id,
    { assignedTo: staffId },
    { new: true, runValidators: true }
  ).populate('assignedTo', 'firstName lastName email');

  if (!admission) {
    return next(new AppError('No admission found with that ID', 404));
  }

  // Notify assigned staff via Socket.IO
  const io = req.app.get('io');
  if (io) {
    io.to(staffId).emit('admissionAssigned', admission);
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
  
  const note = {
    content,
    createdBy: req.user.id
  };
  
  const admission = await Admission.findByIdAndUpdate(
    req.params.id,
    { $push: { notes: note } },
    { new: true, runValidators: true }
  ).populate('notes.createdBy', 'firstName lastName');

  if (!admission) {
    return next(new AppError('No admission found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      admission
    }
  });
});


export const deleteAdmission = catchAsync(async (req, res, next) => {
  const admission = await Admission.findByIdAndDelete(req.params.id);
  
  if (!admission) {
    return next(new AppError('No admission found with that ID', 404));
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