import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Link, 
  Paper, 
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Replace with your actual API call
      await api.post('/auth/forgot-password', { email });
      setSuccess('Password reset link has been sent to your email');

       setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid 
      container 
      component="main" 
      sx={{
        height: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/_MG_4539.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(20, 20, 60, 0.4)',
          zIndex: -1,
        }
      }}
    >
      <Grid 
        item 
        xs={11} 
        sm={8} 
        md={5} 
        lg={4}
        component={Paper} 
        elevation={6} 
        sx={{
          borderRadius: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: { xs: 2, sm: 4 },
          margin: 2,
          maxWidth: '450px'
        }}
      >
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* School Logo */}
          <Box sx={{ mb: 3 }}>
            <img 
              src="/school-logo.jpg" 
              alt="Literacy Tree School Logo" 
              style={{ height: '80px' }}
            />
          </Box>
          
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Reset Your Password
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
            Enter your email address and we'll send you a link to reset your password
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              placeholder="Enter your registered email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 600,
                bgcolor: 'primary.main',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Reset Link'
              )}
            </Button>
            
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Link 
                  href="/login" 
                  variant="body2" 
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Back to Login
                </Link>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                Literacy Tree School Management System
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                © {new Date().getFullYear()} All rights reserved
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;