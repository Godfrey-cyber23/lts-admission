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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email.trim() || !formData.staffId.trim()) {
      setError('Both Email and Staff ID are required');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/forgot-password', {
        email: formData.email,
        staffId: formData.staffId,
      });

      setSuccess('If a valid staff account with that email and ID exists, a password reset link has been sent.');
      
      setFormData({ email: '', staffId: '' });

      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (err) {
      setSuccess('If a valid staff account with that email and ID exists, a password reset link has been sent.');
      console.error("Forgot password error:", err.response?.data?.message);
    } finally {
      setLoading(false);
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
            Forgot Password
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
            Enter your email and Staff ID to receive a password reset link.
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
                },
                '& .MuiFormHelperText-root': {
                  fontSize: "0.7rem"
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