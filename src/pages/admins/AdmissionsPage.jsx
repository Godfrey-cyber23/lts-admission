import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    MenuItem,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    Divider,
    Paper,
    Menu,
    ListItemIcon,
    ListItemText,
    Chip,
    Snackbar,
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
    ListItemButton,
    SwipeableDrawer,
    Fab,
    Hidden
} from '@mui/material';
import {
    Visibility as ViewIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    PictureAsPdf as PdfIcon,
    Description as DocxIcon,
    TableChart as ExcelIcon,
    Check as CheckIcon,
    Error as ErrorIcon,
    ExpandMore as ExpandMoreIcon,
    Menu as MenuIcon,
    FilterAlt as FilterAltIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Info as InfoIcon
} from '@mui/icons-material';
import api from '../../api/api';

// Custom green color palette
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

// Mobile Admission Card Component
const MobileAdmissionCard = ({ admission, index, onViewDetails, onExportMenuOpen }) => {
    return (
        <Grow in timeout={900 + index * 100} key={admission.id}>
            <Card sx={{
                mb: 2,
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                background: greenColors.lightGradient,
                border: `1px solid ${greenColors.accent}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                }
            }}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                mr: 2,
                                backgroundColor: greenColors.primary,
                                fontSize: '16px',
                                fontWeight: 600
                            }}
                        >
                            {admission.childFirstName?.charAt(0)}{admission.childSurname?.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark, fontSize: '1rem' }}>
                                {admission.childFirstName} {admission.childSurname}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {admission.programApplied || 'General Admission'}
                            </Typography>
                        </Box>
                        <Chip
                            label={admission.status?.replace('_', ' ') || 'pending'}
                            color={getStatusColor(admission.status)}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                        />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Age</Typography>
                            <Typography variant="body1">{admission.childAge || 'N/A'} years</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Applied</Typography>
                            <Typography variant="body1">
                                {new Date(admission.createdAt || admission.created_at).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, pr: 1 }}>
                            {admission.fathersName || 'N/A'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                size="small"
                                sx={{
                                    color: greenColors.primary,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        backgroundColor: greenColors.hover
                                    }
                                }}
                                onClick={() => onViewDetails(admission)}
                            >
                                <ViewIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        backgroundColor: greenColors.hover
                                    }
                                }}
                                onClick={(e) => onExportMenuOpen(e, admission)}
                            >
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Grow>
    );
};

// Helper function to get status color
const getStatusColor = (status) => {
    const colors = {
        pending: 'warning',
        under_review: 'info',
        accepted: 'success',
        rejected: 'error'
    };
    return colors[status] || 'default';
};

const AdmissionsPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [admissions, setAdmissions] = useState([]);
    const [filteredAdmissions, setFilteredAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
    const [selectedRecordForExport, setSelectedRecordForExport] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [pageLoaded, setPageLoaded] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [tableVisible, setTableVisible] = useState(false);
    const [mobileFilterDrawerOpen, setMobileFilterDrawerOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Status options for filter
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'under_review', label: 'Under Review' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' }
    ];

    // Date filter options
    const dateOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
    ];

    const filterAdmissions = useCallback(() => {
        let filtered = admissions;

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(admission =>
                admission.childFirstName?.toLowerCase().includes(term) ||
                admission.childSurname?.toLowerCase().includes(term) ||
                admission.fathersName?.toLowerCase().includes(term) ||
                admission.mothersName?.toLowerCase().includes(term) ||
                admission.status?.toLowerCase().includes(term)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(admission => admission.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(admission => {
                const admissionDate = new Date(admission.createdAt || admission.created_at);

                switch (dateFilter) {
                    case 'today':
                        return admissionDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return admissionDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                        return admissionDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        setFilteredAdmissions(filtered);
    }, [admissions, searchTerm, statusFilter, dateFilter]);

    useEffect(() => {
        fetchAdmissions();
        // Trigger page animation after component mounts
        setTimeout(() => setPageLoaded(true), 100);
    }, []);

    useEffect(() => {
        // Trigger animations in sequence after data is loaded
        if (admissions.length > 0) {
            setTimeout(() => setFiltersVisible(true), 300);
            setTimeout(() => setTableVisible(true), 600);
        }
    }, [admissions]);

    // Apply filters whenever dependencies change
    useEffect(() => {
        filterAdmissions();
    }, [filterAdmissions]);

    const fetchAdmissions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admissions');
            setAdmissions(response.data.data?.admissions || []);
        } catch (err) {
            console.error('Failed to fetch admissions:', err);
            setError('Failed to load admissions data');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (admission) => {
        setSelectedAdmission(admission);
        setDetailDialogOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailDialogOpen(false);
        setSelectedAdmission(null);
    };

    const handleRefresh = () => {
        fetchAdmissions();
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    const handleExportAll = () => {
        // Simple CSV export functionality for all records
        const headers = ['Child Name', 'Age', 'Program', 'Status', 'Applied Date', 'Father', 'Mother'];
        const csvData = filteredAdmissions.map(admission => [
            `${admission.childFirstName} ${admission.childSurname}`,
            admission.childAge || 'N/A',
            admission.programApplied || 'N/A',
            admission.status,
            new Date(admission.createdAt || admission.created_at).toLocaleDateString(),
            admission.fathersName || 'N/A',
            admission.mothersName || 'N/A'
        ]);

        const csvContent = [headers, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `admissions-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);

        setNotification({
            open: true,
            message: 'All admissions exported successfully!',
            severity: 'success'
        });
    };

    const handleExportRecord = (event, admission, format) => {
        event.stopPropagation();
        setSelectedRecordForExport(admission);
        switch (format) {
            case 'csv':
                exportSingleToCSV(admission);
                break;
            case 'pdf':
                exportSingleToPDF(admission);
                break;
            case 'docx':
                exportSingleToDocx(admission);
                break;
            default:
                break;
        }
        setExportMenuAnchor(null);
    };

    const exportSingleToCSV = (admission) => {
        const headers = ['Child Name', 'Age', 'Program', 'Status', 'Applied Date', 'Father', 'Mother'];
        const csvData = [
            `${admission.childFirstName} ${admission.childSurname}`,
            admission.childAge || 'N/A',
            admission.programApplied || 'N/A',
            admission.status,
            new Date(admission.createdAt || admission.created_at).toLocaleDateString(),
            `${admission.fathersName || 'N/A'}`,
            `${admission.mothersName || 'N/A'}`
        ];

        const csvContent = [headers, csvData].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${admission.childFirstName}_${admission.childSurname}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);

        setNotification({
            open: true,
            message: 'Admission record exported as CSV!',
            severity: 'success'
        });
    };

    const exportSingleToPDF = (admission) => {
        // Create a print-friendly view and trigger browser print
        const printWindow = window.open('', '_blank');

        // Build the HTML content as a string
        const htmlContent = `<!DOCTYPE html>
      <html>
        <head>
          <title>Admission Details</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px;
            }
            h1 { 
              color: #2e7d32; 
              margin-bottom: 10px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-row {
              display: flex;
              margin-bottom: 10px;
            }
            .info-label {
              width: 150px;
              font-weight: bold;
              color: #2e7d32;
            }
            .info-value {
              flex: 1;
            }
            .status-badge {
              padding: 4px 8px;
              border-radius: 4px;
              font-weight: 600;
              text-align: center;
            }
            .status-pending {
              background-color: #fff3cd;
              color: #f57c00;
            }
            .status-under_review {
              background-color: #2196f3;
              color: white;
            }
            .status-accepted {
              background-color: #4caf50;
              color: white;
            }
            .status-rejected {
              background-color: #f44336;
              color: white;
            }
            @media print {
              body { margin: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Admission Details</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <div class="info-label">Child Name</div>
              <div class="info-value">${admission.childFirstName} ${admission.childSurname}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Age</div>
              <div class="info-value">${admission.childAge || 'N/A'} years</div>
            </div>
            <div class="info-row">
              <div class="info-label">Program</div>
              <div class="info-value">${admission.programApplied || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Status</div>
              <div class="info-value">
                <span class="status-badge status-${admission.status || 'pending'}">
                  ${admission.status?.replace('_', ' ') || 'pending'}
                </span>
              </div>
            </div>
            <div class="info-row">
              <div class="info-label">Applied Date</div>
              <div class="info-value">
                ${new Date(admission.createdAt || admission.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-row">
              <div class="info-label">Father's Name</div>
              <div class="info-value">${admission.fathersName || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Father's Contact</div>
              <div class="info-value">${admission.fathersContact || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Mother's Name</div>
              <div class="info-value">${admission.mothersName || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Mother's Contact</div>
              <div class="info-value">${admission.mothersContact || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Address</div>
              <div class="info-value">${admission.residentialAddress || 'N/A'}</div>
            </div>
          </div>
        </body>
      </html>`;

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for the content to load before printing
        printWindow.onload = function () {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };

        setNotification({
            open: true,
            message: 'Admission record exported as PDF!',
            severity: 'success'
        });
    };

    const exportSingleToDocx = (admission) => {
        // Create an RTF (Rich Text Format) file that can be opened by Word
        let rtfContent = '{\\rtf1\\ansi\\deff0';
        rtfContent += '{\\fonttbl{\\f0 Times New Roman;}}';
        rtfContent += '{\\colortbl;\\red0\\green0\\blue0;}';
        rtfContent += '\\f0\\fs24';

        // Title
        rtfContent += '{\\pard\\qc\\b\\fs32 Admission Details\\par}';
        rtfContent += '{\\pard\\qc\\i\\fs24 Generated on: ' + new Date().toLocaleDateString() + '\\par}';

        // Child Information
        rtfContent += '{\\pard\\b\\fs24 Child Information\\par}';
        rtfContent += '{\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par}';

        rtfContent += '{\\pard\\fs24 Name\\tab Age\\tab Status\\tab Applied Date\\tab\\par}';
        rtfContent += '{\\pard\\fs24 ' + (admission.childFirstName || '') + ' ' + (admission.childSurname || '') + '\\tab ' + (admission.childAge || 'N/A') + ' years\\tab ' + (admission.status || 'pending') + '\\tab ' + new Date(admission.createdAt || admission.created_at).toLocaleDateString() + '\\par}';

        // Parent Information
        rtfContent += '{\\pard\\b\\fs24 Parent Information\\par}';
        rtfContent += '{\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par}';

        // Fixed line - properly escaped apostrophes
        rtfContent += '{\\pard\\fs24 Father\\\'s Name\\tab Father\\\'s Contact\\tab Mother\\\'s Name\\tab Mother\\\'s Contact\\tab Address\\par}';
        rtfContent += '{\\pard\\fs24 ' + (admission.fathersName || 'N/A') + '\\tab ' + (admission.fathersContact || 'N/A') + '\\tab ' + (admission.mothersName || 'N/A') + '\\tab ' + (admission.mothersContact || 'N/A') + '\\par}';

        rtfContent += '{\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par}';

        rtfContent += '{\\pard\\fs24 Address\\tab ' + (admission.residentialAddress || 'N/A') + '\\par}';

        // Application Details
        rtfContent += '{\\pard\\b\\fs24 Application Details\\par}';
        rtfContent += '{\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par}';

        rtfContent += '{\\pard\\fs24 Applied Date\\tab Status\\par}';
        rtfContent += '{\\pard\\fs24 ' + new Date(admission.createdAt || admission.created_at).toLocaleDateString() + '\\tab ' + (admission.status || 'pending') + '\\par}';

        rtfContent += '}';

        // Create a blob and download
        const blob = new Blob([rtfContent], { type: 'application/rtf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${admission.childFirstName}_${admission.childSurname}_${new Date().toISOString().split('T')[0]}.rtf`;
        link.click();
        window.URL.revokeObjectURL(url);

        setNotification({
            open: true,
            message: 'Admission record exported as Word document!',
            severity: 'success'
        });
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const toggleMobileFilterDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setMobileFilterDrawerOpen(open);
    };

    if (loading && admissions.length === 0) {
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
                    Loading Admissions...
                </Typography>
            </Box>
        );
    }

    return (
        <Fade in={pageLoaded} timeout={800}>
            <Box sx={{ p: isMobile ? 2 : 4, backgroundColor: greenColors.background, minHeight: '100vh' }}>
                {/* Header */}
                <Slide direction="down" in={pageLoaded} timeout={1000}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant={isMobile ? "h5" : "h4"} sx={{
                            fontWeight: 700,
                            color: greenColors.dark,
                            background: greenColors.gradient,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Admissions Management
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                startIcon={<RefreshIcon />}
                                onClick={handleRefresh}
                                variant="outlined"
                                size={isMobile ? "small" : "medium"}
                                sx={{
                                    borderColor: greenColors.primary,
                                    color: greenColors.primary,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: greenColors.dark,
                                        backgroundColor: greenColors.hover,
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                {isMobile ? '' : 'Refresh'}
                            </Button>
                            <Button
                                startIcon={<DownloadIcon />}
                                onClick={handleExportAll}
                                variant="contained"
                                disabled={filteredAdmissions.length === 0}
                                size={isMobile ? "small" : "medium"}
                                sx={{
                                    backgroundColor: greenColors.primary,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: greenColors.dark,
                                        transform: 'translateY(-2px)'
                                    },
                                    '&:disabled': {
                                        backgroundColor: greenColors.accent
                                    }
                                }}
                            >
                                {isMobile ? '' : 'Export All'}
                            </Button>
                        </Box>
                    </Box>
                </Slide>

                {error && (
                    <Grow in={!!error} timeout={500}>
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    </Grow>
                )}

                {/* Mobile Search Bar */}
                {isMobile && (
                    <Slide direction="up" in={pageLoaded} timeout={1200}>
                        <Card sx={{
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                            mb: 3,
                            background: greenColors.lightGradient,
                            border: `1px solid ${greenColors.accent}`
                        }}>
                            <CardContent sx={{ p: 2 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search admissions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: greenColors.primary }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={toggleMobileFilterDrawer(true)}
                                                    sx={{ color: greenColors.primary }}
                                                >
                                                    <FilterAltIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: greenColors.accent
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: greenColors.primary
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: greenColors.primary
                                            },
                                            transition: 'all 0.3s ease'
                                        }
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Slide>
                )}

                {/* Filters Card - Desktop */}
                {!isMobile && (
                    <Slide direction="up" in={filtersVisible} timeout={1200}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            mb: 3,
                            background: greenColors.lightGradient,
                            border: `1px solid ${greenColors.accent}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                            }
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <FilterIcon sx={{ mr: 1, color: greenColors.primary }} />
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark }}>
                                        Filters & Search
                                    </Typography>
                                </Box>

                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            fullWidth
                                            placeholder="Search by child name, parent name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon sx={{ color: greenColors.primary }} />
                                                    </InputAdornment>
                                                ),
                                                sx: {
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: greenColors.accent
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: greenColors.primary
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: greenColors.primary
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Status"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: greenColors.accent
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: greenColors.primary
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: greenColors.primary
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {statusOptions.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Date Range"
                                            value={dateFilter}
                                            onChange={(e) => setDateFilter(e.target.value)}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: greenColors.accent
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: greenColors.primary
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: greenColors.primary
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {dateOptions.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} md={2}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setStatusFilter('all');
                                                setDateFilter('all');
                                            }}
                                            sx={{
                                                borderColor: greenColors.primary,
                                                color: greenColors.primary,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: greenColors.dark,
                                                    backgroundColor: greenColors.hover,
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            Clear Filters
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Slide>
                )}

                {/* Results Summary */}
                <Zoom in={filtersVisible} timeout={1400}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Showing {filteredAdmissions.length} of {admissions.length} applications
                        </Typography>
                        {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' ? (
                            <Chip
                                label="Filters Active"
                                size="small"
                                sx={{
                                    backgroundColor: greenColors.primary,
                                    color: 'white',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)'
                                    }
                                }}
                            />
                        ) : null}
                    </Box>
                </Zoom>

                {/* Mobile Filter Drawer */}
                <SwipeableDrawer
                    anchor="bottom"
                    open={mobileFilterDrawerOpen}
                    onClose={toggleMobileFilterDrawer(false)}
                    onOpen={toggleMobileFilterDrawer(true)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            borderTopLeftRadius: '16px',
                            borderTopRightRadius: '16px',
                            maxHeight: '70vh',
                            overflow: 'auto'
                        }
                    }}
                >
                    <Box sx={{ p: 3, pt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark }}>
                                Filters
                            </Typography>
                            <IconButton onClick={toggleMobileFilterDrawer(false)}>
                                <ExpandMoreIcon />
                            </IconButton>
                        </Box>
                        
                        <Accordion sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FilterIcon sx={{ mr: 1, color: greenColors.primary }} />
                                    <Typography>Status</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={1}>
                                    {statusOptions.map(option => (
                                        <Grid item xs={6} key={option.value}>
                                            <Button
                                                fullWidth
                                                variant={statusFilter === option.value ? "contained" : "outlined"}
                                                onClick={() => {
                                                    setStatusFilter(option.value);
                                                    toggleMobileFilterDrawer(false)();
                                                }}
                                                sx={{
                                                    borderColor: greenColors.primary,
                                                    color: statusFilter === option.value ? 'white' : greenColors.primary,
                                                    backgroundColor: statusFilter === option.value ? greenColors.primary : 'transparent',
                                                    '&:hover': {
                                                        backgroundColor: greenColors.hover,
                                                        borderColor: greenColors.dark
                                                    }
                                                }}
                                            >
                                                {option.label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        
                        <Accordion sx={{ mb: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarIcon sx={{ mr: 1, color: greenColors.primary }} />
                                    <Typography>Date Range</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={1}>
                                    {dateOptions.map(option => (
                                        <Grid item xs={6} key={option.value}>
                                            <Button
                                                fullWidth
                                                variant={dateFilter === option.value ? "contained" : "outlined"}
                                                onClick={() => {
                                                    setDateFilter(option.value);
                                                    toggleMobileFilterDrawer(false)();
                                                }}
                                                sx={{
                                                    borderColor: greenColors.primary,
                                                    color: dateFilter === option.value ? 'white' : greenColors.primary,
                                                    backgroundColor: dateFilter === option.value ? greenColors.primary : 'transparent',
                                                    '&:hover': {
                                                        backgroundColor: greenColors.hover,
                                                        borderColor: greenColors.dark
                                                    }
                                                }}
                                            >
                                                {option.label}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setDateFilter('all');
                                toggleMobileFilterDrawer(false)();
                            }}
                            sx={{
                                borderColor: greenColors.primary,
                                color: greenColors.primary,
                                mt: 2,
                                '&:hover': {
                                    borderColor: greenColors.dark,
                                    backgroundColor: greenColors.hover
                                }
                            }}
                        >
                            Clear All Filters
                        </Button>
                    </Box>
                </SwipeableDrawer>

                {/* Admissions Table - Desktop */}
                {!isMobile && (
                    <Grow in={tableVisible} timeout={800}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            background: greenColors.lightGradient,
                            border: `1px solid ${greenColors.accent}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                            }
                        }}>
                            <CardContent sx={{ p: 0 }}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: greenColors.primary }}>
                                                <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Child Information</TableCell>
                                                <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Age</TableCell>
                                                <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Parents</TableCell>
                                                <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Applied Date</TableCell>
                                                <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 600, py: 2, color: 'white' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredAdmissions.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <SearchIcon sx={{ fontSize: 48, color: greenColors.accent, mb: 2 }} />
                                                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                                                No admissions found
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                                                                    ? 'Try adjusting your filters or search terms'
                                                                    : 'No admission applications have been submitted yet'
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredAdmissions.map((admission, index) => (
                                                    <Grow
                                                        in={tableVisible}
                                                        timeout={900 + index * 100}
                                                        key={admission.id}
                                                    >
                                                        <TableRow
                                                            sx={{
                                                                '&:hover': { backgroundColor: greenColors.hover },
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onClick={() => handleViewDetails(admission)}
                                                        >
                                                            <TableCell sx={{ py: 2 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: greenColors.dark }}>
                                                                            {admission.childFirstName} {admission.childSurname}
                                                                        </Typography>
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            {admission.programApplied || 'General Admission'}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell sx={{ py: 2 }}>
                                                                {admission.childAge || 'N/A'} years
                                                            </TableCell>
                                                            <TableCell sx={{ py: 2 }}>
                                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                    {admission.fathersName || 'N/A'}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {admission.mothersName || 'N/A'}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ py: 2 }}>
                                                                {new Date(admission.createdAt || admission.created_at).toLocaleDateString()}
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {new Date(admission.createdAt || admission.created_at).toLocaleTimeString()}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ py: 2 }}>
                                                                <Chip
                                                                    label={admission.status?.replace('_', ' ') || 'pending'}
                                                                    color={getStatusColor(admission.status)}
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        transition: 'all 0.3s ease',
                                                                        '&:hover': {
                                                                            transform: 'scale(1.05)'
                                                                        }
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell sx={{ py: 2 }}>
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{
                                                                            color: greenColors.primary,
                                                                            transition: 'all 0.3s ease',
                                                                            '&:hover': {
                                                                                transform: 'scale(1.1)',
                                                                                backgroundColor: greenColors.hover
                                                                            }
                                                                        }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleViewDetails(admission);
                                                                        }}
                                                                    >
                                                                        <ViewIcon />
                                                                    </IconButton>
                                                                    <IconButton
                                                                        size="small"
                                                                        sx={{
                                                                            transition: 'all 0.3s ease',
                                                                            '&:hover': {
                                                                                transform: 'scale(1.1)',
                                                                                backgroundColor: greenColors.hover
                                                                            }
                                                                        }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setExportMenuAnchor(e.currentTarget);
                                                                            setSelectedRecordForExport(admission);
                                                                        }}
                                                                    >
                                                                        <DownloadIcon />
                                                                    </IconButton>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    </Grow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grow>
                )}

                {/* Mobile Cards View */}
                {isMobile && (
                    <Box>
                        {filteredAdmissions.length === 0 ? (
                            <Card sx={{
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                background: greenColors.lightGradient,
                                border: `1px solid ${greenColors.accent}`,
                                mt: 2
                            }}>
                                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                                    <SearchIcon sx={{ fontSize: 48, color: greenColors.accent, mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        No admissions found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                                            ? 'Try adjusting your filters or search terms'
                                            : 'No admission applications have been submitted yet'
                                        }
                                    </Typography>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredAdmissions.map((admission, index) => (
                                <MobileAdmissionCard
                                    key={admission.id}
                                    admission={admission}
                                    index={index}
                                    onViewDetails={handleViewDetails}
                                    onExportMenuOpen={handleExportRecord}
                                />
                            ))
                        )}
                    </Box>
                )}

                {/* Mobile Floating Action Button */}
                {isMobile && (
                    <Fab
                        color="primary"
                        aria-label="export"
                        onClick={handleExportAll}
                        disabled={filteredAdmissions.length === 0}
                        sx={{
                            position: 'fixed',
                            bottom: 16,
                            right: 16,
                            backgroundColor: greenColors.primary,
                            '&:hover': {
                                backgroundColor: greenColors.dark
                            },
                            '&:disabled': {
                                backgroundColor: greenColors.accent
                            }
                        }}
                    >
                        <DownloadIcon />
                    </Fab>
                )}

                {/* Admission Details Dialog */}
                <Dialog
                    open={detailDialogOpen}
                    onClose={handleCloseDetails}
                    maxWidth="md"
                    fullWidth
                    TransitionComponent={Slide}
                    transitionDuration={300}
                    PaperProps={{
                        sx: {
                            borderRadius: '16px',
                            background: greenColors.lightGradient,
                            border: `1px solid ${greenColors.accent}`,
                            transition: 'all 0.3s ease'
                        }
                    }}
                >
                    <DialogTitle sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        pb: 2,
                        background: greenColors.gradient,
                        color: 'white',
                        borderRadius: '16px 16px 0 0'
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            Admission Details
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        {selectedAdmission && (
                            <Grid container spacing={3}>
                                {/* Child Information */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenColors.primary }}>
                                        Child Information
                                    </Typography>
                                    <Paper sx={{
                                        p: 2,
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                        }
                                    }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">First Name</Typography>
                                                <Typography variant="body1">{selectedAdmission.childFirstName}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Surname</Typography>
                                                <Typography variant="body1">{selectedAdmission.childSurname}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                                                <Typography variant="body1">
                                                    {selectedAdmission.childDob ? new Date(selectedAdmission.childDob).toLocaleDateString() : 'N/A'}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Age</Typography>
                                                <Typography variant="body1">{selectedAdmission.childAge || 'N/A'} years</Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ borderColor: greenColors.accent }} />
                                </Grid>

                                {/* Parent Information */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenColors.primary }}>
                                        Parent Information
                                    </Typography>
                                    <Paper sx={{
                                        p: 2,
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                        }
                                    }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Father's Name</Typography>
                                                <Typography variant="body1">{selectedAdmission.fathersName || 'N/A'}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Father's Contact</Typography>
                                                <Typography variant="body1">{selectedAdmission.fathersContact || 'N/A'}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Mother's Name</Typography>
                                                <Typography variant="body1">{selectedAdmission.mothersName || 'N/A'}</Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Mother's Contact</Typography>
                                                <Typography variant="body1">{selectedAdmission.mothersContact || 'N/A'}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="body2" color="text.secondary">Address</Typography>
                                                <Typography variant="body1">{selectedAdmission.residentialAddress || 'N/A'}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ borderColor: greenColors.accent }} />
                                </Grid>

                                {/* Application Details */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenColors.primary }}>
                                        Application Details
                                    </Typography>
                                    <Paper sx={{
                                        p: 2,
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                        }
                                    }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Applied Date</Typography>
                                                <Typography variant="body1">
                                                    {new Date(selectedAdmission.createdAt || selectedAdmission.created_at).toLocaleDateString()}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="body2" color="text.secondary">Status</Typography>
                                                <Chip
                                                    label={selectedAdmission.status?.replace('_', ' ') || 'pending'}
                                                    color={getStatusColor(selectedAdmission.status)}
                                                    sx={{
                                                        fontWeight: 600,
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.05)'
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Button
                            onClick={handleCloseDetails}
                            variant="outlined"
                            sx={{
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: greenColors.primary,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: greenColors.dark,
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            Update Status
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Export Menu for Individual Records */}
                <Menu
                    anchorEl={exportMenuAnchor}
                    open={Boolean(exportMenuAnchor)}
                    onClose={() => setExportMenuAnchor(null)}
                    TransitionComponent={Fade}
                    PaperProps={{
                        sx: {
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                            border: `1px solid ${greenColors.accent}`
                        }
                    }}
                >
                    <MenuItem
                        onClick={(e) => handleExportRecord(e, selectedRecordForExport, 'csv')}
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: greenColors.hover
                            }
                        }}
                    >
                        <ListItemIcon>
                            <ExcelIcon sx={{ fontSize: 20, color: greenColors.primary }} />
                        </ListItemIcon>
                        <ListItemText primary="Export as CSV" />
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => handleExportRecord(e, selectedRecordForExport, 'pdf')}
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: greenColors.hover
                            }
                        }}
                    >
                        <ListItemIcon>
                            <PdfIcon sx={{ fontSize: 20, color: greenColors.primary }} />
                        </ListItemIcon>
                        <ListItemText primary="Export as PDF" />
                    </MenuItem>
                    <MenuItem
                        onClick={(e) => handleExportRecord(e, selectedRecordForExport, 'docx')}
                        sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: greenColors.hover
                            }
                        }}
                    >
                        <ListItemIcon>
                            <DocxIcon sx={{ fontSize: 20, color: greenColors.primary }} />
                        </ListItemIcon>
                        <ListItemText primary="Export as Word" />
                    </MenuItem>
                </Menu>

                {/* Notification Snackbar */}
                <Snackbar
                    open={notification.open}
                    autoHideDuration={6000}
                    onClose={handleCloseNotification}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    TransitionComponent={Slide}
                    transitionDuration={{ enter: 300, exit: 300 }}
                >
                    <Alert
                        onClose={handleCloseNotification}
                        severity={notification.severity}
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: notification.severity === 'success' ? greenColors.primary : undefined,
                            transition: 'all 0.3s ease'
                        }}
                        icon={notification.severity === 'success' ? <CheckIcon /> : <ErrorIcon />}
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Fade>
    );
};

export default AdmissionsPage;