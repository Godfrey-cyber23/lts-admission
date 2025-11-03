import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider, useTheme as useMuiTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import api from '../api/api';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  CssBaseline,
  Avatar,
  Divider,
  Badge,
  CircularProgress,
  Paper,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  SwipeableDrawer
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Receipt as ReceiptIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Description as AdmissionsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  Assessment as ReportIcon,
  Email as EmailIcon,
  GroupAdd as GroupAddIcon,
  LibraryAdd as LibraryAddIcon,
  Home as HomeIcon,
  Article as PagesIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';

// Create a custom theme with green color palette
const greenTheme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep green
      light: '#4caf50', // Light green
      dark: '#1b5e20', // Dark green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#81c784', // Light secondary green
      light: '#a5d6a7',
      dark: '#66bb6a',
      contrastText: '#000000',
    },
    background: {
      default: '#e8f5e9', // Very light green
      paper: '#f1f8e9', // Light green paper
    },
    success: {
      main: '#4caf50',
    },
    info: {
      main: '#81c784',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, #1b5e20, #2e7d32)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(to bottom, #f1f8e9, #e8f5e9)',
          borderRight: '1px solid #c8e6c9',
          // Hide scrollbar for drawer
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#4caf50',
            color: 'white',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
            '& .MuiListItemIcon-root': {
              color: 'white',
            },
          },
          '&:hover': {
            backgroundColor: '#c8e6c9',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(to bottom right, rgba(200, 230, 201, 0.3), rgba(232, 245, 233, 0.3))',
          // Hide scrollbar for paper
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
        },
      },
    },
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1100,
        },
      },
    },
    // Global scrollbar hiding for all components
    MuiBox: {
      styleOverrides: {
        root: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
        },
      },
    },
  },
});

// Scrollbar hiding styles for the main content
const scrollbarHiddenStyles = {
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '-ms-overflow-style': 'none',
};

