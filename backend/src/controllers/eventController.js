import Event from '../models/Event.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import APIFeatures from '../utils/apiFeatures.js';

export const getAllEvents = catchAsync(async (req, res, next) => {
  const now = new Date();
  const filter = req.query.upcoming 
    ? { startDate: { $gte: now } } 
    : {};
  
  const features = new APIFeatures(Event.find(filter), req.query)
    .filter()
    .sort('startDate')
    .limitFields()
    .paginate();
  
  const events = await features.query;

  res.status(200).json({
    status: 'success',
    results: events.length,
    data: {
      events
    }
  });
});

export const createEvent = catchAsync(async (req, res, next) => {
  const newEvent = await Event.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      event: newEvent
    }
  });
});

export const updateEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      event
    }
  });
});

export const deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError('No event found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});