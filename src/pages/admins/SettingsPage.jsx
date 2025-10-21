import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Fade,
  Zoom,
  Slide,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  alpha,
  CircularProgress,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Save as SaveIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';

const SettingsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoAssign: true,
    maintenanceMode: false,
    darkMode: false,
    twoFactorAuth: false,
    autoBackup: true,
    analytics: true,
    language: 'en',
    sessionTimeout: 30,
    maxFileSize: 10,
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [saveStatus, setSaveStatus] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    security: true,
    appearance: true,
    system: true
  });
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [animatingItems, setAnimatingItems] = useState(new Set());

  // Sample settings categories
  const settingsCategories = [
    {
      id: 'general',
      name: 'General',
      icon: <SettingsIcon />,
      color: '#2e7d32',
      settings: [
        { key: 'emailNotifications', label: 'Email notifications for new admissions', category: 'general', description: 'Receive email alerts when new admission applications are submitted' },
        { key: 'autoAssign', label: 'Auto-assign admissions to staff', category: 'general', description: 'Automatically assign new admissions to available staff members' },
        { key: 'analytics', label: 'Enable analytics tracking', category: 'general', description: 'Collect usage data to improve system performance' }
      ]
    },
    {
      id: 'security',
      name: 'Security',
      icon: <SecurityIcon />,
      color: '#1565c0',
      settings: [
        { key: 'maintenanceMode', label: 'Maintenance mode', category: 'security', description: 'Temporarily disable user access for system maintenance' },
        { key: 'twoFactorAuth', label: 'Two-factor authentication', category: 'security', description: 'Require additional verification for admin accounts' },
        { key: 'autoBackup', label: 'Automatic backups', category: 'security', description: 'Create daily backups of system data' }
      ]
    },
    {
      id: 'appearance',
      name: 'Appearance',
      icon: <PaletteIcon />,
      color: '#00897b',
      settings: [
        { key: 'darkMode', label: 'Dark mode', category: 'appearance', description: 'Use dark theme for the interface' }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced',
      icon: <StorageIcon />,
      color: '#6a1b9a',
      settings: [
        { key: 'sessionTimeout', label: 'Session timeout (minutes)', category: 'advanced', type: 'number', description: 'Automatically log out users after period of inactivity' },
        { key: 'maxFileSize', label: 'Maximum file size (MB)', category: 'advanced', type: 'number', description: 'Limit the size of uploaded files' },
        { key: 'dateFormat', label: 'Date format', category: 'advanced', type: 'select', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], description: 'Preferred date display format' },
        { key: 'timezone', label: 'Timezone', category: 'advanced', type: 'select', options: ['UTC', 'EST', 'PST', 'GMT'], description: 'System timezone for scheduling' }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading settings from server
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSettingChange = (key) => (event) => {
    // Add animation
    setAnimatingItems(prev => new Set(prev).add(key));
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 500);
    
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Settings saved successfully!',
        severity: 'success'
      });
      
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1500);
  };

  const handleResetSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSettings({
        emailNotifications: true,
        autoAssign: true,
        maintenanceMode: false,
        darkMode: false,
        twoFactorAuth: false,
        autoBackup: true,
        analytics: true,
        language: 'en',
        sessionTimeout: 30,
        maxFileSize: 10,
        dateFormat: 'MM/DD/YYYY',
        timezone: 'UTC'
      });
      setLoading(false);
      setResetDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Settings reset to default values!',
        severity: 'info'
      });
    }, 1500);
  };

  const handleExportSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setExportDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Settings exported successfully!',
        severity: 'success'
      });
    }, 1500);
  };

  const handleClearCache = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Cache cleared successfully!',
        severity: 'success'
      });
    }, 1000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter settings based on search and category
  const filteredSettings = useMemo(() => {
    return settingsCategories.map(category => ({
      ...category,
      settings: category.settings.filter(setting => 
        (filterCategory === 'all' || setting.category === filterCategory) &&
        setting.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.settings.length > 0);
  }, [searchTerm, filterCategory]);

  const getStatusChip = () => {
    switch (saveStatus) {
      case 'saving':
        return <Chip icon={<CircularProgress size={16} color="inherit" />} label="Saving..." color="warning" size="small" />;
      case 'success':
        return <Chip icon={<CheckCircleIcon />} label="Saved!" color="success" size="small" />;
      default:
        return null;
    }
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
          Loading Settings...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
      }}>
        {/* Header with Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: '#1b5e20',
              textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
            }}>
              System Settings
            </Typography>
            {getStatusChip()}
          </Box>

          {/* Tabs */}
          <Paper sx={{ 
            mb: 3, 
            borderRadius: '12px',
            background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
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
              <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
              <Tab label="System Info" icon={<StorageIcon />} iconPosition="start" />
              <Tab label="Backup & Restore" icon={<CloudUploadIcon />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Search and Filter Bar - Only show on Settings tab */}
          {tabValue === 0 && (
            <Slide in={tabValue === 0} direction="down" timeout={500}>
              <Paper sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: '12px',
                background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search settings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="#2e7d32" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.2)'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ borderRadius: '8px' }}>
                      <InputLabel>Filter by Category</InputLabel>
                      <Select
                        value={filterCategory}
                        label="Filter by Category"
                        onChange={(e) => setFilterCategory(e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <FilterIcon color="#2e7d32" />
                          </InputAdornment>
                        }
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
                        <MenuItem value="all">All Categories</MenuItem>
                        <MenuItem value="general">General</MenuItem>
                        <MenuItem value="security">Security</MenuItem>
                        <MenuItem value="appearance">Appearance</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Slide>
          )}
        </Box>

        {/* Tab Content */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {/* Settings Panel */}
            <Grid item xs={12} md={8}>
              {filteredSettings.map((category, index) => (
                <Zoom in timeout={500 + index * 100} key={category.id}>
                  <Card sx={{ 
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    mb: 2,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-3px)'
                    }
                  }}>
                    <Accordion 
                      expanded={expandedSections[category.id]}
                      onChange={() => toggleSection(category.id)}
                      sx={{
                        '&.Mui-expanded': {
                          margin: 0,
                          '&:before': {
                            display: 'none'
                          }
                        },
                        '&:before': {
                          display: 'none'
                        },
                        boxShadow: 'none'
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMoreIcon sx={{ color: category.color }} />}
                        sx={{
                          backgroundColor: alpha(category.color, 0.05),
                          '&:hover': {
                            backgroundColor: alpha(category.color, 0.1)
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            mr: 2, 
                            bgcolor: category.color, 
                            width: 36, 
                            height: 36,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}>
                            {category.icon}
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: category.color }}>
                            {category.name}
                          </Typography>
                          <Badge 
                            badgeContent={category.settings.length} 
                            color="primary" 
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ p: 0 }}>
                        <Box sx={{ p: 2 }}>
                          {category.settings.map((setting, settingIndex) => (
                            <Slide in direction="up" timeout={300 + settingIndex * 50} key={setting.key}>
                              <Box sx={{ mb: 2 }}>
                                {setting.type === 'checkbox' ? (
                                  <FormGroup>
                                    <FormControlLabel
                                      control={
                                        <Tooltip title={`Toggle ${setting.label}`} arrow>
                                          <Switch
                                            checked={settings[setting.key]}
                                            onChange={handleSettingChange(setting.key)}
                                            color="primary"
                                            sx={{
                                              '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#2e7d32',
                                              },
                                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#2e7d32',
                                              },
                                              transform: animatingItems.has(setting.key) ? 'scale(1.2)' : 'scale(1)',
                                              transition: 'transform 0.3s ease'
                                            }}
                                          />
                                        </Tooltip>
                                      }
                                      label={
                                        <Box>
                                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#1b5e20' }}>
                                            {setting.label}
                                          </Typography>
                                          <Typography variant="body2" color="#4caf50">
                                            {setting.description}
                                          </Typography>
                                        </Box>
                                      }
                                      sx={{
                                        p: 1,
                                        borderRadius: '8px',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                          backgroundColor: alpha('#2e7d32', 0.04)
                                        }
                                      }}
                                    />
                                  </FormGroup>
                                ) : setting.type === 'number' ? (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1b5e20', mb: 1 }}>
                                      {setting.label}
                                    </Typography>
                                    <Typography variant="body2" color="#4caf50" sx={{ mb: 1 }}>
                                      {setting.description}
                                    </Typography>
                                    <TextField
                                      fullWidth
                                      type="number"
                                      value={settings[setting.key]}
                                      onChange={handleSettingChange(setting.key)}
                                      InputProps={{
                                        endAdornment: setting.key === 'sessionTimeout' ? 'minutes' : 'MB'
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
                                  </Box>
                                ) : setting.type === 'select' ? (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: '#1b5e20', mb: 1 }}>
                                      {setting.label}
                                    </Typography>
                                    <Typography variant="body2" color="#4caf50" sx={{ mb: 1 }}>
                                      {setting.description}
                                    </Typography>
                                    <FormControl fullWidth>
                                      <Select
                                        value={settings[setting.key]}
                                        onChange={handleSettingChange(setting.key)}
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
                                        {setting.options.map(option => (
                                          <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Box>
                                ) : null}
                              </Box>
                            </Slide>
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                </Zoom>
              ))}

              {/* Save Button */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Save all settings">
                  <Button 
                    variant="contained" 
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
                    onClick={handleSaveSettings}
                    disabled={loading}
                    sx={{
                      borderRadius: '8px',
                      px: 4,
                      py: 1,
                      fontSize: '1rem',
                      background: 'linear-gradient(45deg, #2e7d32, #43a047)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.4)',
                        background: 'linear-gradient(45deg, #1b5e20, #2e7d32)'
                      }
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </Button>
                </Tooltip>
              </Box>
            </Grid>

            {/* System Information Panel */}
            <Grid item xs={12} md={4}>
              <Slide in timeout={800} direction="left">
                <Card sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                  position: 'sticky',
                  top: 20,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-3px)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', color: '#1b5e20' }}>
                      <StorageIcon sx={{ mr: 1 }} />
                      System Information
                    </Typography>
                    
                    <List dense>
                      <ListItem sx={{ 
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha('#2e7d32', 0.04),
                          borderRadius: 1
                        }
                      }}>
                        <ListItemIcon>
                          <LanguageIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Version" 
                          secondary="1.0.0" 
                          primaryTypographyProps={{ color: '#1b5e20', fontWeight: 500 }}
                        />
                      </ListItem>
                      <ListItem sx={{ 
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha('#2e7d32', 0.04),
                          borderRadius: 1
                        }
                      }}>
                        <ListItemIcon>
                          <NotificationsIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Last Updated" 
                          secondary={new Date().toLocaleDateString()} 
                          primaryTypographyProps={{ color: '#1b5e20', fontWeight: 500 }}
                        />
                      </ListItem>
                      <ListItem sx={{ 
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha('#2e7d32', 0.04),
                          borderRadius: 1
                        }
                      }}>
                        <ListItemIcon>
                          <SecurityIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Status" 
                          secondary={
                            <Chip 
                              label="All Systems Operational" 
                              color="success" 
                              size="small" 
                              variant="outlined"
                            />
                          } 
                          primaryTypographyProps={{ color: '#1b5e20', fontWeight: 500 }}
                        />
                      </ListItem>
                    </List>

                    <Divider sx={{ my: 2, borderColor: 'rgba(46, 125, 50, 0.2)' }} />

                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                      Quick Actions
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<RefreshIcon />}
                        onClick={handleClearCache}
                        disabled={loading}
                        sx={{
                          borderColor: '#2e7d32',
                          color: '#2e7d32',
                          '&:hover': {
                            backgroundColor: alpha('#2e7d32', 0.04),
                            borderColor: '#1b5e20'
                          }
                        }}
                      >
                        Clear Cache
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<CloudDownloadIcon />}
                        onClick={() => setExportDialogOpen(true)}
                        disabled={loading}
                        sx={{
                          borderColor: '#2e7d32',
                          color: '#2e7d32',
                          '&:hover': {
                            backgroundColor: alpha('#2e7d32', 0.04),
                            borderColor: '#1b5e20'
                          }
                        }}
                      >
                        Export Settings
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<RestoreIcon />}
                        onClick={() => setResetDialogOpen(true)}
                        disabled={loading}
                        sx={{
                          borderColor: '#d32f2f',
                          color: '#d32f2f',
                          '&:hover': {
                            backgroundColor: alpha('#d32f2f', 0.04),
                            borderColor: '#b71c1c'
                          }
                        }}
                      >
                        Reset to Default
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          </Grid>
        )}

        {/* System Info Tab */}
        {tabValue === 1 && (
          <Fade in timeout={500}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                  p: 3
                }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                    System Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                          Application Details
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="Application Name" secondary="School Management System" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Version" secondary="1.0.0" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Build Date" secondary="2023-10-15" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="License" secondary="MIT License" />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                          Server Information
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="Server" secondary="Apache/2.4.41" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="PHP Version" secondary="8.0.12" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Database" secondary="MySQL 8.0" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Operating System" secondary="Linux Ubuntu 20.04" />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                          Storage Information
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            Disk Usage: 45.2 GB / 100 GB
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={45.2} 
                            sx={{ 
                              height: 10, 
                              borderRadius: 5,
                              backgroundColor: 'rgba(46, 125, 50, 0.2)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#2e7d32'
                              }
                            }} 
                          />
                        </Box>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="Database Size" secondary="2.3 GB" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="File Storage" secondary="42.9 GB" />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                          Performance Metrics
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText primary="Average Response Time" secondary="120ms" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Uptime" secondary="99.9%" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="Active Users" secondary="245" />
                          </ListItem>
                          <ListItem>
                            <ListItemText primary="CPU Usage" secondary="32%" />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Fade>
        )}

        {/* Backup & Restore Tab */}
        {tabValue === 2 && (
          <Fade in timeout={500}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                  p: 3,
                  height: '100%'
                }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                    Backup
                  </Typography>
                  <Typography variant="body2" color="#4caf50" sx={{ mb: 3 }}>
                    Create backups of your system data to prevent data loss.
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                      Backup Options
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Include database"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked />}
                        label="Include uploaded files"
                      />
                      <FormControlLabel
                        control={<Switch />}
                        label="Include system settings"
                      />
                    </FormGroup>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                      Schedule
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Frequency</InputLabel>
                      <Select
                        defaultValue="daily"
                        label="Frequency"
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
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="weekly">Weekly</MenuItem>
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="manual">Manual Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderRadius: '8px',
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2e7d32, #43a047)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1b5e20, #2e7d32)'
                      }
                    }}
                  >
                    Create Backup Now
                  </Button>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                  p: 3,
                  height: '100%'
                }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1b5e20' }}>
                    Restore
                  </Typography>
                  <Typography variant="body2" color="#4caf50" sx={{ mb: 3 }}>
                    Restore your system from a previous backup.
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32' }}>
                      Recent Backups
                    </Typography>
                    <List>
                      <ListItem sx={{ 
                        border: '1px solid rgba(46, 125, 50, 0.2)', 
                        borderRadius: 2, 
                        mb: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha('#2e7d32', 0.04)
                        }
                      }}>
                        <ListItemIcon>
                          <CloudDownloadIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Full Backup" 
                          secondary="2023-10-15 14:30:00 • 2.3 GB" 
                        />
                        <Button size="small" variant="outlined" sx={{ borderColor: '#2e7d32', color: '#2e7d32' }}>
                          Restore
                        </Button>
                      </ListItem>
                      <ListItem sx={{ 
                        border: '1px solid rgba(46, 125, 50, 0.2)', 
                        borderRadius: 2, 
                        mb: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha('#2e7d32', 0.04)
                        }
                      }}>
                        <ListItemIcon>
                          <CloudDownloadIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Database Only" 
                          secondary="2023-10-14 02:00:00 • 1.8 GB" 
                        />
                        <Button size="small" variant="outlined" sx={{ borderColor: '#2e7d32', color: '#2e7d32' }}>
                          Restore
                        </Button>
                      </ListItem>
                      <ListItem sx={{ 
                        border: '1px solid rgba(46, 125, 50, 0.2)', 
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: alpha('#2e7d32', 0.04)
                        }
                      }}>
                        <ListItemIcon>
                          <CloudDownloadIcon sx={{ color: '#2e7d32' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Settings Only" 
                          secondary="2023-10-10 16:45:00 • 0.2 GB" 
                        />
                        <Button size="small" variant="outlined" sx={{ borderColor: '#2e7d32', color: '#2e7d32' }}>
                          Restore
                        </Button>
                      </ListItem>
                    </List>
                  </Box>
                  
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Restoring from a backup will overwrite current data. This action cannot be undone.
                    </Typography>
                  </Alert>
                  
                  <Button 
                    variant="outlined" 
                    fullWidth
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderRadius: '8px',
                      py: 1.5,
                      borderColor: '#2e7d32',
                      color: '#2e7d32',
                      '&:hover': {
                        backgroundColor: alpha('#2e7d32', 0.04),
                        borderColor: '#1b5e20'
                      }
                    }}
                  >
                    Upload Backup File
                    <input type="file" hidden />
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Fade>
        )}

        {/* Reset Settings Dialog */}
        <Dialog 
          open={resetDialogOpen} 
          onClose={() => setResetDialogOpen(false)}
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
              Reset Settings to Default
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2">
                This action will reset all settings to their default values. This action cannot be undone.
              </Typography>
            </Alert>
            <Typography variant="body1">
              Are you sure you want to continue?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'rgba(46, 125, 50, 0.2)' }}>
            <Button 
              onClick={() => setResetDialogOpen(false)}
              sx={{
                color: '#2e7d32'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleResetSettings}
              variant="contained"
              color="error"
              disabled={loading}
            >
              Reset
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Settings Dialog */}
        <Dialog 
          open={exportDialogOpen} 
          onClose={() => setExportDialogOpen(false)}
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
              Export Settings
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Select the settings you want to export:
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="General Settings"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Security Settings"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Appearance Settings"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Advanced Settings"
              />
            </FormGroup>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'rgba(46, 125, 50, 0.2)' }}>
            <Button 
              onClick={() => setExportDialogOpen(false)}
              sx={{
                color: '#2e7d32'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExportSettings}
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' }
              }}
            >
              Export
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Notification */}
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
    </Fade>
  );
};

export default SettingsPage;