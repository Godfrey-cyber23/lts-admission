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
    
    // FIX: Use userId instead of id
    if (!decoded.userId) {
      console.log('No user ID in token');
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    // Be specific about which columns to select to avoid ambiguity
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, role, firstName, lastName, isActive')
      .eq('id', decoded.userId) // Use decoded.userId here
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

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return next(new ErrorResponse('User is not authorized as admin', 403));
  }
  next();
};