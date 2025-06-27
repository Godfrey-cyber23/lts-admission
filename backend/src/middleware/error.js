import ErrorResponse from '../utils/errorResponse.js';
import colors from 'colors'; // For colored console output

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Log full error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('\n--- ERROR DETAILS ---'.red);
    console.error('Error:'.yellow, err);
    console.error('Stack:'.yellow, err.stack);
    console.error('Request:'.yellow, {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  // Handle specific error types
  switch (true) {
    // Mongoose bad ObjectId
    case err.name === 'CastError':
      error = new ErrorResponse(`Resource not found with id of ${err.value}`, 404);
      break;

    // Mongoose duplicate key
    case err.code === 11000: {
      const field = Object.keys(err.keyValue)[0];
      const message = `Duplicate field value entered for ${field}. Please use another value`;
      error = new ErrorResponse(message, 400);
      break;
    }

    // Mongoose validation error
    case err.name === 'ValidationError': {
      const messages = Object.values(err.errors).map(val => val.message);
      error = new ErrorResponse(messages.join(', '), 400);
      break;
    }

    // File upload errors
    case err.name === 'MulterError':
      if (err.code === 'LIMIT_FILE_SIZE') {
        error = new ErrorResponse('File size too large. Maximum 5MB allowed', 413);
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        error = new ErrorResponse('Too many files uploaded', 400);
      } else {
        error = new ErrorResponse(err.message, 400);
      }
      break;

    // File type errors
    case err.message && err.message.includes('file type not allowed'):
      error = new ErrorResponse(err.message, 400);
      break;

    // JWT errors
    case err.name === 'JsonWebTokenError':
      error = new ErrorResponse('Not authorized, token failed', 401);
      break;

    case err.name === 'TokenExpiredError':
      error = new ErrorResponse('Session expired, please login again', 401);
      break;

    // Rate limiter errors
    case err.name === 'RateLimitError':
      error = new ErrorResponse('Too many requests, please try again later', 429);
      break;

    // Default case
    default:
      // Handle operational errors (errors we created ourselves)
      if (!err.statusCode) {
        error = new ErrorResponse('Server Error', 500);
      }
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      fullError: err
    })
  });
};

export default errorHandler;