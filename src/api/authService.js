import api from './api';

// Login with staff ID
export const login = async (email, password, staffId) => {
  try {
    const response = await api.post('/auth/login', { email, password, staffId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Register staff member
export const registerStaff = async (firstName, lastName, email, phone, password, staffId) => {
  try {
    const response = await api.post('/auth/register', {
      firstName,
      lastName,
      email,
      phone,
      password,
      role: 'staff',
      staffId
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Forgot password with staff ID
export const forgotPassword = async (email, staffId) => {
  try {
    const response = await api.post('/auth/forgot-password', { email, staffId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Reset password with staff ID
export const resetPassword = async (token, password, staffId) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password, staffId });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};