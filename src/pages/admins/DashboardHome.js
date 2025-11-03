import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Fade,
  Slide,
  Grow,
  Zoom,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  School as SchoolIcon,
  Receipt as AdmissionIcon,
  Event as EventIcon,
  Add as AddIcon,
  ChildCare as ChildIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Custom green color palette
const greenColors = {
  primary: '#2e7d32',
  light: '#4caf50',
  dark: '#1b5e20',
  background: '#e8f5e9',
  paper: '#f1f8e9',
  accent: '#81c784',
  gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
  lightGradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
};

// Mobile Stats Card Component
const MobileStatCard = ({ card, index, visible }) => {
  return (
    <Grow 
      in={visible} 
      timeout={600 + index * 100} 
      style={{ transformOrigin: '0 0 0' }}
    >
      <Card sx={{ 
        height: '100px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: `1px solid ${card.color}20`,
        transition: 'all 0.3s ease',
        mb: 2,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 16px ${card.color}20`
        }
      }}>
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            color: card.color,
            background: `${card.color}15`,
            borderRadius: '8px',
            p: 1,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(card.icon, { sx: { fontSize: 24 } })}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: card.color, mr: 1 }}>
                {card.value}
              </Typography>
              <Chip 
                label={card.trend} 
                size="small" 
                sx={{ 
                  height: 18, 
                  fontSize: '0.65rem',
                  backgroundColor: greenColors.light,
                  color: 'white'
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: greenColors.dark }}>
              {card.title}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Mobile Quick Action Component
const MobileQuickAction = ({ action, index, visible }) => {
  return (
    <Grow 
      in={visible} 
      timeout={500 + index * 100} 
      style={{ transformOrigin: '0 0 0' }}
    >
      <Card 
        sx={{ 
          cursor: 'pointer',
          height: '80px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${action.color}20 0%, ${action.color}40 100%)`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${action.color}20`,
          transition: 'all 0.3s ease',
          mb: 2,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 16px ${action.color}40`
          }
        }}
      >
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
              borderRadius: '8px',
              p: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: `0 2px 8px ${action.color}40`
            }}
          >
            {React.cloneElement(action.icon, { 
              sx: { fontSize: 20, color: 'white' } 
            })}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: greenColors.dark, fontSize: '0.9rem' }}>
              {action.title}
            </Typography>
            <Typography variant="caption" sx={{ color: greenColors.dark }}>
              {action.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Pie Chart Component
const AdmissionPieChart = ({ data, totalAdmissions, visible, isMobile }) => {
  return (
    <Grow in={visible} timeout={800}>
      <Card sx={{ 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #c8e6c9',
        background: greenColors.lightGradient,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
        }
      }}>
        <CardContent sx={{ p: isMobile ? 2 : 3, height: '100%' }}>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: 600, color: greenColors.dark, mb: 2 }}>
            Admission Status
          </Typography>
          
          <Box sx={{ height: isMobile ? 200 : 250, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 40 : 60}
                  outerRadius={isMobile ? 60 : 80}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                {!isMobile && <Legend />}
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: 2, textAlign: 'center', color: greenColors.dark }}>
            Total: {totalAdmissions}
          </Typography>
          <Grid container spacing={1}>
            {data.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      mr: 1
                    }}
                  />
                  <Typography variant={isMobile ? "caption" : "body2"} sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontWeight: 700, color: item.color, textAlign: 'center' }}>
                  {item.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Bar Chart Component
const AdmissionBarChart = ({ data, visible, isMobile }) => {
  return (
    <Grow in={visible} timeout={1000}>
      <Card sx={{ 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #c8e6c9',
        background: greenColors.lightGradient,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
        }
      }}>
        <CardContent sx={{ p: isMobile ? 2 : 3, height: '100%' }}>
          <Typography variant={isMobile ? "h6" : "h5"} gutterBottom sx={{ fontWeight: 600, color: greenColors.dark, mb: 2 }}>
            Admission Overview
          </Typography>
          
          <Box sx={{ height: isMobile ? 200 : 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis 
                  dataKey="status" 
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} animationDuration={1000}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [chartsVisible, setChartsVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [mobileTabValue, setMobileTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Use the correct API endpoints
        const [statsResponse, admissionsResponse] = await Promise.all([
          api.get('/dashboard/stats'), // Fixed route
          api.get('/admissions?limit=5&sort=createdAt.desc'), 
        ]);

        console.log('Dashboard stats response:', statsResponse.data);
        console.log('Admissions response:', admissionsResponse.data);
        
        const stats = statsResponse.data.data?.stats || {};
        const recentAdmissions = admissionsResponse.data.data?.admissions || [];

        const transformedData = {
          stats: {
            totalStudents: stats.totalStudents || 0,
            totalAdmissions: stats.totalAdmissions || recentAdmissions.length,
            pendingAdmissions: stats.pendingAdmissions || recentAdmissions.filter(a => a.status === 'pending').length,
            totalClasses: stats.totalClasses || 0, // This might not exist in your stats
            upcomingEvents: stats.upcomingEvents || 0
          },
          recentAdmissions: recentAdmissions,
          admissionStatus: stats.admissionStatus || {
            pending: recentAdmissions.filter(a => a.status === 'pending').length,
            under_review: recentAdmissions.filter(a => a.status === 'under_review').length,
            accepted: recentAdmissions.filter(a => a.status === 'accepted').length,
            rejected: recentAdmissions.filter(a => a.status === 'rejected').length
          }
        };

        console.log('Transformed dashboard data:', transformedData);
        setDashboardData(transformedData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        // Set fallback data
        setDashboardData({
          stats: {
            totalStudents: 0,
            totalAdmissions: 0,
            pendingAdmissions: 0,
            totalClasses: 0,
            upcomingEvents: 0
          },
          recentAdmissions: [],
          admissionStatus: {
            pending: 0,
            under_review: 0,
            accepted: 0,
            rejected: 0
          }
        });
        setError('Failed to load dashboard data. Using demo data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // Trigger page animation after component mounts
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  useEffect(() => {
    // Trigger animations in sequence after data is loaded
    if (dashboardData) {
      setTimeout(() => setCardsVisible(true), 300);
      setTimeout(() => setStatsVisible(true), 600);
      setTimeout(() => setChartsVisible(true), 900);
    }
  }, [dashboardData]);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new-admission':
        navigate('/admission');
        break;
      case 'view-admissions':
        navigate('/admin/admissions');
        break;
      case 'view-students':
        navigate('/admin/students');
        break;
      case 'manage-classes':
        navigate('/admin/academic');
        break;
      default:
        break;
    }
  };

  const handleMobileTabChange = (event, newValue) => {
    setMobileTabValue(newValue);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  if (loading) {
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

  const stats = dashboardData?.stats || {};
  const admissionStatus = dashboardData?.admissionStatus || {};

  // Prepare data for charts
  const pieChartData = [
    { name: 'Pending', value: admissionStatus.pending || 0, color: '#f59e0b' },
    { name: 'Under Review', value: admissionStatus.under_review || 0, color: '#3b82f6' },
    { name: 'Accepted', value: admissionStatus.accepted || 0, color: '#10b981' },
    { name: 'Rejected', value: admissionStatus.rejected || 0, color: '#ef4444' }
  ];

  const barChartData = [
    { status: 'Pending', count: admissionStatus.pending || 0, fill: '#f59e0b' },
    { status: 'Under Review', count: admissionStatus.under_review || 0, fill: '#3b82f6' },
    { status: 'Accepted', count: admissionStatus.accepted || 0, fill: '#10b981' },
    { status: 'Rejected', count: admissionStatus.rejected || 0, fill: '#ef4444' }
  ];

  const totalAdmissions = pieChartData.reduce((sum, item) => sum + item.value, 0);

  // Enhanced stat cards with progress indicators - BALANCED SIZE
  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: <ChildIcon />,
      color: greenColors.primary,
      description: 'Enrolled children',
      progress: Math.min((stats.totalStudents / 100) * 100, 100), // Dynamic progress based on data
      trend: '+12%'
    },
    {
      title: 'Pending Admissions',
      value: stats.pendingAdmissions || 0,
      icon: <AdmissionIcon />,
      color: greenColors.light,
      description: 'Applications to review',
      progress: Math.min((stats.pendingAdmissions / 20) * 100, 100), // Dynamic progress
      trend: '+5%'
    },
    {
      title: 'Total Classes',
      value: stats.totalClasses || 0,
      icon: <SchoolIcon />,
      color: greenColors.accent,
      description: 'Active classes',
      progress: Math.min((stats.totalClasses / 10) * 100, 100), // Dynamic progress
      trend: '+8%'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcomingEvents || 0,
      icon: <EventIcon />,
      color: greenColors.dark,
      description: 'School activities',
      progress: Math.min((stats.upcomingEvents / 5) * 100, 100), // Dynamic progress
      trend: '+3%'
    }
  ];

  // Enhanced quick actions - BALANCED SIZE
  const quickActions = [
    {
      title: 'New Admission',
      description: 'Enroll a new child',
      icon: <AddIcon />,
      action: 'new-admission',
      color: greenColors.primary,
      variant: 'gradient'
    },
    {
      title: 'View Admissions',
      description: 'Manage applications',
      icon: <AdmissionIcon />,
      action: 'view-admissions',
      color: greenColors.light,
      variant: 'gradient'
    },
    {
      title: 'Student Management',
      description: 'View enrolled children',
      icon: <ChildIcon />,
      action: 'view-students',
      color: greenColors.accent,
      variant: 'gradient'
    },
    {
      title: 'Class Management',
      description: 'Manage classes & grades',
      icon: <SchoolIcon />,
      action: 'manage-classes',
      color: greenColors.dark,
      variant: 'gradient'
    }
  ];

  // Mobile drawer menu items
  const drawerItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, value: 0 },
    { text: 'Analytics', icon: <AssessmentIcon />, value: 1 },
    { text: 'Recent Activity', icon: <ScheduleIcon />, value: 2 }
  ];

  return (
    <Fade in={pageLoaded} timeout={800}>
      <Box sx={{ p: isMobile ? 2 : 3, backgroundColor: greenColors.background, minHeight: '100vh' }}>
        {/* Mobile Header with Menu */}
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: greenColors.dark }}>
              Dashboard
            </Typography>
            <Button onClick={toggleDrawer(true)} sx={{ color: greenColors.dark }}>
              <MenuIcon />
            </Button>
          </Box>
        )}

        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
        >
          <Box
            sx={{ width: 250, p: 2 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Typography variant="h6" sx={{ mb: 2, color: greenColors.dark }}>
              Navigation
            </Typography>
            <List>
              {drawerItems.map((item) => (
                <ListItem 
                  button 
                  key={item.text}
                  onClick={() => setMobileTabValue(item.value)}
                  selected={mobileTabValue === item.value}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: greenColors.primary + '20',
                      color: greenColors.primary
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Desktop Header */}
        {!isMobile && (
          <Slide direction="down" in={pageLoaded} timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" gutterBottom sx={{ 
                    fontWeight: 700, 
                    color: greenColors.dark,
                    background: greenColors.gradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    School Dashboard
                  </Typography>
                  <Typography variant="body1" sx={{ color: greenColors.dark, fontSize: '1.1rem' }}>
                    Welcome back! Here's what's happening today at Literacy Tree.
                  </Typography>
                </Box>
                <Zoom in={pageLoaded} timeout={1200}>
                  <Chip 
                    icon={<CheckCircleIcon />} 
                    label="All Systems Operational" 
                    sx={{ 
                      backgroundColor: greenColors.light, 
                      color: 'white',
                      '& .MuiChip-icon': {
                        color: 'white'
                      },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Zoom>
              </Box>
              
              {/* Quick Stats Bar */}
              <Slide direction="up" in={pageLoaded} timeout={1200}>
                <Paper sx={{ 
                  p: 2, 
                  mb: 3, 
                  background: greenColors.gradient,
                  color: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <TrendingUpIcon />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="body2">
                        School is running smoothly. {stats.pendingAdmissions || 0} admissions need your attention.
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button 
                        variant="contained" 
                        size="small" 
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          '&:hover': { 
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => navigate('/admin/admissions')}
                      >
                        Review Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Slide>
            </Box>
          </Slide>
        )}

        {error && (
          <Grow in={!!error} timeout={500}>
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </Grow>
        )}

        {/* Mobile Layout */}
        {isMobile ? (
          <Box>
            {/* Mobile Tabs */}
            <Paper sx={{ mb: 3, borderRadius: '12px' }}>
              <Tabs
                value={mobileTabValue}
                onChange={handleMobileTabChange}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    color: greenColors.dark,
                    fontSize: '0.875rem',
                    minHeight: 48
                  },
                  '& .Mui-selected': {
                    color: greenColors.primary
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: greenColors.primary
                  }
                }}
              >
                <Tab label="Overview" />
                <Tab label="Analytics" />
                <Tab label="Activity" />
              </Tabs>
            </Paper>

            {/* Tab Content */}
            {mobileTabValue === 0 && (
              <Box>
                {/* Mobile Stats Cards */}
                <Box sx={{ mb: 3 }}>
                  {statCards.map((card, index) => (
                    <MobileStatCard 
                      key={card.title}
                      card={card} 
                      index={index} 
                      visible={statsVisible} 
                    />
                  ))}
                </Box>

                {/* Mobile Quick Actions */}
                <Typography variant="h6" sx={{ mb: 2, color: greenColors.dark, fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {quickActions.map((action, index) => (
                    <MobileQuickAction 
                      key={action.title}
                      action={action} 
                      index={index} 
                      visible={cardsVisible}
                      onClick={() => handleQuickAction(action.action)}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {mobileTabValue === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: greenColors.dark, fontWeight: 600 }}>
                  Analytics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <AdmissionPieChart 
                      data={pieChartData} 
                      totalAdmissions={totalAdmissions} 
                      visible={chartsVisible} 
                      isMobile={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AdmissionBarChart 
                      data={barChartData} 
                      visible={chartsVisible} 
                      isMobile={true}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {mobileTabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: greenColors.dark, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Card sx={{ borderRadius: '12px', background: greenColors.lightGradient }}>
                  <CardContent sx={{ p: 2 }}>
                    {dashboardData?.recentAdmissions && dashboardData.recentAdmissions.length > 0 ? (
                      <Box>
                        {dashboardData.recentAdmissions.map((admission) => (
                          <Accordion key={admission.id} sx={{ mb: 1, backgroundColor: 'transparent' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Avatar 
                                  sx={{ 
                                    width: 32, 
                                    height: 32, 
                                    mr: 2,
                                    backgroundColor: greenColors.primary,
                                    fontSize: '12px'
                                  }}
                                >
                                  {admission.childFirstName?.charAt(0)}{admission.childSurname?.charAt(0)}
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {admission.childFirstName} {admission.childSurname}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: greenColors.dark }}>
                                    {new Date(admission.createdAt || admission.created_at).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Chip 
                                  label={admission.status?.replace('_', ' ') || 'pending'} 
                                  size="small"
                                  color={
                                    admission.status === 'accepted' ? 'success' :
                                    admission.status === 'rejected' ? 'error' :
                                    admission.status === 'under_review' ? 'warning' : 'default'
                                  }
                                  variant="outlined"
                                />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography variant="body2" color="text.secondary">
                                Age: {admission.childAge} • Status: {admission.status?.replace('_', ' ') || 'pending'}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <AdmissionIcon sx={{ fontSize: 48, color: greenColors.accent, mb: 2 }} />
                        <Typography variant="body2" sx={{ color: greenColors.dark }}>
                          No recent admissions
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        ) : (
          /* Desktop Layout */
          <Box>
            {/* Enhanced Quick Actions */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Grow 
                    in={cardsVisible} 
                    timeout={500 + index * 150} 
                    style={{ transformOrigin: '0 0 0' }}
                  >
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        height: '170px', // Balanced size - matching stats cards
                        borderRadius: '16px',
                        background: action.variant === 'gradient' 
                          ? `linear-gradient(135deg, ${action.color}20 0%, ${action.color}40 100%)`
                          : 'white',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: `1px solid ${action.color}20`,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 12px 30px ${action.color}40`
                        }
                      }}
                      onClick={() => handleQuickAction(action.action)}
                    >
                      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Box
                          sx={{
                            background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}dd 100%)`,
                            borderRadius: '12px',
                            p: 1.5,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1.5,
                            boxShadow: `0 4px 14px ${action.color}40`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              boxShadow: `0 6px 20px ${action.color}60`
                            }
                          }}
                        >
                          {React.cloneElement(action.icon, { 
                            sx: { fontSize: 28, color: 'white' } // Balanced icon size
                          })}
                        </Box>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenColors.dark, textAlign: 'center', fontSize: '0.95rem' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: greenColors.dark, textAlign: 'center' }}>
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>

            {/* Enhanced Stats Cards - BALANCED SIZE */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Grow 
                    in={statsVisible} 
                    timeout={600 + index * 150} 
                    style={{ transformOrigin: '0 0 0' }}
                  >
                    <Card sx={{ 
                      height: '170px', // Balanced size - between 200px and 140px
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      border: `1px solid ${card.color}20`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 30px ${card.color}20`
                      }
                    }}>
                      <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, flex: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.75 }}>
                              <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: card.color, mr: 1 }}>
                                {card.value}
                              </Typography>
                              <Chip 
                                label={card.trend} 
                                size="small" 
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.7rem',
                                  backgroundColor: greenColors.light,
                                  color: 'white',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              />
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark, mb: 0.5, fontSize: '0.95rem' }}>
                              {card.title}
                            </Typography>
                            <Typography variant="body2" sx={{ color: greenColors.dark }}>
                              {card.description}
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            color: card.color,
                            background: `${card.color}15`,
                            borderRadius: '10px',
                            p: 1,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              background: `${card.color}25`
                            }
                          }}>
                            {React.cloneElement(card.icon, { sx: { fontSize: 32 } })}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={card.progress} 
                            sx={{ 
                              flexGrow: 1, 
                              height: 5, 
                              borderRadius: 2.5,
                              backgroundColor: `${card.color}20`,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: card.color,
                                borderRadius: 2.5,
                                transition: 'all 0.5s ease'
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ color: card.color, ml: 1, fontWeight: 600 }}>
                            {Math.round(card.progress)}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
              ))}
            </Grid>

            {/* Recent Activity Section */}
            <Grid container spacing={3}>
              {/* Recent Admissions */}
              <Grid item xs={12} lg={6}>
                <Grow in={chartsVisible} timeout={800}>
                  <Card sx={{ 
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #c8e6c9',
                    background: greenColors.lightGradient,
                    minHeight: '500px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                    }
                  }}>
                    <CardContent sx={{ p: 3, height: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: greenColors.dark }}>
                          Recent Admissions
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small"
                          endIcon={<ScheduleIcon />}
                          onClick={() => navigate('/admin/admissions')}
                          sx={{ 
                            borderRadius: '8px',
                            borderColor: greenColors.primary,
                            color: greenColors.primary,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: greenColors.dark,
                              backgroundColor: greenColors.primary + '10',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          View All
                        </Button>
                      </Box>
                      
                      {dashboardData?.recentAdmissions && dashboardData.recentAdmissions.length > 0 ? (
                        <Box>
                          {dashboardData.recentAdmissions.map((admission, index) => (
                            <Grow 
                              in={chartsVisible} 
                              timeout={900 + index * 100} 
                              key={admission.id}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                py: 2,
                                px: 1,
                                borderRadius: '8px',
                                backgroundColor: index % 2 === 0 ? greenColors.paper : 'transparent',
                                transition: 'background-color 0.2s',
                                '&:hover': {
                                  backgroundColor: greenColors.accent + '30',
                                  transform: 'translateX(4px)'
                                }
                              }}>
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                  <Avatar 
                                    sx={{ 
                                      width: 40, 
                                      height: 40, 
                                      mr: 2,
                                      backgroundColor: greenColors.primary,
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.1)'
                                      }
                                    }}
                                  >
                                    {admission.childFirstName?.charAt(0)}{admission.childSurname?.charAt(0)}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 500, color: greenColors.dark }}>
                                      {admission.childFirstName} {admission.childSurname}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: greenColors.dark }}>
                                      Age: {admission.childAge} • Applied on {new Date(admission.createdAt || admission.created_at).toLocaleDateString()}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip 
                                  label={admission.status?.replace('_', ' ') || 'pending'} 
                                  size="small"
                                  color={
                                    admission.status === 'accepted' ? 'success' :
                                    admission.status === 'rejected' ? 'error' :
                                    admission.status === 'under_review' ? 'warning' : 'default'
                                  }
                                  variant="outlined"
                                  sx={{ 
                                    minWidth: '100px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.05)'
                                    }
                                  }}
                                />
                              </Box>
                            </Grow>
                          ))}
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <AdmissionIcon sx={{ fontSize: 64, color: greenColors.accent, mb: 2 }} />
                          <Typography variant="h6" sx={{ color: greenColors.dark, mb: 1 }}>
                            No Recent Admissions
                          </Typography>
                          <Typography variant="body2" sx={{ color: greenColors.dark }}>
                            New admission applications will appear here
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>

              {/* Pie Chart */}
              <Grid item xs={12} lg={6}>
                <AdmissionPieChart data={pieChartData} totalAdmissions={totalAdmissions} visible={chartsVisible} isMobile={false} />
              </Grid>
            </Grid>

            {/* Bar Chart in a separate section */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <AdmissionBarChart data={barChartData} visible={chartsVisible} isMobile={false} />
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Fade>
  );
};

export default DashboardHome;