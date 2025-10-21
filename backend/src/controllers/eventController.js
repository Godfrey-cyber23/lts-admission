import { supabase } from '../config/db.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// Helper function to handle Supabase errors
const handleSupabaseError = (error, next) => {
  console.error('Supabase Error:', error);
  return next(new AppError(`Database error: ${error.message}`, 500));
};

export const getAllEvents = catchAsync(async (req, res, next) => {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      events: events || []
    }
  });
});

export const getEvent = catchAsync(async (req, res, next) => {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No event found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      event
    }
  });
});

export const createEvent = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    start_date,
    end_date,
    location,
    event_type,
    max_attendees,
    is_public
  } = req.body;

  // Validate required fields
  if (!title || !start_date) {
    return next(new AppError('Title and start date are required', 400));
  }

  const eventData = {
    title,
    description: description || '',
    start_date,
    end_date: end_date || start_date,
    location: location || '',
    event_type: event_type || 'general',
    max_attendees: max_attendees || null,
    is_public: is_public !== undefined ? is_public : true,
    created_by: req.user.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: newEvent, error } = await supabase
    .from('events')
    .insert([eventData])
    .select()
    .single();

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(201).json({
    status: 'success',
    data: {
      event: newEvent
    }
  });
});

export const updateEvent = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    start_date,
    end_date,
    location,
    event_type,
    max_attendees,
    is_public
  } = req.body;

  const updateData = {
    title,
    description,
    start_date,
    end_date,
    location,
    event_type,
    max_attendees,
    is_public,
    updated_at: new Date().toISOString()
  };

  // Remove undefined fields
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  const { data: updatedEvent, error } = await supabase
    .from('events')
    .update(updateData)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No event found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      event: updatedEvent
    }
  });
});

export const deleteEvent = catchAsync(async (req, res, next) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    if (error.code === 'PGRST116') {
      return next(new AppError('No event found with that ID', 404));
    }
    return handleSupabaseError(error, next);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const getUpcomingEvents = catchAsync(async (req, res, next) => {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(10);

  if (error) {
    return handleSupabaseError(error, next);
  }

  res.status(200).json({
    status: 'success',
    data: {
      events: events || []
    }
  });
});

export const getEventStats = catchAsync(async (req, res, next) => {
  // Get total events count
  const { count: totalEvents, error: countError } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    return handleSupabaseError(countError, next);
  }

  // Get upcoming events count
  const { count: upcomingEvents, error: upcomingError } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .gte('start_date', new Date().toISOString());

  if (upcomingError) {
    return handleSupabaseError(upcomingError, next);
  }

  // Get events by type
  const { data: typeData, error: typeError } = await supabase
    .from('events')
    .select('event_type');

  const typeStats = {};
  if (typeData && !typeError) {
    typeData.forEach(event => {
      typeStats[event.event_type] = (typeStats[event.event_type] || 0) + 1;
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      stats: {
        totalEvents: totalEvents || 0,
        upcomingEvents: upcomingEvents || 0,
        byType: typeStats
      }
    }
  });
});

const eventController = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventStats
};

export default eventController;