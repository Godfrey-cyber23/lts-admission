import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Fade,
  Zoom,
  Slide,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  School as TeacherIcon,
  SupportAgent as SupportIcon,
  Clear as ClearIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon
} from '@mui/icons-material';

// Green color palette with shades
const greenTheme = {
  primary: '#2e7d32',
  primaryLight: '#4caf50',
  primaryDark: '#1b5e20',
  secondary: '#81c784',
  secondaryLight: '#a5d6a7',
  secondaryDark: '#388e3c',
  background: '#f1f8e9',
  paper: '#e8f5e9',
  accent: '#c8e6c9',
  hover: 'rgba(76, 175, 80, 0.08)',
  gradient: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
  lightGradient: 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e9 100%)'
};

// Mock data for staff members
const initialStaffMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@school.edu',
    phone: '+1 (555) 123-4567',
    role: 'teacher',
    department: 'Mathematics',
    joinDate: '2022-03-15',
    status: 'active',
    avatar: '/static/images/avatar/1.jpg',
    courses: ['Algebra II', 'Calculus'],
    performance: 4.8,
    address: '123 Main St, City, State',
    qualifications: ['M.Sc Mathematics', 'B.Ed'],
    emergencyContact: '+1 (555) 999-8888'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.c@school.edu',
    phone: '+1 (555) 234-5678',
    role: 'administrator',
    department: 'Administration',
    joinDate: '2020-08-22',
    status: 'active',
    avatar: '/static/images/avatar/2.jpg',
    courses: [],
    performance: 4.9,
    address: '456 Oak Ave, City, State',
    qualifications: ['MBA Education', 'B.Sc Business'],
    emergencyContact: '+1 (555) 777-6666'
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.d@school.edu',
    phone: '+1 (555) 345-6789',
    role: 'teacher',
    department: 'Science',
    joinDate: '2023-01-10',
    status: 'active',
    avatar: '/static/images/avatar/3.jpg',
    courses: ['Biology', 'Chemistry'],
    performance: 4.6,
    address: '789 Pine Rd, City, State',
    qualifications: ['Ph.D Chemistry', 'M.Ed'],
    emergencyContact: '+1 (555) 111-2222'
  },
  {
    id: 4,
    name: 'Robert Wilson',
    email: 'robert.w@school.edu',
    phone: '+1 (555) 456-7890',
    role: 'support',
    department: 'IT Support',
    joinDate: '2021-11-05',
    status: 'inactive',
    avatar: '/static/images/avatar/4.jpg',
    courses: [],
    performance: 4.7,
    address: '321 Elm St, City, State',
    qualifications: ['B.Sc Computer Science', 'Network+'],
    emergencyContact: '+1 (555) 333-4444'
  },
  {
    id: 5,
    name: 'Lisa Garcia',
    email: 'lisa.g@school.edu',
    phone: '+1 (555) 567-8901',
    role: 'teacher',
    department: 'Languages',
    joinDate: '2019-06-18',
    status: 'active',
    avatar: '/static/images/avatar/5.jpg',
    courses: ['Spanish', 'French'],
    performance: 4.9,
    address: '654 Maple Dr, City, State',
    qualifications: ['M.A Spanish Literature', 'B.Ed'],
    emergencyContact: '+1 (555) 555-0000'
  }
];

const StaffPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [staffMembers, setStaffMembers] = useState(initialStaffMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('add');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewMode, setViewMode] = useState('grid');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);

  // Form state for add/edit staff
  const [staffForm, setStaffForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'teacher',
    department: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    address: '',
    qualifications: '',
    emergencyContact: ''
  });

  // Filter and search staff members
  const filteredStaff = useMemo(() => {
    return staffMembers.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || staff.role === filterRole;
      const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staffMembers, searchTerm, filterRole, filterStatus]);

  // Sort staff members
  const sortedStaff = useMemo(() => {
    return filteredStaff.sort((a, b) => {
      if (orderBy === 'performance') {
        return order === 'asc' ? a.performance - b.performance : b.performance - a.performance;
      }
      if (orderBy === 'joinDate') {
        return order === 'asc' ? new Date(a.joinDate) - new Date(b.joinDate) : new Date(b.joinDate) - new Date(a.joinDate);
      }
      return order === 'asc' 
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    });
  }, [filteredStaff, orderBy, order]);

  // Pagination
  const paginatedStaff = useMemo(() => {
    return sortedStaff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedStaff, page, rowsPerPage]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterRole !== 'all') count++;
    if (filterStatus !== 'all') count++;
    return count;
  }, [searchTerm, filterRole, filterStatus]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleMenuOpen = (event, staff) => {
    setAnchorEl(event.currentTarget);
    setSelectedStaff(staff);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStaff(null);
  };

  const handleEdit = () => {
    setDialogType('edit');
    setStaffForm({
      name: selectedStaff.name,
      email: selectedStaff.email,
      phone: selectedStaff.phone,
      role: selectedStaff.role,
      department: selectedStaff.department,
      joinDate: selectedStaff.joinDate,
      status: selectedStaff.status,
      address: selectedStaff.address || '',
      qualifications: selectedStaff.qualifications?.join(', ') || '',
      emergencyContact: selectedStaff.emergencyContact || ''
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleView = () => {
    setDialogType('view');
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    setStaffMembers(prev => prev.filter(staff => staff.id !== selectedStaff.id));
    showSnackbar('Staff member deleted successfully', 'success');
    setDeleteConfirmOpen(false);
  };

  const handleToggleStatusClick = () => {
    setStatusConfirmOpen(true);
    handleMenuClose();
  };

  const handleStatusConfirm = () => {
    setStaffMembers(prev => prev.map(staff => 
      staff.id === selectedStaff.id 
        ? { ...staff, status: staff.status === 'active' ? 'inactive' : 'active' }
        : staff
    ));
    showSnackbar(`Staff member ${selectedStaff.status === 'active' ? 'deactivated' : 'activated'}`, 'success');
    setStatusConfirmOpen(false);
  };

  const handleAddStaff = () => {
    setDialogType('add');
    setSelectedStaff(null);
    setStaffForm({
      name: '',
      email: '',
      phone: '',
      role: 'teacher',
      department: '',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'active',
      address: '',
      qualifications: '',
      emergencyContact: ''
    });
    setOpenDialog(true);
  };

  const handleSaveStaff = () => {
    if (dialogType === 'add') {
      const newStaff = {
        id: Math.max(...staffMembers.map(s => s.id)) + 1,
        ...staffForm,
        avatar: `/static/images/avatar/${Math.floor(Math.random() * 5) + 1}.jpg`,
        courses: [],
        performance: 4.5,
        qualifications: staffForm.qualifications.split(',').map(q => q.trim()).filter(q => q)
      };
      setStaffMembers(prev => [...prev, newStaff]);
      showSnackbar('Staff member added successfully', 'success');
    } else if (dialogType === 'edit' && selectedStaff) {
      setStaffMembers(prev => prev.map(staff => 
        staff.id === selectedStaff.id 
          ? { 
              ...staff, 
              ...staffForm,
              qualifications: staffForm.qualifications.split(',').map(q => q.trim()).filter(q => q)
            }
          : staff
      ));
      showSnackbar('Staff member updated successfully', 'success');
    }
    setOpenDialog(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'teacher': return <TeacherIcon />;
      case 'administrator': return <AdminIcon />;
      case 'support': return <SupportIcon />;
      default: return <PersonIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'teacher': return 'primary';
      case 'administrator': return 'secondary';
      case 'support': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => 
      index < Math.floor(rating) ? 
        <StarIcon key={index} sx={{ color: '#ffc107', fontSize: 16 }} /> : 
        <StarBorderIcon key={index} sx={{ color: '#ffc107', fontSize: 16 }} />
    );
  };

  // Mobile Staff Card Component
  const MobileStaffCard = ({ staff, index }) => (
    <Zoom in timeout={500 + index * 100}>
      <Card sx={{ 
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        background: greenTheme.paper,
        border: `1px solid ${greenTheme.accent}`,
        mb: 2,
        '&:hover': {
          boxShadow: `0 10px 25px -3px ${greenTheme.primaryLight}20, 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
          transform: 'translateY(-4px)',
          borderColor: greenTheme.primaryLight
        }
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={staff.avatar} sx={{ width: 48, height: 48, mr: 2, border: `2px solid ${greenTheme.primary}` }}>
                {staff.name.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: greenTheme.primaryDark, fontSize: '1rem' }}>
                  {staff.name}
                </Typography>
                <Chip
                  icon={getRoleIcon(staff.role)}
                  label={staff.role}
                  color={getRoleColor(staff.role)}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
            <IconButton 
              onClick={(e) => handleMenuOpen(e, staff)}
              sx={{ color: greenTheme.primary }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ fontSize: 14, mr: 1, color: greenTheme.primary }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {staff.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ fontSize: 14, mr: 1, color: greenTheme.primary }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {staff.phone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ fontSize: 14, mr: 1, color: greenTheme.primary }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {staff.department}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1, borderColor: greenTheme.accent }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontSize: '0.8rem' }}>
                Performance
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {renderStars(staff.performance)}
                <Typography variant="body2" sx={{ ml: 1, fontWeight: 600, color: greenTheme.primaryDark, fontSize: '0.8rem' }}>
                  {staff.performance}
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={staff.status} 
              color={getStatusColor(staff.status)}
              size="small"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  // Mobile Filter Drawer
  const MobileFilterDrawer = () => (
    <Drawer
      anchor="bottom"
      open={mobileFilterOpen}
      onClose={() => setMobileFilterOpen(false)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          height: '60vh',
          p: 2
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: greenTheme.primary }}>
          Filters
        </Typography>
        <IconButton onClick={() => setMobileFilterOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: greenTheme.primary }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select
            value={filterRole}
            label="Role"
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="teacher">Teachers</MenuItem>
            <MenuItem value="administrator">Administrators</MenuItem>
            <MenuItem value="support">Support Staff</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          disabled={activeFiltersCount === 0}
          sx={{
            borderColor: greenTheme.primary,
            color: greenTheme.primary,
            '&:hover': {
              borderColor: greenTheme.primaryDark,
              backgroundColor: greenTheme.hover
            }
          }}
        >
          Clear Filters
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip 
          icon={<PersonIcon />} 
          label={`Total: ${staffMembers.length}`} 
          variant="outlined" 
          sx={{ borderColor: greenTheme.primary, color: greenTheme.primary }}
        />
        <Chip 
          icon={<TeacherIcon />} 
          label={`Teachers: ${staffMembers.filter(s => s.role === 'teacher').length}`} 
          sx={{ backgroundColor: greenTheme.primaryLight, color: 'white' }}
        />
        <Chip 
          icon={<AdminIcon />} 
          label={`Admins: ${staffMembers.filter(s => s.role === 'administrator').length}`} 
          sx={{ backgroundColor: greenTheme.secondary, color: 'white' }}
        />
        <Chip 
          icon={<SupportIcon />} 
          label={`Support: ${staffMembers.filter(s => s.role === 'support').length}`} 
          sx={{ backgroundColor: greenTheme.primaryDark, color: 'white' }}
        />
      </Box>
    </Drawer>
  );

  // Mobile Menu Drawer
  const MobileMenuDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: greenTheme.primary, mb: 2 }}>
          Staff Management
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem button onClick={() => { setBottomNavValue(0); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="All Staff" />
          </ListItem>
          <ListItem button onClick={() => { setBottomNavValue(1); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <TeacherIcon />
            </ListItemIcon>
            <ListItemText primary="Teachers" />
          </ListItem>
          <ListItem button onClick={() => { setBottomNavValue(2); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <AdminIcon />
            </ListItemIcon>
            <ListItemText primary="Administrators" />
          </ListItem>
          <ListItem button onClick={() => { setBottomNavValue(3); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <SupportIcon />
            </ListItemIcon>
            <ListItemText primary="Support Staff" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  return (
    <Fade in timeout={800}>
      <Box sx={{ 
        p: isMobile ? 1 : 4, 
        minHeight: '100vh', 
        background: greenTheme.background,
        pb: isMobile ? 7 : 0 // Add padding for bottom navigation on mobile
      }}>
        {/* Mobile Header */}
        {isMobile && (
          <AppBar position="fixed" sx={{ 
            top: 0, 
            left: 0, 
            right: 0,
            zIndex: 1100,
            backgroundColor: greenTheme.primary,
            color: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            <Toolbar sx={{ minHeight: 56 }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Staff Management
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setMobileFilterOpen(true)}
              >
                <FilterIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                background: greenTheme.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Staff Management
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleAddStaff}
                sx={{
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  fontSize: '1rem',
                  backgroundColor: greenTheme.primary,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: greenTheme.primaryDark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${greenTheme.primaryLight}40`
                  }
                }}
              >
                Add Staff Member
              </Button>
            </Box>

            {/* Desktop Search and Filter Bar */}
            <Paper sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: '16px',
              background: greenTheme.lightGradient,
              border: `1px solid ${greenTheme.accent}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search staff by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: greenTheme.primary }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'white',
                        '&:hover': {
                          boxShadow: `0 2px 8px ${greenTheme.primaryLight}20`
                        },
                        '&.Mui-focused': {
                          boxShadow: `0 2px 12px ${greenTheme.primaryLight}30`
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={filterRole}
                      label="Role"
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <MenuItem value="all">All Roles</MenuItem>
                      <MenuItem value="teacher">Teachers</MenuItem>
                      <MenuItem value="administrator">Administrators</MenuItem>
                      <MenuItem value="support">Support Staff</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Status"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Grid View">
                      <Button
                        variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                        onClick={() => setViewMode('grid')}
                        sx={{
                          backgroundColor: viewMode === 'grid' ? greenTheme.primary : 'transparent',
                          color: viewMode === 'grid' ? 'white' : greenTheme.primary,
                          borderColor: greenTheme.primary,
                          '&:hover': {
                            backgroundColor: viewMode === 'grid' ? greenTheme.primaryDark : greenTheme.hover
                          }
                        }}
                      >
                        Grid
                      </Button>
                    </Tooltip>
                    <Tooltip title="List View">
                      <Button
                        variant={viewMode === 'list' ? 'contained' : 'outlined'}
                        onClick={() => setViewMode('list')}
                        sx={{
                          backgroundColor: viewMode === 'list' ? greenTheme.primary : 'transparent',
                          color: viewMode === 'list' ? 'white' : greenTheme.primary,
                          borderColor: greenTheme.primary,
                          '&:hover': {
                            backgroundColor: viewMode === 'list' ? greenTheme.primaryDark : greenTheme.hover
                          }
                        }}
                      >
                        List
                      </Button>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                    disabled={activeFiltersCount === 0}
                    sx={{
                      borderColor: greenTheme.primary,
                      color: greenTheme.primary,
                      '&:hover': {
                        borderColor: greenTheme.primaryDark,
                        backgroundColor: greenTheme.hover
                      },
                      '&:disabled': {
                        borderColor: greenTheme.accent,
                        color: greenTheme.accent
                      }
                    }}
                  >
                    Clear Filters
                  </Button>
                </Grid>
              </Grid>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    Active filters:
                  </Typography>
                  {searchTerm && (
                    <Chip 
                      label={`Search: "${searchTerm}"`} 
                      size="small"
                      onDelete={() => setSearchTerm('')}
                      sx={{ backgroundColor: greenTheme.secondaryLight }}
                    />
                  )}
                  {filterRole !== 'all' && (
                    <Chip 
                      label={`Role: ${filterRole}`} 
                      size="small"
                      onDelete={() => setFilterRole('all')}
                      sx={{ backgroundColor: greenTheme.secondaryLight }}
                    />
                  )}
                  {filterStatus !== 'all' && (
                    <Chip 
                      label={`Status: ${filterStatus}`} 
                      size="small"
                      onDelete={() => setFilterStatus('all')}
                      sx={{ backgroundColor: greenTheme.secondaryLight }}
                    />
                  )}
                </Box>
              )}

              {/* Stats Summary */}
              <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<PersonIcon />} 
                  label={`Total: ${staffMembers.length}`} 
                  variant="outlined" 
                  sx={{ borderColor: greenTheme.primary, color: greenTheme.primary }}
                />
                <Chip 
                  icon={<TeacherIcon />} 
                  label={`Teachers: ${staffMembers.filter(s => s.role === 'teacher').length}`} 
                  sx={{ backgroundColor: greenTheme.primaryLight, color: 'white' }}
                />
                <Chip 
                  icon={<AdminIcon />} 
                  label={`Admins: ${staffMembers.filter(s => s.role === 'administrator').length}`} 
                  sx={{ backgroundColor: greenTheme.secondary, color: 'white' }}
                />
                <Chip 
                  icon={<SupportIcon />} 
                  label={`Support: ${staffMembers.filter(s => s.role === 'support').length}`} 
                  sx={{ backgroundColor: greenTheme.primaryDark, color: 'white' }}
                />
              </Box>
            </Paper>
          </Box>
        )}

        {/* Mobile Search Bar */}
        {isMobile && (
          <Box sx={{ mt: 7, mb: 2 }}>
            <Paper sx={{ 
              p: 2, 
              borderRadius: '16px',
              background: greenTheme.lightGradient,
              border: `1px solid ${greenTheme.accent}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              <TextField
                fullWidth
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: greenTheme.primary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    '&:hover': {
                      boxShadow: `0 2px 8px ${greenTheme.primaryLight}20`
                    },
                    '&.Mui-focused': {
                      boxShadow: `0 2px 12px ${greenTheme.primaryLight}30`
                    }
                  }
                }}
              />
            </Paper>
          </Box>
        )}

        {/* Mobile Filter Chips */}
        {isMobile && activeFiltersCount > 0 && (
          <Box sx={{ mb: 2, px: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {searchTerm && (
                <Chip 
                  label={`Search: "${searchTerm}"`} 
                  size="small"
                  onDelete={() => setSearchTerm('')}
                  sx={{ backgroundColor: greenTheme.secondaryLight }}
                />
              )}
              {filterRole !== 'all' && (
                <Chip 
                  label={`Role: ${filterRole}`} 
                  size="small"
                  onDelete={() => setFilterRole('all')}
                  sx={{ backgroundColor: greenTheme.secondaryLight }}
                />
              )}
              {filterStatus !== 'all' && (
                <Chip 
                  label={`Status: ${filterStatus}`} 
                  size="small"
                  onDelete={() => setFilterStatus('all')}
                  sx={{ backgroundColor: greenTheme.secondaryLight }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Staff Grid/List View */}
        {isMobile ? (
          // Mobile View - Always use card layout
          <Box sx={{ px: 1 }}>
            {paginatedStaff.map((staff, index) => (
              <MobileStaffCard key={staff.id} staff={staff} index={index} />
            ))}
          </Box>
        ) : (
          // Desktop View
          viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {paginatedStaff.map((staff, index) => (
                <Grid item xs={12} sm={6} md={4} key={staff.id}>
                  <Zoom in timeout={500 + index * 100}>
                    <Card sx={{ 
                      borderRadius: '16px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.3s ease',
                      background: greenTheme.paper,
                      border: `1px solid ${greenTheme.accent}`,
                      '&:hover': {
                        boxShadow: `0 10px 25px -3px ${greenTheme.primaryLight}20, 0 4px 6px -2px rgba(0, 0, 0, 0.05)`,
                        transform: 'translateY(-4px)',
                        borderColor: greenTheme.primaryLight
                      }
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={staff.avatar} sx={{ width: 56, height: 56, mr: 2, border: `2px solid ${greenTheme.primary}` }}>
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: greenTheme.primaryDark }}>
                                {staff.name}
                              </Typography>
                              <Chip
                                icon={getRoleIcon(staff.role)}
                                label={staff.role}
                                color={getRoleColor(staff.role)}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>
                          <IconButton 
                            onClick={(e) => handleMenuOpen(e, staff)}
                            sx={{ color: greenTheme.primary }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, mr: 1, color: greenTheme.primary }} />
                            <Typography variant="body2" color="text.secondary">
                              {staff.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, mr: 1, color: greenTheme.primary }} />
                            <Typography variant="body2" color="text.secondary">
                              {staff.phone}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationIcon sx={{ fontSize: 16, mr: 1, color: greenTheme.primary }} />
                            <Typography variant="body2" color="text.secondary">
                              {staff.department}
                            </Typography>
                          </Box>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: greenTheme.accent }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Performance
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {renderStars(staff.performance)}
                              <Typography variant="body2" sx={{ ml: 1, fontWeight: 600, color: greenTheme.primaryDark }}>
                                {staff.performance}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip 
                            label={staff.status} 
                            color={getStatusColor(staff.status)}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer component={Paper} sx={{ 
              borderRadius: '16px',
              background: greenTheme.paper,
              border: `1px solid ${greenTheme.accent}`,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
            }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: greenTheme.primary }}>
                    <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={() => handleRequestSort('name')}
                        sx={{ color: 'white', '&:hover': { color: 'white' } }}
                      >
                        Staff Member
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>
                      <TableSortLabel
                        active={orderBy === 'department'}
                        direction={orderBy === 'department' ? order : 'asc'}
                        onClick={() => handleRequestSort('department')}
                        sx={{ color: 'white', '&:hover': { color: 'white' } }}
                      >
                        Department
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>
                      <TableSortLabel
                        active={orderBy === 'performance'}
                        direction={orderBy === 'performance' ? order : 'asc'}
                        onClick={() => handleRequestSort('performance')}
                        sx={{ color: 'white', '&:hover': { color: 'white' } }}
                      >
                        Performance
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedStaff.map((staff, index) => (
                    <Slide in direction="up" timeout={300 + index * 50} key={staff.id}>
                      <TableRow 
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: greenTheme.hover,
                            transition: 'all 0.2s ease'
                          },
                          cursor: 'pointer'
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={staff.avatar} sx={{ mr: 2, border: `2px solid ${greenTheme.primary}` }}>
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: greenTheme.primaryDark }}>
                                {staff.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Joined {new Date(staff.joinDate).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{staff.email}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {staff.phone}
                          </Typography>
                        </TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>
                          <Chip
                            icon={getRoleIcon(staff.role)}
                            label={staff.role}
                            color={getRoleColor(staff.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {renderStars(staff.performance)}
                            <Typography variant="body2" sx={{ ml: 1, fontWeight: 600, color: greenTheme.primaryDark }}>
                              {staff.performance}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={staff.status} 
                            color={getStatusColor(staff.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={(e) => handleMenuOpen(e, staff)}
                            sx={{ color: greenTheme.primary }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </Slide>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}

        {/* Pagination */}
        {!isMobile && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStaff.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            sx={{ 
              mt: 2,
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: greenTheme.primaryDark
              }
            }}
          />
        )}

        {/* Mobile Pagination */}
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, px: 1 }}>
            <Button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              sx={{ color: greenTheme.primary }}
            >
              Previous
            </Button>
            <Typography sx={{ mx: 2, alignSelf: 'center' }}>
              {page + 1} of {Math.ceil(filteredStaff.length / rowsPerPage)}
            </Typography>
            <Button
              disabled={page >= Math.ceil(filteredStaff.length / rowsPerPage) - 1}
              onClick={() => setPage(page + 1)}
              sx={{ color: greenTheme.primary }}
            >
              Next
            </Button>
          </Box>
        )}

        {/* Mobile Floating Action Button */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddStaff}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 16,
              backgroundColor: greenTheme.primary,
              '&:hover': {
                backgroundColor: greenTheme.primaryDark
              }
            }}
          >
            <AddIcon />
          </Fab>
        )}

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <Paper sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0,
            zIndex: 1100,
            borderRadius: '16px 16px 0 0'
          }} elevation={3}>
            <BottomNavigation
              value={bottomNavValue}
              onChange={(event, newValue) => {
                setBottomNavValue(newValue);
                // Apply filters based on selected tab
                if (newValue === 0) {
                  setFilterRole('all');
                } else if (newValue === 1) {
                  setFilterRole('teacher');
                } else if (newValue === 2) {
                  setFilterRole('administrator');
                } else if (newValue === 3) {
                  setFilterRole('support');
                }
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                '& .MuiBottomNavigationAction-root': {
                  minWidth: 'auto',
                  padding: '6px 0',
                  '&.Mui-selected': {
                    color: greenTheme.primary
                  }
                }
              }}
            >
              <BottomNavigationAction label="All" icon={<PersonIcon />} />
              <BottomNavigationAction label="Teachers" icon={<TeacherIcon />} />
              <BottomNavigationAction label="Admins" icon={<AdminIcon />} />
              <BottomNavigationAction label="Support" icon={<SupportIcon />} />
            </BottomNavigation>
          </Paper>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: '8px',
              boxShadow: `0 4px 20px ${greenTheme.primaryLight}20`,
              border: `1px solid ${greenTheme.accent}`
            }
          }}
        >
          <MenuItem onClick={handleView}>
            <ViewIcon sx={{ mr: 2, color: greenTheme.primary }} />
            View Details
          </MenuItem>
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 2, color: greenTheme.primary }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleToggleStatusClick}>
            <NotificationsIcon sx={{ mr: 2, color: greenTheme.primary }} />
            {selectedStaff?.status === 'active' ? 'Deactivate' : 'Activate'}
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Staff Dialog - Add/Edit/View */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isSmallMobile}
          PaperProps={{
            sx: {
              borderRadius: isSmallMobile ? 0 : '16px',
              background: greenTheme.lightGradient,
              border: `1px solid ${greenTheme.accent}`
            }
          }}
        >
          <DialogTitle sx={{ 
            background: greenTheme.gradient,
            color: 'white',
            borderRadius: isSmallMobile ? 0 : '16px 16px 0 0'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {dialogType === 'add' ? 'Add New Staff Member' : 
               dialogType === 'edit' ? 'Edit Staff Member' : 'Staff Details'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {dialogType === 'view' && selectedStaff ? (
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenTheme.primary }}>
                    Personal Information
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Full Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedStaff.name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedStaff.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedStaff.phone}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedStaff.emergencyContact || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Address</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedStaff.address || 'N/A'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ borderColor: greenTheme.accent }} />
                </Grid>

                {/* Professional Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenTheme.primary }}>
                    Professional Information
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Role</Typography>
                        <Chip
                          icon={getRoleIcon(selectedStaff.role)}
                          label={selectedStaff.role}
                          color={getRoleColor(selectedStaff.role)}
                          sx={{ fontWeight: 600 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Department</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedStaff.department}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Join Date</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {new Date(selectedStaff.joinDate).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Chip 
                          label={selectedStaff.status} 
                          color={getStatusColor(selectedStaff.status)}
                          sx={{ fontWeight: 600 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Qualifications</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {selectedStaff.qualifications?.map((qual, index) => (
                            <Chip 
                              key={index} 
                              label={qual} 
                              size="small" 
                              variant="outlined"
                              sx={{ borderColor: greenTheme.primary, color: greenTheme.primary }}
                            />
                          )) || <Typography variant="body1">No qualifications listed</Typography>}
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Courses</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                          {selectedStaff.courses?.map((course, index) => (
                            <Chip 
                              key={index} 
                              label={course} 
                              size="small" 
                              sx={{ backgroundColor: greenTheme.secondaryLight }}
                            />
                          )) || <Typography variant="body1">No courses assigned</Typography>}
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ borderColor: greenTheme.accent }} />
                </Grid>

                {/* Performance */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenTheme.primary }}>
                    Performance
                  </Typography>
                  <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {renderStars(selectedStaff.performance)}
                        <Typography variant="h6" sx={{ ml: 1, fontWeight: 700, color: greenTheme.primaryDark }}>
                          {selectedStaff.performance}/5.0
                        </Typography>
                      </Box>
                      <Chip 
                        label={selectedStaff.performance >= 4.5 ? 'Excellent' : selectedStaff.performance >= 4.0 ? 'Good' : 'Needs Improvement'} 
                        color={selectedStaff.performance >= 4.5 ? 'success' : selectedStaff.performance >= 4.0 ? 'warning' : 'error'}
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Emergency Contact"
                    value={staffForm.emergencyContact}
                    onChange={(e) => setStaffForm({ ...staffForm, emergencyContact: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={staffForm.role}
                      label="Role"
                      onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    >
                      <MenuItem value="teacher">Teacher</MenuItem>
                      <MenuItem value="administrator">Administrator</MenuItem>
                      <MenuItem value="support">Support Staff</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    value={staffForm.department}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Join Date"
                    type="date"
                    value={staffForm.joinDate}
                    onChange={(e) => setStaffForm({ ...staffForm, joinDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={staffForm.status}
                      label="Status"
                      onChange={(e) => setStaffForm({ ...staffForm, status: e.target.value })}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={staffForm.address}
                    onChange={(e) => setStaffForm({ ...staffForm, address: e.target.value })}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Qualifications (comma separated)"
                    value={staffForm.qualifications}
                    onChange={(e) => setStaffForm({ ...staffForm, qualifications: e.target.value })}
                    placeholder="M.Sc Mathematics, B.Ed, etc."
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${greenTheme.accent}` }}>
            <Button 
              onClick={() => setOpenDialog(false)} 
              variant="outlined"
              sx={{
                borderColor: greenTheme.primary,
                color: greenTheme.primary,
                '&:hover': {
                  borderColor: greenTheme.primaryDark,
                  backgroundColor: greenTheme.hover
                }
              }}
            >
              {dialogType === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {(dialogType === 'add' || dialogType === 'edit') && (
              <Button 
                variant="contained" 
                onClick={handleSaveStaff}
                sx={{
                  backgroundColor: greenTheme.primary,
                  '&:hover': {
                    backgroundColor: greenTheme.primaryDark
                  }
                }}
              >
                {dialogType === 'add' ? 'Add Staff' : 'Save Changes'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              border: `1px solid ${greenTheme.accent}`
            }
          }}
        >
          <DialogTitle sx={{ color: 'error.main', fontWeight: 600 }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleDeleteConfirm} 
              variant="contained" 
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Status Change Confirmation Dialog */}
        <Dialog
          open={statusConfirmOpen}
          onClose={() => setStatusConfirmOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: '16px',
              border: `1px solid ${greenTheme.accent}`
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 600, color: greenTheme.primary }}>
            Confirm Status Change
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to {selectedStaff?.status === 'active' ? 'deactivate' : 'activate'} {selectedStaff?.name}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusConfirmOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleStatusConfirm} 
              variant="contained"
              sx={{
                backgroundColor: greenTheme.primary,
                '&:hover': {
                  backgroundColor: greenTheme.primaryDark
                }
              }}
            >
              {selectedStaff?.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={snackbar.severity} 
            variant="filled"
            sx={{
              borderRadius: '8px',
              backgroundColor: snackbar.severity === 'success' ? greenTheme.primary : undefined
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Mobile Components */}
        <MobileFilterDrawer />
        <MobileMenuDrawer />
      </Box>
    </Fade>
  );
};

export default StaffPage;