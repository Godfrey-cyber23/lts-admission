import Admission from '../models/Admission.js';
import User from '../models/User.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

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
  // Add validation for required fields
  if (!req.body.childInfo || !req.body.parentInfo) {
    return next(new AppError('Missing required form data', 400));
  }

  const files = req.files;
  const documents = {};
  let uploadedFiles = [];

  try {
    // Process files
    if (!files?.passportPhoto) {
      throw new AppError('Passport photo is required', 400);
    }

    // Process passport photo
    const passportResult = await uploadToCloudinary(
      files.passportPhoto[0],
      'literacy-tree/passport-photos'
    );
    documents.passportPhoto = {
      url: passportResult.secure_url,
      public_id: passportResult.public_id
    };
    uploadedFiles.push(passportResult.public_id);

    // Process under five card if exists
    if (files?.underFiveCard) {
      const underFiveResult = await uploadToCloudinary(
        files.underFiveCard[0],
        'literacy-tree/under-five-cards'
      );
      documents.underFiveCard = {
        url: underFiveResult.secure_url,
        public_id: underFiveResult.public_id
      };
      uploadedFiles.push(underFiveResult.public_id);
    }

    // Create admission
    const newAdmission = await Admission.create({
      ...req.body,
      documents
    });

    res.status(201).json({
      status: 'success',
      data: {
        admission: newAdmission
      }
    });

  } catch (error) {
    // Cleanup uploaded files if error occurs
    if (uploadedFiles.length > 0) {
      await Promise.all(
        uploadedFiles.map(publicId => 
          deleteFromCloudinary(publicId).catch(cleanupError => 
            console.error('Cleanup error:', cleanupError)
          )
        )
      );
    }
    next(error);
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