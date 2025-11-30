import jwt from 'jsonwebtoken';
import { supabase } from '../config/db.js';
import ErrorResponse from '../utils/errorResponse.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;
  
  console.log('Authorization header:', req.headers.authorization);
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    console.log('No token provided');
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Check for user ID in token (consistent with previous code)
    if (!decoded.id) {
      console.log('No user ID in token');
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    // Be specific about which columns to select to avoid ambiguity
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, firstName, lastName, isActive, staffId')
      .eq('id', decoded.id) // Use decoded.id here
      .single();

    if (error) {
      console.log('Supabase error:', error);
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    if (!user) {
      console.log('User not found');
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    console.log('User found:', user);
    
    req.user = user;
    next();
  } catch (err) {
    console.log('JWT verification error:', err.message);
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

// Check if user is admin or superadmin
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return next(new ErrorResponse('User is not authorized as admin', 403));
  }
  next();
};

// Check if user is staff (admin or staff member)
export const isStaff = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.role !== 'staff') {
    return next(new ErrorResponse('User is not authorized as staff', 403));
  }
  next();
};

// Verify staff ID (for additional security)
export const verifyStaffId = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  // Only staff members and admins need to verify staff ID
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.role !== 'staff') {
    return next();
  }
  
  // Check if staff ID is provided in the request
  if (!req.body.staffId && !req.query.staffId) {
    return next(new ErrorResponse('Staff ID is required', 400));
  }
  
  // Get staff ID from request body or query parameters
  const providedStaffId = req.body.staffId || req.query.staffId;
  
  // Verify staff ID matches the one in the database
  if (req.user.staffId !== providedStaffId) {
    return next(new ErrorResponse('Invalid staff ID', 401));
  }
  
  next();
};