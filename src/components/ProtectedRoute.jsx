import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ProtectedRoute = ({ children, roles = [] }) => { // Accept children prop
  const [authStatus, setAuthStatus] = useState('checking'); 
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setAuthStatus('unauthenticated');
          return;
        }
        
        // Verify token by calling /auth/me endpoint
        const response = await api.get('/auth/me');
        
        if (response.data.success) {
          const user = response.data.user;
          
          // Check if user has required role
          if (roles.length > 0 && !roles.includes(user.role)) {
            setUserRole(user.role);
            setAuthStatus('unauthorized');
            return;
          }
          
          setUserRole(user.role);
          setAuthStatus('authenticated');
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        setAuthStatus('unauthenticated');
      }
    };
    
    verifyAuth();
  }, [roles, location]);

  if (authStatus === 'checking') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  if (authStatus === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authStatus === 'unauthorized') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        p: 3,
        textAlign: 'center'
      }}>
        <Typography variant="h4" gutterBottom color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your account ({userRole}) does not have permission to access this page.
          <br />
          Required roles: {roles.join(', ')}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.history.back()}
          sx={{ mb: 1 }}
        >
          Go Back
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Login with Different Account
        </Button>
      </Box>
    );
  }

  return children; // Return children instead of Outlet
};

export default ProtectedRoute;