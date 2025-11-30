// src/api/api.js
import axios from 'axios';

// Create an Axios instance with a base URL.
// This way, you don't have to write the full URL for every API call.
// The `||` fallback ensures it works even if the environment variable isn't set.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://lts-backend-qg6a.onrender.com/api',
  withCredentials: true // Important for sending cookies with requests if your backend uses them
});

// Request Interceptor: This runs BEFORE every request is sent.
api.interceptors.request.use((config) => {
  // Get the authentication token from localStorage
  const token = localStorage.getItem('token');
  
  // If a token exists, attach it to the Authorization header.
  // The backend will use this to verify the user's identity.
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response Interceptor: This runs AFTER a response is received.
api.interceptors.response.use(
  // If the response is successful (status 2xx), just pass it through.
  (response) => response,
  
  // If there's an error, handle it here.
  (error) => {
    // Check if the error is a 401 Unauthorized.
    // This usually means the token is expired, invalid, or the user is not logged in.
    if (error.response?.status === 401) {
      // Remove the invalid token from localStorage
      localStorage.removeItem('token');
      
      // Redirect the user to the login page.
      // This prevents them from accessing protected parts of the app.
      window.location.href = '/login';
    }
    
    // Propagate the error so the individual component can handle it (e.g., show an error message).
    return Promise.reject(error);
  }
);

export default api;