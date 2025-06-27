import Inquiry from '../models/Inquiry.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';

export const createInquiry = catchAsync(async (req, res, next) => {
  const newInquiry = await Inquiry.create(req.body);
  
  // Send notification email
  await sendEmail({
    email: process.env.ADMIN_EMAIL,
    subject: 'New Website Inquiry',
    message: `
      You have a new inquiry from the Literacy Tree School website:
      
      Name: ${req.body.name}
      Email: ${req.body.email}
      Phone: ${req.body.phone || 'Not provided'}
      Subject: ${req.body.subject}
      
      Message:
      ${req.body.message}
    `
  });

  res.status(201).json({
    status: 'success',
    data: {
      inquiry: newInquiry
    }
  });
});

export const getAllInquiries = catchAsync(async (req, res, next) => {
  const inquiries = await Inquiry.find()
    .sort('-createdAt')
    .populate('assignedTo', 'firstName lastName');
  
  res.status(200).json({
    status: 'success',
    results: inquiries.length,
    data: {
      inquiries
    }
  });
});

export const updateInquiryStatus = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    return next(new AppError('No inquiry found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      inquiry
    }
  });
});

export const assignInquiry = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { assignedTo: req.body.staffId },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    return next(new AppError('No inquiry found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      inquiry
    }
  });
});

export const addResponse = catchAsync(async (req, res, next) => {
  const { response } = req.body;
  
  if (!response) {
    return next(new AppError('Response content is required', 400));
  }
  
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { 
      response,
      responseDate: Date.now(),
      status: 'resolved'
    },
    { new: true, runValidators: true }
  );

  if (!inquiry) {
    return next(new AppError('No inquiry found with that ID', 404));
  }
  
  // Send response email to the inquirer
  await sendEmail({
    email: inquiry.email,
    subject: `Re: ${inquiry.subject}`,
    message: `
      Dear ${inquiry.name},
      
      Thank you for contacting Literacy Tree School. Here is our response:
      
      ${response}
      
      Best regards,
      The Literacy Tree School Team
    `
  });

  res.status(200).json({
    status: 'success',
    data: {
      inquiry
    }
  });
});