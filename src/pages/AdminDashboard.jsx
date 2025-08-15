import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTheme } from '../styles/themes';
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
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as AdmissionsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications ] = useState(3);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
        navigate('/login');
      }
    };
    
    fetchUser();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/admin/${tab}`);
    if (mobileOpen) setMobileOpen(false);
  };

  const drawerWidth = 240;
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'admissions', label: 'Admissions', icon: <AdmissionsIcon /> },
    { id: 'students', label: 'Students', icon: <PeopleIcon /> },
    { id: 'staff', label: 'Staff', icon: <PeopleIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.colors.primaryDark,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Literacy Tree Admin Portal
          </Typography>
          
          <IconButton color="inherit">
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Avatar 
                alt={user.name} 
                src={user.avatar} 
                sx={{ width: 40, height: 40, bgcolor: theme.colors.accent }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                {user.name}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
            },
          }}
        >
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Literacy Tree</Typography>
          </Box>
          <Divider sx={{ borderColor: theme.colors.primaryLight }} />
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.id}
                selected={activeTab === item.id}
                onClick={() => handleTabChange(item.id)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.colors.primaryLight,
                  },
                  '&:hover': {
                    backgroundColor: theme.colors.primaryLight,
                  }
                }}
              >
                <ListItemIcon sx={{ color: theme.colors.white }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            <Divider sx={{ borderColor: theme.colors.primaryLight, my: 1 }} />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: theme.colors.white }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
            },
          }}
          open
        >
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Literacy Tree
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
              Admin Portal
            </Typography>
          </Box>
          <Divider sx={{ borderColor: theme.colors.primaryLight }} />
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.id}
                selected={activeTab === item.id}
                onClick={() => handleTabChange(item.id)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.colors.primaryLight,
                  },
                  '&:hover': {
                    backgroundColor: theme.colors.primaryLight,
                  }
                }}
              >
                <ListItemIcon sx={{ color: theme.colors.white }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ mt: 'auto', p: 2 }}>
            <Divider sx={{ borderColor: theme.colors.primaryLight, mb: 2 }} />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon sx={{ color: theme.colors.white }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </Box>
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar />
        <Box sx={{ 
          backgroundColor: theme.colors.white, 
          borderRadius: theme.sizes.borderRadius.medium,
          boxShadow: theme.shadows.sm,
          p: 3,
          minHeight: '80vh'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;