import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Menu,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Hidden,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  BarChart as BarChartIcon,
  CalendarMonth as CalendarIcon,
  FilterList as FilterIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Description as ExcelIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import api from '../../api/api';

// Mock data for reports and analytics
const mockReportData = {
  summary: {
    totalStudents: 245,
    newAdmissions: 15,
    totalRevenue: 1250000,
    attendanceRate: 94.5,
    pendingTasks: 8
  },
  admissionStats: [
    { month: 'Jan', applications: 45, approved: 38, rejected: 7 },
    { month: 'Feb', applications: 52, approved: 44, rejected: 8 },
    { month: 'Mar', applications: 38, approved: 32, rejected: 6 },
    { month: 'Apr', applications: 61, approved: 52, rejected: 9 },
    { month: 'May', applications: 47, approved: 40, rejected: 7 },
    { month: 'Jun', applications: 55, approved: 47, rejected: 8 }
  ],
  revenueData: [
    { month: 'Jan', tuition: 450000, transport: 120000, other: 80000, total: 650000 },
    { month: 'Feb', tuition: 480000, transport: 125000, other: 85000, total: 690000 },
    { month: 'Mar', tuition: 420000, transport: 115000, other: 75000, total: 610000 },
    { month: 'Apr', tuition: 510000, transport: 130000, other: 90000, total: 730000 },
    { month: 'May', tuition: 460000, transport: 122000, other: 82000, total: 664000 },
    { month: 'Jun', tuition: 490000, transport: 128000, other: 87000, total: 705000 }
  ],
  studentDistribution: [
    { name: 'Pre-School', value: 45, color: '#3b82f6' },
    { name: 'Grade 1-3', value: 68, color: '#10b981' },
    { name: 'Grade 4-6', value: 72, color: '#8b5cf6' },
    { name: 'Grade 7-9', value: 60, color: '#f59e0b' }
  ],
  attendanceData: [
    { day: 'Mon', attendance: 92, target: 95 },
    { day: 'Tue', attendance: 94, target: 95 },
    { day: 'Wed', attendance: 96, target: 95 },
    { day: 'Thu', attendance: 93, target: 95 },
    { day: 'Fri', attendance: 95, target: 95 }
  ],
  topPerformers: [
    { id: 1, name: 'Sarah Johnson', grade: 'Grade 5', average: 94.5, improvement: 8.2 },
    { id: 2, name: 'Mike Brown', grade: 'Grade 7', average: 92.8, improvement: 6.5 },
    { id: 3, name: 'Emma Wilson', grade: 'Grade 4', average: 91.2, improvement: 7.8 },
    { id: 4, name: 'John Davis', grade: 'Grade 6', average: 90.5, improvement: 5.9 }
  ]
};

const ReportsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState('last6months');
  const [reportType, setReportType] = useState('overview');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  // Animation states
  const [pageLoaded, setPageLoaded] = useState(false);

  const dateRanges = [
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'currentYear', label: 'Current Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Overview', icon: <BarChartIcon /> },
    { value: 'admissions', label: 'Admissions', icon: <PeopleIcon /> },
    { value: 'financial', label: 'Financial', icon: <MoneyIcon /> },
    { value: 'academic', label: 'Academic', icon: <SchoolIcon /> },
    { value: 'attendance', label: 'Attendance', icon: <CalendarIcon /> }
  ];

  const exportFormats = [
    { value: 'pdf', label: 'PDF Document', icon: <PdfIcon /> },
    { value: 'excel', label: 'Excel Spreadsheet', icon: <ExcelIcon /> },
    { value: 'csv', label: 'CSV File', icon: <DescriptionIcon /> }
  ];

  useEffect(() => {
    fetchReportData();
    // Trigger page animation after component mounts
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await api.get(`/api/reports?range=${dateRange}&type=${reportType}`);
      // setReportData(response.data.data);
      
      // Using mock data for now
      setTimeout(() => {
        setReportData(mockReportData);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to fetch report data:', err);
      setError('Failed to load report data');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    fetchReportData();
  };

  const handleExportReport = (format) => {
    // Export functionality
    console.log(`Exporting report as ${format}`);
    // In real implementation, this would generate and download the report
    setExportDialogOpen(false);
    setExportMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const greenColors = {
    primary: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    background: '#e8f5e9',
    paper: '#f1f8e9',
    accent: '#81c784',
    gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
    lightGradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
    hover: 'rgba(76, 175, 80, 0.08)'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  if (loading && !reportData) {
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
          Loading Literacy Tree Portal...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: isSmallScreen ? 1 : 3, 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      pb: isMobile ? 8 : 3 // Add bottom padding for mobile to account for FAB
    }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: '#e8f5e9', mb: 2 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#ffff', fontWeight: 700 }}>
              Reports & Analytics
            </Typography>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: 300,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '8px',
          }
        }}
      >
        <MenuItem onClick={() => { handleRefresh(); handleMobileMenuClose(); }}>
          <RefreshIcon sx={{ mr: 1, color: '#2e7d32' }} />
          Refresh Data
        </MenuItem>
        <MenuItem onClick={() => { handleExportMenuOpen(); handleMobileMenuClose(); }}>
          <DownloadIcon sx={{ mr: 1, color: '#2e7d32' }} />
          Export Report
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { setFilterDrawerOpen(true); handleMobileMenuClose(); }}>
          <FilterIcon sx={{ mr: 1, color: '#2e7d32' }} />
          Filters & Settings
        </MenuItem>
      </Menu>

      {/* Export Menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportMenuClose}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: 300,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: '8px',
          }
        }}
      >
        {exportFormats.map(format => (
          <MenuItem 
            key={format.value} 
            onClick={() => handleExportReport(format.value)}
            sx={{ '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.04)' } }}
          >
            {format.icon}
            <Typography sx={{ ml: 1 }}>{format.label}</Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Export Dialog */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            bgcolor: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#e8f5e9', color: '#1b5e20' }}>
          Export Report
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>
            Select the format you'd like to export the report in:
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {exportFormats.map(format => (
              <Grid item xs={12} sm={4} key={format.value}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                  onClick={() => handleExportReport(format.value)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    {format.icon}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {format.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#e8f5e9' }}>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Header - Desktop */}
      {!isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{
                              fontWeight: 700,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
              Reports & Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive insights and performance metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              variant="outlined"
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              Refresh
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              onClick={() => setExportDialogOpen(true)}
              variant="contained"
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }
              }}
            >
              Export Report
            </Button>
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filters - Desktop */}
      {!isMobile && (
        <Card sx={{ 
          mb: 3, 
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
          }
        }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Date Range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d1d5db'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {dateRanges.map(range => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  select
                  label="Report Type"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d1d5db'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#3b82f6'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {reportTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {type.icon}
                        <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => {
                    setDateRange('last6months');
                    setReportType('overview');
                  }}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            height: '70%',
            maxHeight: '70%',
            p: 2,
            bgcolor: '#ffffff'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1b5e20' }}>
            Filters & Settings
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Date Range
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="Date Range"
                >
                  {dateRanges.map(range => (
                    <MenuItem key={range.value} value={range.value}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Report Type
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  {reportTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {type.icon}
                        <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Export Options
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {exportFormats.map(format => (
                  <Grid item xs={12} sm={4} key={format.value}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                        }
                      }}
                      onClick={() => handleExportReport(format.value)}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        {format.icon}
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {format.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
          
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => {
              setDateRange('last6months');
              setReportType('overview');
            }}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
          >
            Clear All Filters
          </Button>
          
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => {
              handleRefresh();
              setFilterDrawerOpen(false);
            }}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': {
                bgcolor: '#1b5e20',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Apply & Refresh
          </Button>
        </Box>
      </Drawer>

      {/* Summary Cards */}
      <Grid container spacing={isSmallScreen ? 2 : 3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
              <Avatar sx={{ 
                bgcolor: '#3b82f6', 
                mx: 'auto', 
                mb: 2,
                width: isSmallScreen ? 48 : 56,
                height: isSmallScreen ? 48 : 56,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}>
                <PeopleIcon fontSize={isSmallScreen ? "medium" : "large"} />
              </Avatar>
              <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#3b82f6' }}>
                {reportData ? formatNumber(reportData.summary.totalStudents) : '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
              <Avatar sx={{ 
                bgcolor: '#10b981', 
                mx: 'auto', 
                mb: 2,
                width: isSmallScreen ? 48 : 56,
                height: isSmallScreen ? 48 : 56,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}>
                <TrendingUpIcon fontSize={isSmallScreen ? "medium" : "large"} />
              </Avatar>
              <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#10b981' }}>
                {reportData ? reportData.summary.newAdmissions : '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Admissions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
              <Avatar sx={{ 
                bgcolor: '#8b5cf6', 
                mx: 'auto', 
                mb: 2,
                width: isSmallScreen ? 48 : 56,
                height: isSmallScreen ? 48 : 56,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}>
                <MoneyIcon fontSize={isSmallScreen ? "medium" : "large"} />
              </Avatar>
              <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                {reportData ? formatCurrency(reportData.summary.totalRevenue / 100) : 'ZMW 0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
              <Avatar sx={{ 
                bgcolor: '#f59e0b', 
                mx: 'auto', 
                mb: 2,
                width: isSmallScreen ? 48 : 56,
                height: isSmallScreen ? 48 : 56,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}>
                <CalendarIcon fontSize={isSmallScreen ? "medium" : "large"} />
              </Avatar>
              <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#f59e0b' }}>
                {reportData ? `${reportData.summary.attendanceRate}%` : '0%'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }
          }}>
            <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
              <Avatar sx={{ 
                bgcolor: '#ef4444', 
                mx: 'auto', 
                mb: 2,
                width: isSmallScreen ? 48 : 56,
                height: isSmallScreen ? 48 : 56,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}>
                <EventIcon fontSize={isSmallScreen ? "medium" : "large"} />
              </Avatar>
              <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#ef4444' }}>
                {reportData ? reportData.summary.pendingTasks : '0'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ 
        mb: 3, 
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
        }
      }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ px: isSmallScreen ? 1 : 3, pt: 2 }}
            indicatorColor="primary"
            textColor="primary"
            variant={isSmallScreen ? "scrollable" : "standard"}
            scrollButtons={isSmallScreen ? "auto" : false}
          >
            <Tab label="Overview" />
            <Tab label="Admissions" />
            <Tab label="Financial" />
            <Tab label="Academic" />
            <Tab label="Attendance" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {tabValue === 0 && reportData && (
        <Grid container spacing={isSmallScreen ? 2 : 3}>
          {/* Admissions Trend */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{
                              fontWeight: 600,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
                  Admissions Trend - Last 6 Months
                </Typography>
                <ResponsiveContainer width="100%" height={isSmallScreen ? 250 : 300}>
                  <BarChart data={reportData.admissionStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="applications" fill="#3b82f6" name="Applications" animationDuration={1500} />
                    <Bar dataKey="approved" fill="#10b981" name="Approved" animationDuration={1500} />
                    <Bar dataKey="rejected" fill="#ef4444" name="Rejected" animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Student Distribution */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{
                              fontWeight: 600,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
                  Student Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={isSmallScreen ? 250 : 300}>
                  <PieChart>
                    <Pie
                      data={reportData.studentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => isSmallScreen ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={isSmallScreen ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {reportData.studentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Revenue Trend */}
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{
                              fontWeight: 700,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
                  Revenue Trend - Last 6 Months
                </Typography>
                <ResponsiveContainer width="100%" height={isSmallScreen ? 250 : 300}>
                  <AreaChart data={reportData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value / 100)} />
                    <Legend />
                    <Area type="monotone" dataKey="tuition" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Tuition" animationDuration={1500} />
                    <Area type="monotone" dataKey="transport" stackId="1" stroke="#10b981" fill="#10b981" name="Transport" animationDuration={1500} />
                    <Area type="monotone" dataKey="other" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Other" animationDuration={1500} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && reportData && (
        <Grid container spacing={isSmallScreen ? 2 : 3}>
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{
                              fontWeight: 600,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
                  Detailed Admissions Report
                </Typography>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size={isSmallScreen ? "small" : "medium"}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Applications</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Approved</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Rejected</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Approval Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.admissionStats.map((stat, index) => (
                        <TableRow key={index} sx={{ 
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                          transition: 'all 0.3s ease'
                        }}>
                          <TableCell sx={{ fontWeight: 600 }}>{stat.month}</TableCell>
                          <TableCell align="right">{formatNumber(stat.applications)}</TableCell>
                          <TableCell align="right">{formatNumber(stat.approved)}</TableCell>
                          <TableCell align="right">{formatNumber(stat.rejected)}</TableCell>
                          <TableCell align="right">
                            <Chip 
                              label={`${((stat.approved / stat.applications) * 100).toFixed(1)}%`}
                              color="success"
                              size="small"
                              sx={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)'
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && reportData && (
        <Grid container spacing={isSmallScreen ? 2 : 3}>
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{
                              fontWeight: 600,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
                  Financial Performance
                </Typography>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size={isSmallScreen ? "small" : "medium"}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Tuition</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Transport</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Other</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">Growth</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.revenueData.map((revenue, index) => {
                        const prevMonth = reportData.revenueData[index - 1];
                        const growth = prevMonth ? ((revenue.total - prevMonth.total) / prevMonth.total * 100) : 0;
                        
                        return (
                          <TableRow key={index} sx={{ 
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            transition: 'all 0.3s ease'
                          }}>
                            <TableCell sx={{ fontWeight: 600 }}>{revenue.month}</TableCell>
                            <TableCell align="right">{formatCurrency(revenue.tuition / 100)}</TableCell>
                            <TableCell align="right">{formatCurrency(revenue.transport / 100)}</TableCell>
                            <TableCell align="right">{formatCurrency(revenue.other / 100)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                              {formatCurrency(revenue.total / 100)}
                            </TableCell>
                            <TableCell align="right">
                              <Chip 
                                label={`${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`}
                                color={growth >= 0 ? 'success' : 'error'}
                                size="small"
                                sx={{
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && reportData && (
        <Grid container spacing={isSmallScreen ? 2 : 3}>
          {/* Top Performers */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{
                              fontWeight: 600,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
                  Top Academic Performers
                </Typography>
                <List>
                  {reportData.topPerformers.map((student, index) => (
                    <React.Fragment key={student.id}>
                      <ListItem sx={{ 
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}>
                        <ListItemIcon>
                          <Avatar sx={{ 
                            bgcolor: '#3b82f6', 
                            width: isSmallScreen ? 36 : 40, 
                            height: isSmallScreen ? 36 : 40,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)'
                            }
                          }}>
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant={isSmallScreen ? "body2" : "subtitle1"} sx={{
                            fontWeight: 600,
                            color: greenColors.dark,
                            background: greenColors.gradient,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                                {student.name}
                              </Typography>
                              <Chip 
                                label={`${student.average}%`}
                                color="primary"
                                size="small"
                                sx={{
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="body2" color="text.secondary">
                                {student.grade}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                                +{student.improvement}%
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < reportData.topPerformers.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Attendance Trend */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{
                              fontWeight: 600,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
                  Weekly Attendance Trend
                </Typography>
                <ResponsiveContainer width="100%" height={isSmallScreen ? 250 : 300}>
                  <LineChart data={reportData.attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[85, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Actual Attendance"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      animationDuration={1500}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 4 && reportData && (
        <Grid container spacing={isSmallScreen ? 2 : 3}>
          <Grid item xs={12}>
            <Card sx={{ 
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom sx={{
                              fontWeight: 600,
                              color: greenColors.dark,
                              background: greenColors.gradient,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                          }}>
                  Attendance Analytics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <ResponsiveContainer width="100%" height={isSmallScreen ? 250 : 300}>
                      <BarChart data={reportData.attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[85, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="attendance" fill="#3b82f6" name="Attendance %" animationDuration={1500} />
                        <Bar dataKey="target" fill="#ef4444" name="Target %" animationDuration={1500} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', mt: isSmallScreen ? 2 : 4 }}>
                      <Typography variant={isSmallScreen ? "h4" : "h3"} sx={{
                            fontWeight: 700,
                            color: greenColors.dark,
                            background: greenColors.gradient,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                        {reportData.summary.attendanceRate}%
                      </Typography>
                      <Typography variant={isSmallScreen ? "body1" : "h6"} color="text.secondary" gutterBottom>
                        Overall Attendance Rate
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={reportData.summary.attendanceRate} 
                        sx={{ 
                          height: isSmallScreen ? 6 : 8, 
                          borderRadius: 4,
                          bgcolor: '#10b98120',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: '#10b981',
                            transition: 'all 0.5s ease'
                          } 
                        }} 
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        Target: 95%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="refresh"
          onClick={handleRefresh}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: '#2e7d32',
            boxShadow: '0 4px 14px rgba(46, 125, 50, 0.4)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#1b5e20',
              boxShadow: '0 6px 20px rgba(46, 125, 50, 0.6)',
              transform: 'scale(1.05)'
            },
            zIndex: 1000
          }}
        >
          <RefreshIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ReportsPage;