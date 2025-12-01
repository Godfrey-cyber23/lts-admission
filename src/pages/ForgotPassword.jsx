// ForgotPassword.jsx - Cleaned up version using API module
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import api from '../api/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Link,
} from '@mui/material';
import {
  Email as EmailIcon,
} from '@mui/icons-material';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    email: '',
    staffId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setPreviewUrl('');

    // Validate inputs
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!formData.staffId.trim()) {
      setError('Staff ID is required');
      setLoading(false);
      return;
    }

    console.log('Forgot password attempt:', {
      email: formData.email,
      staffId: formData.staffId
    });

    try {
      // Use API module instead of direct fetch
      const response = await api.post('/auth/forgot-password', {
        email: formData.email.toLowerCase().trim(),
        staffId: formData.staffId.trim().toUpperCase()
      });

      console.log('Success response:', response.data);

      // Always show success message (for security)
      setSuccess('If an account with that email and staff ID exists, a password reset link has been sent.');
      
      // If there's a preview URL (for Ethereal emails), show it
      if (response.data.previewUrl) {
        setPreviewUrl(response.data.previewUrl);
        setSuccess(prev => prev + ' Click preview link below to view test email.');
      }
      
      // Clear form
      setFormData({ email: '', staffId: '' });

    } catch (err) {
      console.error('Forgot password error:', err);
      
      // Extract error message from API response
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred. Please try again.';
      
      setError(errorMessage);
      
      // If there's a preview URL in error response (for Ethereal emails), show it
      if (err.response?.data?.previewUrl) {
        setPreviewUrl(err.response.data.previewUrl);
      }
      
      // Still show security message
      if (!error) {
        setSuccess('If an account with that email and staff ID exists, a password reset link has been sent. Please check your email inbox and spam folder.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setError('');
      setSuccess('Testing email service...');
      
      // Use API module instead of direct fetch
      const response = await api.post('/auth/test-email', {
        email: formData.email || 'test@example.com'
      });
      
      if (response.data.success) {
        setSuccess(`Test email sent successfully! ${response.data.previewUrl ? 'Check preview link.' : ''}`);
        if (response.data.previewUrl) {
          setPreviewUrl(response.data.previewUrl);
        }
      } else {
        setError(`Test failed: ${response.data.message}`);
      }
    } catch (err) {
      setError(`Test error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDebugConfig = async () => {
    try {
      // Use API module instead of direct fetch
      const response = await api.get('/auth/email-config');
      console.log('Email config:', response.data);
      setSuccess(`Email config: ${JSON.stringify(response.data.config)}`);
    } catch (err) {
      setError(`Config error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        height: "100vh",
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, sm: 3 },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/_MG_4539.JPG)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(20, 20, 60, 0.4)",
          zIndex: -1,
        },
      }}
    >
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        lg={4}
        xl={3}
        component={Paper}
        elevation={6}
        sx={{
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          padding: { xs: 1.5, sm: 2.5 },
          margin: 1,
          maxWidth: "380px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* School Logo */}
          <Box sx={{ mb: 1.5 }}>
            <img
              src="/school-logo.jpg"
              alt="Literacy Tree School Logo"
              style={{ 
                height: isMobile ? "45px" : "55px",
                width: "auto",
                objectFit: "contain"
              }}
            />
          </Box>

          <Typography
            component="h1"
            color="darkgreen"
            variant="h6"
            sx={{ 
              mb: 0.5,
              fontWeight: 600,
              textAlign: "center",
              fontSize: { xs: "1.2rem", sm: "1.4rem" }
            }}
          >
            Reset Your Password
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1.5,
              color: "text.secondary", 
              textAlign: 'center',
              lineHeight: 1.4,
              fontSize: "0.85rem"
            }}
          >
            Enter your email and Staff ID. If your account exists, you'll receive a reset link.
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                width: "100%", 
                mb: 1.5,
                fontSize: "0.75rem",
                py: 0.5
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                width: "100%", 
                mb: 1.5,
                fontSize: "0.75rem",
                py: 0.5
              }}
            >
              {success}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              width: "100%",
            }}
          >
            <TextField
              margin="dense"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  fontSize: "0.85rem"
                },
                '& .MuiInputLabel-root': {
                  fontSize: "0.85rem"
                }
              }}
              size="small"
              helperText="Enter email associated with your staff account"
            />

            <TextField
              margin="dense"
              required
              fullWidth
              id="staffId"
              label="Staff ID"
              name="staffId"
              autoComplete="off"
              value={formData.staffId}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 1.5,
                '& .MuiOutlinedInput-root': {
                  fontSize: "0.85rem"
                },
                '& .MuiInputLabel-root': {
                  fontSize: "0.85rem"
                }
              }}
              helperText="Enter your official staff ID"
              size="small"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mb: 1,
                py: 0.8,
                borderRadius: 1,
                fontWeight: 600,
                fontSize: "0.85rem",
                textTransform: 'none',
                minHeight: '36px',
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: 2,
                },
              }}
            >
              {loading ? <CircularProgress size={18} color="inherit" /> : 'Send Reset Link'}
            </Button>

            <Box sx={{ textAlign: 'center', mb: 0.5 }}>
              <Link 
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                ← Back to Login
              </Link>
            </Box>
          </Box>

          {/* Spacing between form and footer */}
          <Box sx={{ height: 12 }} />

          {/* Footer */}
          <Box sx={{ 
            width: "100%",
            textAlign: "center",
          }}>
            <Typography
              variant="caption"
              sx={{ 
                color: "text.secondary", 
                display: 'block',
                mb: 0.25,
                fontSize: "0.7rem"
              }}
            >
              Literacy Tree School Management System
            </Typography>
            <Typography
              variant="caption"
              sx={{ 
                color: "text.secondary",
                fontSize: "0.7rem"
              }}
            >
              © {new Date().getFullYear()} All rights reserved
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;