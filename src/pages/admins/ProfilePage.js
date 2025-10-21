import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Chip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import {
  Person as PersonIcon,
  CameraAlt as CameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@school.edu',
    phone: '+1234567890',
    bio: 'School administrator with 10+ years of experience in educational management.',
    department: 'Administration',
    position: 'Principal'
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    language: 'english',
    timezone: 'UTC',
    theme: 'light'
  });
  
  // Activity history
  const [activityHistory] = useState([
    { id: 1, action: 'Profile updated', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: 2, action: 'Password changed', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: 3, action: 'Login from new device', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { id: 4, action: 'Profile picture updated', timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) }
  ]);

  useEffect(() => {
    // Simulate loading profile data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    }, 1500);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'Passwords do not match!',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setPasswordDialogOpen(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSnackbar({
        open: true,
        message: 'Password changed successfully!',
        severity: 'success'
      });
    }, 1500);
  };

  const handleSettingsUpdate = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Settings updated successfully!',
        severity: 'success'
      });
    }, 1500);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && tabValue === 0) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#e8f5e9',
        flexDirection: 'column',
        gap: 3
      }}>
        <Box sx={{ position: 'relative', width: 100, height: 100 }}>
          <CircularProgress
            variant="indeterminate"
            size={100}
            thickness={4}
            sx={{
              color: '#1b5e20',
              position: 'absolute',
              animationDuration: '2.5s'
            }}
          />
          <CircularProgress
            variant="indeterminate"
            size={70}
            thickness={4}
            sx={{
              color: '#2e7d32',
              position: 'absolute',
              top: 15,
              left: 15,
              animationDuration: '2s'
            }}
          />
          <CircularProgress
            variant="indeterminate"
            size={40}
            thickness={4}
            sx={{
              color: '#4caf50',
              position: 'absolute',
              top: 30,
              left: 30,
              animationDuration: '1.5s'
            }}
          />
        </Box>
        <Typography sx={{ color: '#2e7d32', fontSize: '1.2rem', fontWeight: 500 }}>
          Loading Messages...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      backgroundColor: '#e8f5e9', 
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)'
    }}>
      <Fade in={true} timeout={500}>
        <Box>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: '#1b5e20',
              textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            My Profile
          </Typography>
          
          <Paper 
            sx={{ 
              mb: 3, 
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ 
                '& .MuiTab-root': {
                  color: '#2e7d32',
                  '&.Mui-selected': {
                    color: '#1b5e20',
                    fontWeight: 600
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#2e7d32'
                }
              }}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Personal Information" icon={<PersonIcon />} iconPosition="start" />
              <Tab label="Security" icon={<SecurityIcon />} iconPosition="start" />
              <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
              <Tab label="Activity History" icon={<HistoryIcon />} iconPosition="start" />
            </Tabs>
          </Paper>

          <Grid container spacing={3}>
            {/* Left Column - Profile Picture */}
            <Grid item xs={12} md={4}>
              <Zoom in={true} timeout={500}>
                <Paper sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar 
                      src={imagePreview || ''} 
                      sx={{ 
                        width: 150, 
                        height: 150, 
                        mx: 'auto', 
                        mb: 2,
                        border: '4px solid #2e7d32',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }} 
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 15,
                        right: 15,
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#1b5e20'
                        }
                      }}
                      component="label"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageUpload}
                      />
                      <CameraIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                    {profileForm.firstName} {profileForm.lastName}
                  </Typography>
                  <Typography variant="body1" color="#2e7d32" gutterBottom>
                    {profileForm.position}
                  </Typography>
                  <Typography variant="body2" color="#4caf50" gutterBottom>
                    {profileForm.department}
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: 'rgba(46, 125, 50, 0.2)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Chip 
                      label="Active" 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#c8e6c9', 
                        color: '#1b5e20',
                        fontWeight: 500
                      }} 
                    />
                    <Chip 
                      label="Verified" 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#bbdefb', 
                        color: '#0d47a1',
                        fontWeight: 500
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="#4caf50" sx={{ fontStyle: 'italic' }}>
                    "{profileForm.bio}"
                  </Typography>
                </Paper>
              </Zoom>
            </Grid>

            {/* Right Column - Tab Content */}
            <Grid item xs={12} md={8}>
              <Slide direction="up" in={true} timeout={500}>
                <Paper sx={{ 
                  p: 3,
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                  minHeight: 500
                }}>
                  {/* Personal Information Tab */}
                  {tabValue === 0 && (
                    <Fade in={tabValue === 0} timeout={500}>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                          Personal Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField 
                              fullWidth 
                              label="First Name" 
                              variant="outlined"
                              name="firstName"
                              value={profileForm.firstName}
                              onChange={handleProfileFormChange}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2e7d32'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2e7d32'
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField 
                              fullWidth 
                              label="Last Name" 
                              variant="outlined"
                              name="lastName"
                              value={profileForm.lastName}
                              onChange={handleProfileFormChange}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2e7d32'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2e7d32'
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField 
                              fullWidth 
                              label="Email" 
                              variant="outlined"
                              name="email"
                              value={profileForm.email}
                              onChange={handleProfileFormChange}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon sx={{ color: '#2e7d32' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2e7d32'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2e7d32'
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField 
                              fullWidth 
                              label="Phone" 
                              variant="outlined"
                              name="phone"
                              value={profileForm.phone}
                              onChange={handleProfileFormChange}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon sx={{ color: '#2e7d32' }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2e7d32'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2e7d32'
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField 
                              fullWidth 
                              label="Department" 
                              variant="outlined"
                              name="department"
                              value={profileForm.department}
                              onChange={handleProfileFormChange}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2e7d32'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2e7d32'
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField 
                              fullWidth 
                              label="Position" 
                              variant="outlined"
                              name="position"
                              value={profileForm.position}
                              onChange={handleProfileFormChange}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2e7d32'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2e7d32'
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField 
                              fullWidth 
                              label="Bio" 
                              variant="outlined"
                              name="bio"
                              value={profileForm.bio}
                              onChange={handleProfileFormChange}
                              multiline
                              rows={3}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  '&:hover fieldset': {
                                    borderColor: '#2e7d32'
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: '#2e7d32'
                                  }
                                }
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                              <Button 
                                variant="outlined" 
                                startIcon={<CancelIcon />}
                                sx={{
                                  borderColor: '#2e7d32',
                                  color: '#2e7d32',
                                  '&:hover': {
                                    backgroundColor: 'rgba(46, 125, 50, 0.1)'
                                  }
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="contained" 
                                color="primary"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                onClick={handleProfileUpdate}
                                disabled={loading}
                                sx={{
                                  bgcolor: '#2e7d32',
                                  '&:hover': { bgcolor: '#1b5e20' }
                                }}
                              >
                                Update Profile
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Fade>
                  )}

                  {/* Security Tab */}
                  {tabValue === 1 && (
                    <Fade in={tabValue === 1} timeout={500}>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                          Security Settings
                        </Typography>
                        <Card sx={{ mb: 3, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                                  Password
                                </Typography>
                                <Typography variant="body2" color="#4caf50">
                                  Last changed 5 days ago
                                </Typography>
                              </Box>
                              <Button 
                                variant="outlined"
                                startIcon={<LockIcon />}
                                onClick={() => setPasswordDialogOpen(true)}
                                sx={{
                                  borderColor: '#2e7d32',
                                  color: '#2e7d32',
                                  '&:hover': {
                                    backgroundColor: 'rgba(46, 125, 50, 0.1)'
                                  }
                                }}
                              >
                                Change Password
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                        
                        <Card sx={{ mb: 3, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1b5e20' }}>
                                  Two-Factor Authentication
                                </Typography>
                                <Typography variant="body2" color="#4caf50">
                                  Add an extra layer of security to your account
                                </Typography>
                              </Box>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={settings.twoFactorAuth}
                                    onChange={handleSettingsChange}
                                    name="twoFactorAuth"
                                    color="primary"
                                    sx={{
                                      '& .MuiSwitch-switchBase.Mui-checked': {
                                        color: '#2e7d32',
                                      },
                                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: '#2e7d32',
                                      }
                                    }}
                                  />
                                }
                                label=""
                              />
                            </Box>
                          </CardContent>
                        </Card>
                        
                        <Card sx={{ backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1b5e20', mb: 2 }}>
                              Active Sessions
                            </Typography>
                            <List>
                              <ListItem sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 2, mb: 1 }}>
                                <ListItemIcon>
                                  <PersonIcon sx={{ color: '#2e7d32' }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Current Session"
                                  secondary="Chrome on Windows • IP: 192.168.1.1"
                                />
                                <Chip label="Current" size="small" sx={{ backgroundColor: '#c8e6c9', color: '#1b5e20' }} />
                              </ListItem>
                              <ListItem sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 2 }}>
                                <ListItemIcon>
                                  <PersonIcon sx={{ color: '#2e7d32' }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Mobile Device"
                                  secondary="Safari on iPhone • IP: 192.168.1.2"
                                />
                                <Button size="small" sx={{ color: '#d32f2f' }}>Revoke</Button>
                              </ListItem>
                            </List>
                          </CardContent>
                        </Card>
                      </Box>
                    </Fade>
                  )}

                  {/* Settings Tab */}
                  {tabValue === 2 && (
                    <Fade in={tabValue === 2} timeout={500}>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                          Account Settings
                        </Typography>
                        
                        <Card sx={{ mb: 3, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1b5e20', mb: 2 }}>
                              Notifications
                            </Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={settings.emailNotifications}
                                  onChange={handleSettingsChange}
                                  name="emailNotifications"
                                  color="primary"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#2e7d32',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#2e7d32',
                                    }
                                  }}
                                />
                              }
                              label="Email Notifications"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={settings.smsNotifications}
                                  onChange={handleSettingsChange}
                                  name="smsNotifications"
                                  color="primary"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#2e7d32',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#2e7d32',
                                    }
                                  }}
                                />
                              }
                              label="SMS Notifications"
                            />
                          </CardContent>
                        </Card>
                        
                        <Card sx={{ mb: 3, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1b5e20', mb: 2 }}>
                              Preferences
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                  <InputLabel id="language-label">Language</InputLabel>
                                  <Select
                                    labelId="language-label"
                                    id="language"
                                    name="language"
                                    value={settings.language}
                                    onChange={handleSettingsChange}
                                    label="Language"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                          borderColor: '#2e7d32'
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#2e7d32'
                                        }
                                      }
                                    }}
                                  >
                                    <MenuItem value="english">English</MenuItem>
                                    <MenuItem value="spanish">Spanish</MenuItem>
                                    <MenuItem value="french">French</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                  <InputLabel id="timezone-label">Timezone</InputLabel>
                                  <Select
                                    labelId="timezone-label"
                                    id="timezone"
                                    name="timezone"
                                    value={settings.timezone}
                                    onChange={handleSettingsChange}
                                    label="Timezone"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                          borderColor: '#2e7d32'
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#2e7d32'
                                        }
                                      }
                                    }}
                                  >
                                    <MenuItem value="UTC">UTC</MenuItem>
                                    <MenuItem value="EST">EST</MenuItem>
                                    <MenuItem value="PST">PST</MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            variant="contained" 
                            color="primary"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSettingsUpdate}
                            disabled={loading}
                            sx={{
                              bgcolor: '#2e7d32',
                              '&:hover': { bgcolor: '#1b5e20' }
                            }}
                          >
                            Save Settings
                          </Button>
                        </Box>
                      </Box>
                    </Fade>
                  )}

                  {/* Activity History Tab */}
                  {tabValue === 3 && (
                    <Fade in={tabValue === 3} timeout={500}>
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                          Activity History
                        </Typography>
                        <List>
                          {activityHistory.map((activity, index) => (
                            <Slide key={activity.id} direction="up" in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                              <ListItem sx={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 2, mb: 1 }}>
                                <ListItemIcon>
                                  <HistoryIcon sx={{ color: '#2e7d32' }} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={activity.action}
                                  secondary={formatTime(activity.timestamp)}
                                />
                                <CheckCircleIcon sx={{ color: '#4caf50' }} />
                              </ListItem>
                            </Slide>
                          ))}
                        </List>
                      </Box>
                    </Fade>
                  )}
                </Paper>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'rgba(46, 125, 50, 0.2)', 
          pb: 2,
          backgroundColor: 'rgba(46, 125, 50, 0.05)'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1b5e20' }}>
            Change Password
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Current Password"
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordFormChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#2e7d32'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2e7d32'
                }
              }
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordFormChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: '#2e7d32' }}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#2e7d32'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2e7d32'
                }
              }
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordFormChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    sx={{ color: '#2e7d32' }}
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#2e7d32'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2e7d32'
                }
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'rgba(46, 125, 50, 0.2)' }}>
          <Button 
            onClick={() => setPasswordDialogOpen(false)}
            sx={{
              color: '#2e7d32'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordChange}
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' }
            }}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Slide}
        transitionDuration={300}
      >
        <Alert 
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            backgroundColor: snackbar.severity === 'success' ? '#2e7d32' : undefined
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;