const AdminDashboard = () => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md')); 
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications] = useState(3);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [mobileBottomNavValue, setMobileBottomNavValue] = useState(0);

  // Check if we're on any admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Mobile navigation items - simplified for bottom navigation
  const mobileNavItems = [
    { id: 'dashboard', label: 'Home', icon: <HomeIcon /> },
    { id: 'admissions', label: 'Admissions', icon: <AdmissionsIcon /> },
    { id: 'students', label: 'Students', icon: <PeopleIcon /> },
    { id: 'more', label: 'More', icon: <MenuIcon /> }
  ];

  // Dynamic quick actions based on current tab
  const getQuickActions = () => {
    const baseActions = [
      { 
        icon: <PersonAddIcon />, 
        name: 'New Student', 
        action: () => navigate('/admin/students?action=create') 
      },
      { 
        icon: <CalendarIcon />, 
        name: 'Add Event', 
        action: () => navigate('/admin/events?action=create') 
      },
      { 
        icon: <EmailIcon />, 
        name: 'Send Message', 
        action: () => navigate('/admin/messages?action=compose') 
      },
    ];

    // Tab-specific actions
    const tabSpecificActions = {
      students: [
        { 
          icon: <PersonAddIcon />, 
          name: 'Add Student', 
          action: () => navigate('/admin/students?action=create') 
        },
        { 
          icon: <GroupAddIcon />, 
          name: 'Bulk Import', 
          action: () => navigate('/admin/students?action=import') 
        },
      ],
      admissions: [
        { 
          icon: <AdmissionsIcon />, 
          name: 'New Application', 
          action: () => navigate('/admin/admissions?action=create') 
        },
        { 
          icon: <AssessmentIcon />, 
          name: 'Process Applications', 
          action: () => navigate('/admin/admissions?action=process') 
        },
      ],
      staff: [
        { 
          icon: <PersonAddIcon />, 
          name: 'Add Staff', 
          action: () => navigate('/admin/staff?action=create') 
        },
      ],
      academic: [
        { 
          icon: <LibraryAddIcon />, 
          name: 'Add Course', 
          action: () => navigate('/admin/academic?action=create-course') 
        },
        { 
          icon: <SchoolIcon />, 
          name: 'Create Class', 
          action: () => navigate('/admin/academic?action=create-class') 
        },
      ],
      finance: [
        { 
          icon: <PaymentIcon />, 
          name: 'Record Payment', 
          action: () => navigate('/admin/finance?action=payment') 
        },
        { 
          icon: <ReceiptIcon />, 
          name: 'Generate Invoice', 
          action: () => navigate('/admin/finance?action=invoice') 
        },
      ],
      events: [
        { 
          icon: <CalendarIcon />, 
          name: 'New Event', 
          action: () => navigate('/admin/events?action=create') 
        },
      ],
      reports: [
        { 
          icon: <ReportIcon />, 
          name: 'Generate Report', 
          action: () => navigate('/admin/reports?action=generate') 
        },
      ],
      messages: [
        { 
          icon: <EmailIcon />, 
          name: 'Compose Message', 
          action: () => navigate('/admin/messages?action=compose') 
        },
      ],
      pages: [
        { 
          icon: <AddIcon />, 
          name: 'Create Page', 
          action: () => navigate('/admin/pages?action=create') 
        },
        { 
          icon: <EditIcon />, 
          name: 'Edit Page', 
          action: () => navigate('/admin/pages?action=edit') 
        },
        { 
          icon: <ViewIcon />, 
          name: 'View Pages', 
          action: () => navigate('/admin/pages') 
        },
      ],
    };

    const currentTab = activeTab;
    const specificActions = tabSpecificActions[currentTab] || [];
    
    return [...specificActions, ...baseActions].slice(0, isMobile ? 4 : 6); // Limit to 4 actions on mobile
  };

  const quickActions = getQuickActions();

  const handleQuickAction = (action) => {
    setQuickActionsOpen(false);
    action();
  };

  // Logout functions
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setLogoutDialogOpen(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  // Handle mobile bottom navigation
  const handleMobileBottomNavChange = (event, newValue) => {
    setMobileBottomNavValue(newValue);
    
    if (newValue === 3) { // "More" tab
      setMobileOpen(true);
    } else {
      const selectedItem = mobileNavItems[newValue];
      handleTabChange(selectedItem.id);
    }
  };

  // Function to update active tab from URL
  const updateActiveTabFromURL = () => {
    const path = location.pathname;
    console.log('Current path:', path);

    if (path === '/admin' || path === '/admin/' || path.includes('/admin/dashboard')) {
      setActiveTab('dashboard');
      setMobileBottomNavValue(0);
    } else {
      const pathParts = path.split('/');
      const currentTab = pathParts[pathParts.length - 1];
      setActiveTab(currentTab);
      
      // Update mobile bottom nav value
      const navIndex = mobileNavItems.findIndex(item => item.id === currentTab);
      if (navIndex !== -1) {
        setMobileBottomNavValue(navIndex);
      }
    }
  };

  useEffect(() => {
    // Method 1: Hide via CSS if Tawk.to adds specific classes
    const hideTawkToChat = () => {
      // Tawk.to usually adds an iframe with specific attributes
      const tawkToIframe = document.querySelector('iframe[title*="chat"], iframe[src*="tawk"]');
      if (tawkToIframe) {
        tawkToIframe.style.display = 'none';
      }
      
      // Also hide any Tawk.to container elements
      const tawkContainers = document.querySelectorAll('#tawkchat-container, .tawk-button-container, [class*="tawk"], [id*="tawk"]');
      tawkContainers.forEach(element => {
        element.style.display = 'none';
      });
    };

    // Method 2: Remove Tawk.to script and elements
    const removeTawkTo = () => {
      // Remove Tawk.to iframe
      const tawkIframe = document.querySelector('iframe[src*="tawk.to"]');
      if (tawkIframe) {
        tawkIframe.remove();
      }
      
      // Remove Tawk.to container
      const tawkContainer = document.getElementById('tawkchat-container');
      if (tawkContainer) {
        tawkContainer.remove();
      }
      
      // Remove Tawk.to script
      const tawkScript = document.querySelector('script[src*="tawk.to"]');
      if (tawkScript) {
        tawkScript.remove();
      }
    };

    // Try both methods
    hideTawkToChat();
    removeTawkTo();

    // Set up interval to continuously check for Tawk.to elements
    const interval = setInterval(() => {
      hideTawkToChat();
      removeTawkTo();
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Update active tab whenever location changes
    updateActiveTabFromURL();
  }, [location]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/auth/me');
        console.log('User data:', response.data);
        setUser(response.data.user || response.data.data?.user || response.data);

        // Update active tab based on current URL
        updateActiveTabFromURL();
      } catch (error) {
        console.error('Failed to fetch user', error);
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      navigate('/admin/dashboard');
    } else {
      navigate(`/admin/${tab}`);
    }
    if (mobileOpen) setMobileOpen(false);
  };

  // Safe user data access
  const getUserName = () => {
    if (!user) return 'U';
    return user.firstName || user.name || user.email || 'U';
  };

  const getAvatarLetter = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.name || user.email || 'User';
  };

  const drawerWidth = isMobile ? 280 : 240;
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'admissions', label: 'Admissions', icon: <AdmissionsIcon /> },
    { id: 'students', label: 'Students', icon: <PeopleIcon /> },
    { id: 'staff', label: 'Staff', icon: <PeopleIcon /> },
    { id: 'academic', label: 'Academic', icon: <SchoolIcon /> },
    { id: 'finance', label: 'Finance', icon: <ReceiptIcon /> },
    { id: 'events', label: 'Events', icon: <EventIcon /> },
    { id: 'pages', label: 'Pages', icon: <PagesIcon /> }, // Added Pages tab
    { id: 'reports', label: 'Reports', icon: <AssessmentIcon /> },
    { id: 'messages', label: 'Messages', icon: <MessageIcon /> },
    { id: 'profile', label: 'Profile', icon: <PersonIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#e8f5e9',
        flexDirection: 'column',
        gap: 3,
        ...scrollbarHiddenStyles
      }}>
        {/* Animated three-ring loader with different colors */}
        <Box sx={{ position: 'relative', width: 100, height: 100 }}>
          {/* Outer ring - Dark green */}
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
          {/* Middle ring - Medium green */}
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
          {/* Inner ring - Light green */}
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
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={greenTheme}>
      <Box sx={{ 
        display: 'flex', 
        backgroundColor: '#e8f5e9',
        ...scrollbarHiddenStyles 
      }}>
        <CssBaseline />

        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            zIndex: (theme) => theme.zIndex.drawer + 1,
            height: isMobile ? 56 : 64, // Smaller height on mobile
          }}
        >
          <Toolbar sx={{ minHeight: isMobile ? 56 : 64 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              noWrap 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: isMobile ? '1rem' : '1.25rem'
              }}
            >
              {isMobile ? 'Admin Portal' : 'Literacy Tree Admin Portal'}
            </Typography>

            <IconButton color="inherit" size={isMobile ? "small" : "medium"}>
              <Badge badgeContent={notifications} color="error">
                <NotificationsIcon fontSize={isMobile ? "small" : "medium"} />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Avatar
                sx={{
                  width: isMobile ? 32 : 40,
                  height: isMobile ? 32 : 40,
                  bgcolor: 'secondary.main',
                  mr: isMobile ? 0.5 : 1,
                  border: '2px solid #ffffff'
                }}
              >
                {getAvatarLetter()}
              </Avatar>
              <Typography 
                variant={isMobile ? "body2" : "subtitle1"} 
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                {getDisplayName()}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Side Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="admin menu"
        >
          {/* Mobile Drawer - Swipeable */}
          <SwipeableDrawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onOpen={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                ...scrollbarHiddenStyles
              },
            }}
          >
            <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#2e7d32', color: 'white' }}>
              <Box
                component="img"
                src="/school-logo.jpg"
                alt="Literacy Tree School"
                sx={{
                  height: isMobile ? 50 : 60,
                  width: 'auto',
                  maxWidth: '80%',
                  mb: 1,
                  borderRadius: 1,
                  objectFit: 'contain'
                }}
              />
              <Typography variant={isMobile ? "caption" : "subtitle2"} sx={{ opacity: 0.8, mt: 1 }}>
                Admin Portal
              </Typography>
            </Box>
            <Divider />
            <List sx={{ ...scrollbarHiddenStyles, overflow: 'auto' }}>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.id}
                  selected={activeTab === item.id}
                  onClick={() => handleTabChange(item.id)}
                  sx={{
                    py: isMobile ? 1 : 1.5,
                    '&.Mui-selected': {
                      backgroundColor: '#4caf50',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#388e3c',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: isMobile ? '0.875rem' : '1rem'
                    }}
                  />
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem 
                button 
                onClick={handleLogoutClick}
                sx={{
                  py: isMobile ? 1 : 1.5,
                  '&:hover': {
                    backgroundColor: '#ffebee', // Light red background on hover
                    '& .MuiListItemIcon-root': {
                      color: '#d32f2f', // Red icon on hover
                    },
                    '& .MuiListItemText-primary': {
                      color: '#d32f2f', // Red text on hover
                      fontWeight: 600,
                    },
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}
                />
              </ListItem>
            </List>
          </SwipeableDrawer>

          {/* Desktop Drawer - Permanent */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                ...scrollbarHiddenStyles
              },
            }}
            open
          >
            <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#2e7d32', color: 'white' }}>
              <Box
                component="img"
                src="/school-logo.jpg"
                alt="Literacy Tree School"
                sx={{
                  height: 60,
                  width: 'auto',
                  maxWidth: '80%',
                  mb: 1,
                  borderRadius: 1,
                  objectFit: 'contain'
                }}
              />
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mt: 1 }}>
                Admin Portal
              </Typography>
            </Box>
            <Divider />
            <List sx={{ ...scrollbarHiddenStyles, overflow: 'auto' }}>
              {menuItems.map((item) => (
                <ListItem
                  button
                  key={item.id}
                  selected={activeTab === item.id}
                  onClick={() => handleTabChange(item.id)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 'auto', p: 2, ...scrollbarHiddenStyles }}>
              <Divider sx={{ mb: 2 }} />
              <ListItem 
                button 
                onClick={handleLogoutClick}
                sx={{
                  '&:hover': {
                    backgroundColor: '#ffebee', // Light red background on hover
                    '& .MuiListItemIcon-root': {
                      color: '#d32f2f', // Red icon on hover
                    },
                    '& .MuiListItemText-primary': {
                      color: '#d32f2f', // Red text on hover
                      fontWeight: 600,
                    },
                  },
                  transition: 'all 0.2s ease-in-out',
                  borderRadius: 1,
                }}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Box>
          </Drawer>
        </Box>

        {/* Main Content Area - THIS IS WHERE THE NESTED ROUTES RENDER */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: isMobile ? 1 : 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(to bottom right, #e8f5e9, #c8e6c9)',
            position: 'relative',
            overflow: 'auto',
            ...scrollbarHiddenStyles,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232e7d32' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              zIndex: -1,
            }
          }}
        >
          <Toolbar />
          {/* Outlet renders the nested route components (DashboardHome, StudentsPage, etc.) */}
          <Paper
            elevation={0}
            sx={{
              p: isMobile ? 2 : 3,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(200, 230, 201, 0.5)',
              position: 'relative',
              minHeight: isMobile ? '70vh' : '80vh',
              overflow: 'auto',
              ...scrollbarHiddenStyles
            }}
          >
            <Outlet />
          </Paper>

          {/* Quick Actions Speed Dial - Shows on ALL admin routes */}
          {isAdminRoute && (
            <>
              <Backdrop open={quickActionsOpen} sx={{ zIndex: 1099 }} />
              <SpeedDial
                ariaLabel="Quick Actions"
                sx={{ 
                  position: 'fixed', 
                  bottom: isMobile ? 70 : 24, // Adjusted for mobile bottom nav
                  right: 24,
                  '& .MuiSpeedDial-fab': {
                    backgroundColor: '#2e7d32',
                    width: isMobile ? 48 : 56,
                    height: isMobile ? 48 : 56,
                    '&:hover': {
                      backgroundColor: '#1b5e20',
                    }
                  }
                }}
                icon={<SpeedDialIcon />}
                onClose={() => setQuickActionsOpen(false)}
                onOpen={() => setQuickActionsOpen(true)}
                open={quickActionsOpen}
                direction={isMobile ? 'up' : 'up'}
              >
                {quickActions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen={window.innerWidth > 600} // Only show tooltips on larger screens
                    onClick={() => handleQuickAction(action.action)}
                    sx={{
                      '& .MuiSpeedDialAction-staticTooltipLabel': {
                        backgroundColor: '#2e7d32',
                        color: 'white',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        borderRadius: 1,
                      },
                      '& .MuiSpeedDialAction-fab': {
                        backgroundColor: '#4caf50',
                        color: 'white',
                        width: isMobile ? 40 : 48,
                        height: isMobile ? 40 : 48,
                        '&:hover': {
                          backgroundColor: '#388e3c',
                        }
                      }
                    }}
                  />
                ))}
              </SpeedDial>
            </>
          )}

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <Paper 
              sx={{ 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                right: 0,
                zIndex: 1100,
                borderRadius: '16px 16px 0 0'
              }} 
              elevation={3}
            >
              <BottomNavigation
                value={mobileBottomNavValue}
                onChange={handleMobileBottomNavChange}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  '& .MuiBottomNavigationAction-root': {
                    minWidth: 'auto',
                    padding: '6px 0',
                    '&.Mui-selected': {
                      color: '#2e7d32',
                    }
                  }
                }}
              >
                {mobileNavItems.map((item, index) => (
                  <BottomNavigationAction
                    key={item.id}
                    label={item.label}
                    icon={item.icon}
                    value={index}
                  />
                ))}
              </BottomNavigation>
            </Paper>
          )}

          {/* Logout Confirmation Dialog */}
          <Dialog
            open={logoutDialogOpen}
            onClose={handleLogoutCancel}
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
            PaperProps={{
              sx: {
                borderRadius: 2,
                background: 'linear-gradient(to bottom, #f1f8e9, #e8f5e9)',
                width: isMobile ? '90%' : 'auto',
                maxWidth: isMobile ? 'none' : 400,
              }
            }}
          >
            <DialogTitle id="logout-dialog-title" sx={{ 
              backgroundColor: '#2e7d32', 
              color: 'white',
              textAlign: 'center',
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              Confirm Logout
            </DialogTitle>
            <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
              <DialogContentText id="logout-dialog-description" sx={{ textAlign: 'center', color: '#1b5e20' }}>
                Are you sure you want to logout from the admin portal?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, p: isMobile ? 2 : 3, flexDirection: isMobile ? 'column' : 'row' }}>
              <Button 
                onClick={handleLogoutCancel}
                variant="outlined"
                fullWidth={isMobile}
                sx={{
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#e8f5e9',
                    borderColor: '#1b5e20',
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleLogoutConfirm}
                variant="contained"
                startIcon={<LogoutIcon />}
                fullWidth={isMobile}
                sx={{
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#b71c1c',
                  }
                }}
              >
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;