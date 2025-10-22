import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import api from '../api/api';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const ProtectedRoute = ({ roles = [] }) => {
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
        
        // Verify token with backend
        const response = await api.get('/auth/verify');
        
        // Check if user has required role
        if (roles.length > 0 && !roles.includes(response.data.role)) {
          setAuthStatus('unauthorized');
          return;
        }
        
        setUserRole(response.data.role);
        setAuthStatus('authenticated');
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        setAuthStatus('unauthenticated');
      }
    };
    
    verifyAuth();
  }, [roles]);

  if (authStatus === 'checking') {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
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
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Your account ({userRole}) does not have permission to access this page.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;