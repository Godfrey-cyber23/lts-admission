import Faq from '../models/Faq.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllFaqs = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Faq.find(), req.query)
    .filter()
    .sort('category order')
    .limitFields()
    .paginate();
  
  const faqs = await features.query;

  res.status(200).json({
    status: 'success',
    results: faqs.length,
    data: {
      faqs
    }
  });
});

export const getFaqsByCategory = catchAsync(async (req, res, next) => {
  const faqs = await Faq.find({ 
    category: req.params.category 
  }).sort('order');

  res.status(200).json({
    status: 'success',
    results: faqs.length,
    data: {
      faqs
    }
  });
});

export const createFaq = catchAsync(async (req, res, next) => {
  const newFaq = await Faq.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      faq: newFaq
    }
  });
});

export const updateFaq = catchAsync(async (req, res, next) => {
  const faq = await Faq.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!faq) {
    return next(new AppError('No FAQ found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      faq
    }
  });
});

export const deleteFaq = catchAsync(async (req, res, next) => {
  const faq = await Faq.findByIdAndDelete(req.params.id);

  if (!faq) {
    return next(new AppError('No FAQ found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});