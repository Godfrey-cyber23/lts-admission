import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  LinearProgress,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Snackbar,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Pagination,
  Stack,
  Tooltip,
  Fade,
  Slide,
  Grow,
  Zoom,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  Fab,
  Paper,
  Divider,
  List as MuiList,
  ListItemButton,
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  IconButton as MuiIconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  FileDownload as DownloadIcon,
  Assessment as ReportIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  UploadFile as UploadIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  ListAlt as ListAltIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Description as DocxIcon,
  TableChart as ExcelIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon,
  Menu as MenuIcon,
  FilterAlt as FilterAltIcon,
  Person as PersonOutlineIcon,
  Home as HomeIcon,
  Class as ClassIcon
} from '@mui/icons-material';

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
  hover: 'rgba(76, 175, 80, 0.08)',
  highlight: 'rgba(76, 175, 80, 0.2)'
};

// School classes from Baby Class to Grade 7
const schoolClasses = [
  'Baby Class',
  'Middle Class',
  'Reception Class',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7'
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

// Sample student data with classes from Baby Class to Grade 7
const generateSampleStudents = () => {
  const students = [];
  let id = 1;
  
  schoolClasses.forEach(className => {
    const studentCount = Math.floor(Math.random() * 10) + 15; // 15-25 students per class
    const ageRange = {
      'Baby Class': { min: 3, max: 4 },
      'Middle Class': { min: 4, max: 5 },
      'Reception Class': { min: 5, max: 6 },
      'Grade 1': { min: 6, max: 7 },
      'Grade 2': { min: 7, max: 8 },
      'Grade 3': { min: 8, max: 9 },
      'Grade 4': { min: 9, max: 10 },
      'Grade 5': { min: 10, max: 11 },
      'Grade 6': { min: 11, max: 12 },
      'Grade 7': { min: 12, max: 13 }
    };
    
    const range = ageRange[className];
    
    for (let i = 0; i < studentCount; i++) {
      const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William'];
      const lastNames = ['Johnson', 'Smith', 'Brown', 'Davis', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson'];
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const age = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      const attendance = Math.floor(Math.random() * 15) + 85; // 85-100% attendance
      
      students.push({
        id: id++,
        name: `${firstName} ${lastName}`,
        age: age,
        grade: className,
        status: Math.random() > 0.1 ? 'active' : 'inactive',
        attendance: `${attendance}%`,
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`,
        class: className,
        enrolledDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
      });
    }
  });
  
  return students;
};

// Mobile Student Card Component
const MobileStudentCard = ({ student, index, onViewDetails, onMenuClick }) => {
  return (
    <Grow in timeout={900 + index * 50} key={student.id}>
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
              {student.avatar}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark, fontSize: '1rem' }}>
                {student.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {student.grade}
              </Typography>
            </Box>
            <Chip
              label={student.status}
              color={student.status === 'active' ? 'success' : 'warning'}
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
              <Typography variant="body1">{student.age} years</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Attendance</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinearProgress 
                  variant="determinate" 
                  value={parseInt(student.attendance)} 
                  sx={{ 
                    width: 60, 
                    height: 6, 
                    borderRadius: 3,
                    mr: 1,
                    backgroundColor: greenColors.accent,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: student.status === 'active' ? greenColors.light : '#f59e0b',
                      borderRadius: 3,
                      transition: 'all 0.5s ease'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {student.attendance}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1, pr: 1 }}>
              Enrolled: {student.enrolledDate}
            </Typography>
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
              onClick={(e) => onMenuClick(e, student)}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

// Mobile Stat Card Component
const MobileStatCard = ({ title, value, icon, color, subtitle, visible, index }) => (
  <Grow in={visible} timeout={500 + index * 150} key={title}>
    <Card sx={{ 
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      background: greenColors.lightGradient,
      border: `1px solid ${greenColors.accent}`,
      mb: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${color}20`
      }
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
              backgroundColor: `${color}15`,
              borderRadius: '8px',
              p: 1,
              mr: 2,
              color: color,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: `${color}25`
              }
            }}>
              {React.cloneElement(icon, { sx: { fontSize: 20 } })}
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: color }}>
                {value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {title}
              </Typography>
            </Box>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" sx={{ color: color, display: 'block', mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  </Grow>
);

const StudentsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState(generateSampleStudents());
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Animation states
  const [pageLoaded, setPageLoaded] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  
  // Dialog states
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [classListDialogOpen, setClassListDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [mobileFilterDrawerOpen, setMobileFilterDrawerOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  
  // Tab state for export dialog
  const [exportTab, setExportTab] = useState(0);
  const [mobileTabValue, setMobileTabValue] = useState(0);
  
  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Loading states for actions
  const [importing, setImporting] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // File input ref
  const fileInputRef = useRef(null);

  // Statistics
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    inactive: students.filter(s => s.status === 'inactive').length,
    avgAttendance: '94%'
  };

  useEffect(() => {
    // Trigger page animation after component mounts
    setTimeout(() => setPageLoaded(true), 100);
    
    // TODO: Fetch students data from API
    setLoading(false);
  }, []);

  useEffect(() => {
    // Trigger animations in sequence after page loads
    if (pageLoaded) {
      setTimeout(() => setStatsVisible(true), 300);
      setTimeout(() => setFiltersVisible(true), 600);
      setTimeout(() => setTableVisible(true), 900);
      setTimeout(() => setActionsVisible(true), 1200);
    }
  }, [pageLoaded]);

  const handleMenuClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  // Highlight search term in text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? 
            <span key={i} style={{ backgroundColor: greenColors.highlight, fontWeight: 'bold' }}>{part}</span> : 
            part
        )}
      </span>
    );
  };

  // Apply filters to students
  const getFilteredStudents = () => {
    let filtered = students;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }
    
    // Class filter
    if (classFilter !== 'all') {
      filtered = filtered.filter(student => student.class === classFilter);
    }
    
    // Attendance filter
    if (attendanceFilter !== 'all') {
      filtered = filtered.filter(student => {
        const attendance = parseInt(student.attendance);
        switch (attendanceFilter) {
          case 'high':
            return attendance >= 95;
          case 'medium':
            return attendance >= 85 && attendance < 95;
          case 'low':
            return attendance < 85;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const filteredStudents = getFilteredStudents();
  
  // Pagination
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Check if any filters are active
  const hasActiveFilters = searchTerm || statusFilter !== 'all' || classFilter !== 'all' || attendanceFilter !== 'all';
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setClassFilter('all');
    setAttendanceFilter('all');
    setPage(0);
  };

  // Show notification
  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Import Students functionality
  const handleImportStudents = () => {
    setImportDialogOpen(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImporting(true);
      // Simulate file processing
      setTimeout(() => {
        // Simulate adding new students from file
        const newStudents = [
          { id: students.length + 1, name: 'New Student 1', age: 6, grade: 'Grade 1', status: 'active', attendance: '90%', avatar: 'NS1', class: 'Grade 1', enrolledDate: new Date().toISOString().split('T')[0] },
          { id: students.length + 2, name: 'New Student 2', age: 7, grade: 'Grade 2', status: 'active', attendance: '88%', avatar: 'NS2', class: 'Grade 2', enrolledDate: new Date().toISOString().split('T')[0] }
        ];
        setStudents([...students, ...newStudents]);
        setImporting(false);
        setImportDialogOpen(false);
        showNotification(`Successfully imported ${newStudents.length} students!`, 'success');
      }, 2000);
    }
  };

  const handleDropFile = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Generate Reports functionality
  const handleGenerateReports = () => {
    setReportDialogOpen(true);
  };

  const generateStudentReport = (reportType) => {
    setGeneratingReport(true);
    
    setTimeout(() => {
      let csvContent = '';
      let filename = '';
      
      switch(reportType) {
        case 'all':
          filename = `all-students-${new Date().toISOString().split('T')[0]}.csv`;
          csvContent = generateAllStudentsCSV();
          break;
        case 'attendance':
          filename = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
          csvContent = generateAttendanceCSV();
          break;
        case 'classes':
          filename = `class-list-${new Date().toISOString().split('T')[0]}.csv`;
          csvContent = generateClassListCSV();
          break;
        default:
          return;
      }
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      
      setGeneratingReport(false);
      setReportDialogOpen(false);
      showNotification(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`, 'success');
    }, 1500);
  };

  const generateAllStudentsCSV = () => {
    const headers = ['ID', 'Name', 'Age', 'Grade', 'Class', 'Status', 'Attendance', 'Enrolled Date'];
    const rows = students.map(s => [
      s.id,
      s.name,
      s.age,
      s.grade,
      s.class,
      s.status,
      s.attendance,
      s.enrolledDate
    ]);
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const generateAttendanceCSV = () => {
    const headers = ['Name', 'Class', 'Attendance %', 'Status'];
    const rows = students.map(s => [
      s.name,
      s.class,
      s.attendance,
      s.status
    ]);
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const generateClassListCSV = () => {
    const classes = [...new Set(students.map(s => s.class))];
    let csvContent = 'Class,Student Name,Age,Status\n';
    
    classes.forEach(className => {
      const classStudents = students.filter(s => s.class === className);
      classStudents.forEach(student => {
        csvContent += `"${className}","${student.name}",${student.age},"${student.status}"\n`;
      });
    });
    
    return csvContent;
  };

  // Class Lists functionality
  const handleClassLists = () => {
    setClassListDialogOpen(true);
  };

  const getClassStudents = (className) => {
    return students.filter(s => s.class === className);
  };

  // Export specific class functionality
  const handleExportClass = (className) => {
    setSelectedClass(className);
    setExportDialogOpen(true);
  };

  const handleExportFormat = (format) => {
    setExportFormat(format);
    setExporting(true);
    
    setTimeout(() => {
      const classStudents = getClassStudents(selectedClass);
      
      switch(format) {
        case 'excel':
          exportClassToExcel(classStudents, selectedClass);
          break;
        case 'pdf':
          exportClassToPDF(classStudents, selectedClass);
          break;
        case 'docx':
          exportClassToDocx(classStudents, selectedClass);
          break;
        default:
          break;
      }
      
      setExporting(false);
      setExportDialogOpen(false);
      showNotification(`Class ${selectedClass} exported as ${format.toUpperCase()} successfully!`, 'success');
    }, 2000);
  };

  const exportClassToExcel = (classStudents, className) => {
    // Create a proper Excel file using a table-based approach
    // This will create a downloadable file that Excel can open
    
    // Create HTML table content
    let tableContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>${className} Class List</h2>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Enrolled Date</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    // Add student data
    classStudents.forEach(student => {
      tableContent += `
        <tr>
          <td>${student.name}</td>
          <td>${student.age}</td>
          <td>${student.status}</td>
          <td>${student.attendance}</td>
          <td>${student.enrolledDate}</td>
        </tr>
      `;
    });
    
    tableContent += `
            </tbody>
          </table>
          <p>Total Students: ${classStudents.length}</p>
        </body>
      </html>
    `;
    
    // Create a blob and download
    const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${className}-class-list-${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportClassToPDF = (classStudents, className) => {
    // Create a print-friendly view and trigger browser print
    const printWindow = window.open('', '_blank');
    
    // Build the HTML content as a string
    let htmlContent = `<!DOCTYPE html>
      <html>
        <head>
          <title>${className} Class List</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            h1 { 
              color: #2e7d32; 
              text-align: center; 
              margin-bottom: 10px;
            }
            h2 { 
              text-align: center; 
              margin-bottom: 20px;
            }
            .subtitle { 
              text-align: center; 
              margin-bottom: 30px;
              font-style: italic;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f2f2f2; 
              font-weight: bold;
            }
            tr:nth-child(even) { 
              background-color: #f9f9f9; 
            }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 12px; 
            }
            .page-break {
              page-break-after: always;
            }
            @media print {
              .no-print { display: none; }
              body { margin: 10px; }
              th { background-color: #f2f2f2 !important; }
            }
          </style>
        </head>
        <body>
          <h1>Literacy Tree School</h1>
          <h2>${className} Class List</h2>
          <p class="subtitle">Generated on: ${new Date().toLocaleDateString()}</p>
          
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Enrolled Date</th>
              </tr>
            </thead>
            <tbody>`;
    
    // Add student data with pagination
    const studentsPerPage = 25;
    let studentCount = 0;
    
    classStudents.forEach((student, index) => {
      studentCount++;
      
      // Add page break after certain number of students
      if (studentCount > 1 && studentCount % studentsPerPage === 1) {
        htmlContent += `
            </tbody>
          </table>
          <div class="page-break"></div>
          <h2>${className} Class List (continued)</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Age</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Enrolled Date</th>
              </tr>
            </thead>
            <tbody>`;
      }
      
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${student.name}</td>
          <td>${student.age}</td>
          <td>${student.status}</td>
          <td>${student.attendance}</td>
          <td>${student.enrolledDate}</td>
        </tr>`;
    });
    
    htmlContent += `
            </tbody>
          </table>
          <div class="footer">
            <p>Total Students: ${classStudents.length}</p>
            <p>Generated by Literacy Tree School Management System</p>
          </div>
        </body>
      </html>`;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for the content to load before printing
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const exportClassToDocx = (classStudents, className) => {
    // Create an RTF (Rich Text Format) file that can be opened by Word
    // This avoids the need for external libraries
    
    let rtfContent = '{\\rtf1\\ansi\\deff0';
    rtfContent += '{\\fonttbl{\\f0 Times New Roman;}}';
    rtfContent += '{\\colortbl;\\red0\\green0\\blue0;\\red0\\green100\\blue0;}';
    rtfContent += '\\f0\\fs24';
    
    // Title
    rtfContent += '{\\pard\\qc\\b\\fs32 ' + className + ' Class List\\par}';
    rtfContent += '{\\pard\\qc\\i\\fs24 Generated on: ' + new Date().toLocaleDateString() + '\\par}';
    rtfContent += '{\\pard\\qc\\b\\fs24 Total Students: ' + classStudents.length + '\\par}';
    rtfContent += '\\par\\par';
    
    // Table header
    rtfContent += '{\\pard\\b\\fs24 Name\\tab Age\\tab Status\\tab Attendance\\tab Enrolled Date\\par}';
    rtfContent += '{\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par}';
    
    // Table rows
    classStudents.forEach(student => {
      rtfContent += '{\\pard\\fs24 ' + student.name + '\\tab ' + student.age + '\\tab ' + 
                   student.status + '\\tab ' + student.attendance + '\\tab ' + student.enrolledDate + '\\par}';
    });
    
    rtfContent += '}';
    
    // Create a blob and download
    const blob = new Blob([rtfContent], { type: 'application/rtf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${className}-class-list-${new Date().toISOString().split('T')[0]}.rtf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrintClass = (className) => {
    // Use the same function as PDF export but with print focus
    exportClassToPDF(getClassStudents(className), className);
  };

  const handleMobileTabChange = (event, newValue) => {
    setMobileTabValue(newValue);
  };

  const toggleMobileFilterDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMobileFilterDrawerOpen(open);
  };

  // Stat Cards Component
  const StatCard = ({ title, value, icon, color, subtitle, visible, index }) => (
    <Grow 
      in={visible} 
      timeout={500 + index * 150} 
      style={{ transformOrigin: '0 0 0' }}
    >
      <Card sx={{ 
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        background: greenColors.lightGradient,
        border: `1px solid ${greenColors.accent}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 30px ${color}20`
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
                {value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ color: color }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box sx={{ 
              backgroundColor: `${color}15`,
              borderRadius: '12px',
              p: 1.5,
              color: color,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                backgroundColor: `${color}25`
              }
            }}>
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

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
          Loading Students...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={pageLoaded} timeout={800}>
      <Box sx={{ p: isMobile ? 2 : 4, backgroundColor: greenColors.background, minHeight: '100vh' }}>
        {/* Mobile Header */}
        {isMobile && (
          <AppBar 
            position="fixed" 
            sx={{ 
              top: 0, 
              left: 0, 
              right: 0,
              zIndex: 1100,
              backgroundColor: greenColors.primary,
              color: 'white',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            <Toolbar sx={{ minHeight: 56 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Students
              </Typography>
              <MuiIconButton
                edge="start"
                color="inherit"
                onClick={() => setMobileFilterDrawerOpen(true)}
              >
                <FilterAltIcon />
              </MuiIconButton>
            </Toolbar>
          </AppBar>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <Slide direction="down" in={pageLoaded} timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                color: greenColors.dark,
                background: greenColors.gradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Students Management
              </Typography>
              <Zoom in={pageLoaded} timeout={1200}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: greenColors.primary,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: greenColors.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Add Student
                </Button>
              </Zoom>
            </Box>
          </Slide>
        )}

        {/* Mobile Search Bar */}
        {isMobile && (
          <Slide direction="up" in={pageLoaded} timeout={1200}>
            <Card sx={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              mb: 3,
              mt: isMobile ? 8 : 0,
              background: greenColors.lightGradient,
              border: `1px solid ${greenColors.accent}`
            }}>
              <CardContent sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search students..."
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
                          onClick={() => setMobileFilterDrawerOpen(true)}
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

        {/* Mobile Statistics */}
        {isMobile && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MobileStatCard 
                  title="Total" 
                  value={stats.total} 
                  icon={<GroupIcon />}
                  color={greenColors.primary}
                  visible={statsVisible}
                  index={0}
                />
              </Grid>
              <Grid item xs={6}>
                <MobileStatCard 
                  title="Active" 
                  value={stats.active} 
                  icon={<PersonIcon />}
                  color={greenColors.light}
                  subtitle={`${Math.round((stats.active / stats.total) * 100)}%`}
                  visible={statsVisible}
                  index={1}
                />
              </Grid>
              <Grid item xs={6}>
                <MobileStatCard 
                  title="Inactive" 
                  value={stats.inactive} 
                  icon={<PersonOutlineIcon />}
                  color="#f59e0b"
                  visible={statsVisible}
                  index={2}
                />
              </Grid>
              <Grid item xs={6}>
                <MobileStatCard 
                  title="Avg Attendance" 
                  value={stats.avgAttendance} 
                  icon={<AssessmentIcon />}
                  color={greenColors.accent}
                  visible={statsVisible}
                  index={3}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Desktop Statistics */}
        {!isMobile && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Total Students" 
                value={stats.total} 
                icon={<GroupIcon />}
                color={greenColors.primary}
                visible={statsVisible}
                index={0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Active Students" 
                value={stats.active} 
                icon={<PersonIcon />}
                color={greenColors.light}
                subtitle={`${Math.round((stats.active / stats.total) * 100)}% of total`}
                visible={statsVisible}
                index={1}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Inactive Students" 
                value={stats.inactive} 
                icon={<PersonIcon />}
                color="#f59e0b"
                visible={statsVisible}
                index={2}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                title="Avg Attendance" 
                value={stats.avgAttendance} 
                icon={<AssessmentIcon />}
                color={greenColors.accent}
                visible={statsVisible}
                index={3}
              />
            </Grid>
          </Grid>
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
              value={mobileTabValue}
              onChange={handleMobileTabChange}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                '& .MuiBottomNavigationAction-root': {
                  minWidth: 'auto',
                  padding: '6px 0',
                  '&.Mui-selected': {
                    color: greenColors.primary
                  }
                }
              }}
            >
              <BottomNavigationAction label="Students" icon={<PersonIcon />} value={0} />
              <BottomNavigationAction label="Classes" icon={<ClassIcon />} value={1} />
              <BottomNavigationAction label="Reports" icon={<AssessmentIcon />} value={2} />
              <BottomNavigationAction label="Actions" icon={<ListAltIcon />} value={3} />
            </BottomNavigation>
          </Paper>
        )}

        {/* Mobile Tab Content */}
        {isMobile && (
          <Box>
            {mobileTabValue === 0 && (
              <Box>
                {/* Search and Filters */}
                <Slide direction="up" in={filtersVisible} timeout={1200}>
                  <Card sx={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    mb: 3,
                    background: greenColors.lightGradient,
                    border: `1px solid ${greenColors.accent}`
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark }}>
                          Filters
                        </Typography>
                        {hasActiveFilters && (
                          <Chip 
                            label="Active"
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
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {searchTerm && (
                          <Chip 
                            label={`Search: ${searchTerm}`}
                            onDelete={() => setSearchTerm('')}
                            color="primary"
                            size="small"
                            sx={{ 
                              backgroundColor: greenColors.primary, 
                              color: 'white',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        )}
                        {statusFilter !== 'all' && (
                          <Chip 
                            label={`Status: ${statusFilter}`}
                            onDelete={() => setStatusFilter('all')}
                            color="primary"
                            size="small"
                            sx={{ 
                              backgroundColor: greenColors.primary, 
                              color: 'white',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        )}
                        {classFilter !== 'all' && (
                          <Chip 
                            label={`Class: ${classFilter}`}
                            onDelete={() => setClassFilter('all')}
                            color="primary"
                            size="small"
                            sx={{ 
                              backgroundColor: greenColors.primary, 
                              color: 'white',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        )}
                        {attendanceFilter !== 'all' && (
                          <Chip 
                            label={`Attendance: ${attendanceFilter}`}
                            onDelete={() => setAttendanceFilter('all')}
                            color="primary"
                            size="small"
                            sx={{ 
                              backgroundColor: greenColors.primary, 
                              color: 'white',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        )}
                      </Box>
                      
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={clearAllFilters}
                        sx={{
                          borderColor: greenColors.primary,
                          color: greenColors.primary,
                          mt: 1,
                          '&:hover': {
                            borderColor: greenColors.dark,
                            backgroundColor: greenColors.hover,
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        Clear All
                      </Button>
                    </CardContent>
                  </Card>
                </Slide>

                {/* Results Summary */}
                <Zoom in={filtersVisible} timeout={1400}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Showing {filteredStudents.length} of {students.length} students
                    </Typography>

                    {filteredStudents.length === 0 ? (
                      <Card sx={{
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        background: greenColors.lightGradient,
                        border: `1px solid ${greenColors.accent}`,
                        mt: 2
                      }}>
                        <CardContent sx={{ textAlign: 'center', py: 6 }}>
                          <PersonIcon sx={{ fontSize: 48, color: greenColors.accent, mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No students found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm || statusFilter !== 'all' || classFilter !== 'all' || attendanceFilter !== 'all'
                              ? 'Try adjusting your filters or search terms'
                              : 'No students found'
                            }
                          </Typography>
                        </CardContent>
                      </Card>
                    ) : (
                      filteredStudents.map((student, index) => (
                        <MobileStudentCard
                          key={student.id}
                          student={student}
                          index={index}
                          onMenuClick={handleMenuClick}
                        />
                      ))
                    )}
                  </Box>
                </Zoom>

                {/* Mobile Pagination */}
                {filteredStudents.length > rowsPerPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={Math.ceil(filteredStudents.length / rowsPerPage)}
                      page={page}
                      onChange={handleChangePage}
                      color="primary"
                      size="small"
                      sx={{
                        '& .MuiPaginationItem-root': {
                          color: greenColors.primary,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1)'
                          }
                        },
                        '& .Mui-selected': {
                          backgroundColor: greenColors.primary,
                          color: 'white'
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {mobileTabValue === 1 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark, mb: 3 }}>
                  Classes Overview
                </Typography>
                <Grid container spacing={2}>
                  {schoolClasses.map((className, index) => (
                    <Grow in={true} timeout={500 + index * 100} key={className}>
                      <Card sx={{
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
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark, fontSize: '1rem' }}>
                              {className}
                            </Typography>
                            <Chip 
                              label={`${getClassStudents(className).length} students`}
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
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleExportClass(className)}
                            sx={{
                              borderColor: greenColors.primary,
                              color: greenColors.primary,
                              '&:hover': {
                                borderColor: greenColors.dark,
                                backgroundColor: greenColors.hover,
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Export
                          </Button>
                        </CardContent>
                      </Card>
                    </Grow>
                  ))}
                </Grid>
              </Box>
            )}

            {mobileTabValue === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Grow in={true} timeout={500}>
                      <Card sx={{
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
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <UploadIcon sx={{ fontSize: 32, color: greenColors.primary, mb: 1 }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Import Students
                          </Typography>
                        </CardContent>
                        <Box sx={{ p: 1, pt: 0 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={handleImportStudents}
                            sx={{
                              backgroundColor: greenColors.primary,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: greenColors.dark,
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Import
                          </Button>
                        </Box>
                      </Card>
                    </Grow>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grow in={true} timeout={700}>
                      <Card sx={{
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
                        <CardContent sx={{ p: 2, textAlign: 'center' }}>
                          <ReportIcon sx={{ fontSize: 32, color: greenColors.primary, mb: 1 }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            Generate Reports
                          </Typography>
                        </CardContent>
                        <Box sx={{ p: 1, pt: 0 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={handleGenerateReports}
                            sx={{
                              backgroundColor: greenColors.primary,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: greenColors.dark,
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            Reports
                          </Button>
                        </Box>
                      </Card>
                    </Grow>
                  </Grid>
                </Grid>
              </Box>
            )}

            {mobileTabValue === 3 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.dark, mb: 3 }}>
                  Recent Activity
                </Typography>
                <Card sx={{
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
                    {[
                      { action: 'New student enrolled', student: 'Emma Johnson', time: '2 hours ago' },
                      { action: 'Attendance updated', student: 'Liam Smith', time: '4 hours ago' },
                      { action: 'Grade promotion', student: 'Olivia Brown', time: '1 day ago' }
                    ].map((activity, index) => (
                      <Grow 
                        in={true} 
                        timeout={900 + index * 200} 
                        key={index}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            transform: 'translateX(4px)'
                          }
                        }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {activity.action}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.student}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      </Grow>
                    ))}
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        )}

        {/* Mobile Filter Drawer */}
        {isMobile && (
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
                    <SchoolIcon sx={{ mr: 1, color: greenColors.primary }} />
                    <Typography>Class</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    {schoolClasses.map(option => (
                      <Grid item xs={6} key={option}>
                        <Button
                          fullWidth
                          variant={classFilter === option ? "contained" : "outlined"}
                          onClick={() => {
                            setClassFilter(option);
                            toggleMobileFilterDrawer(false)();
                          }}
                          sx={{
                            borderColor: greenColors.primary,
                            color: classFilter === option ? 'white' : greenColors.primary,
                            backgroundColor: classFilter === option ? greenColors.primary : 'transparent',
                            '&:hover': {
                              backgroundColor: greenColors.hover,
                              borderColor: greenColors.dark
                            }
                          }}
                        >
                          {option}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssessmentIcon sx={{ mr: 1, color: greenColors.primary }} />
                    <Typography>Attendance</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={1}>
                    {[
                      { value: 'all', label: 'All Attendance' },
                      { value: 'high', label: 'High (95%+)' },
                      { value: 'medium', label: 'Medium (85-94%)' },
                      { value: 'low', label: 'Low (<85%)' }
                    ].map(option => (
                      <Grid item xs={6} key={option.value}>
                        <Button
                          fullWidth
                          variant={attendanceFilter === option.value ? "contained" : "outlined"}
                          onClick={() => {
                            setAttendanceFilter(option.value);
                            toggleMobileFilterDrawer(false)();
                          }}
                          sx={{
                            borderColor: greenColors.primary,
                            color: attendanceFilter === option.value ? 'white' : greenColors.primary,
                            backgroundColor: attendanceFilter === option.value ? greenColors.primary : 'transparent',
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
                  clearAllFilters();
                  toggleMobileFilterDrawer(false)();
                }}
                sx={{
                  borderColor: greenColors.primary,
                  color: greenColors.primary,
                  mt: 2,
                  '&:hover': {
                    borderColor: 'transparent',
                    backgroundColor: greenColors.hover
                  }
                }}
              >
                Clear All Filters
              </Button>
            </Box>
          </SwipeableDrawer>
        )}

        {/* Desktop Search and Filters */}
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search students by name or grade..."
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
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => setFilterDialogOpen(true)}
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
                        Filters
                      </Button>
                      {hasActiveFilters && (
                        <Tooltip title="Clear all filters">
                          <Button
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={clearAllFilters}
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
                            Clear
                          </Button>
                        </Tooltip>
                      )}
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleGenerateReports}
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
                        Export
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Applied Filters */}
                {hasActiveFilters && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {searchTerm && (
                      <Grow in={true} timeout={1300}>
                        <Chip 
                          label={`Search: ${searchTerm}`}
                          onDelete={() => setSearchTerm('')}
                          color="primary"
                          size="small"
                          sx={{ 
                            backgroundColor: greenColors.primary, 
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </Grow>
                    )}
                    {statusFilter !== 'all' && (
                      <Grow in={true} timeout={1400}>
                        <Chip 
                          label={`Status: ${statusFilter}`}
                          onDelete={() => setStatusFilter('all')}
                          color="primary"
                          size="small"
                          sx={{ 
                            backgroundColor: greenColors.primary, 
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </Grow>
                    )}
                    {classFilter !== 'all' && (
                      <Grow in={true} timeout={1500}>
                        <Chip 
                          label={`Class: ${classFilter}`}
                          onDelete={() => setClassFilter('all')}
                          color="primary"
                          size="small"
                          sx={{ 
                            backgroundColor: greenColors.primary, 
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </Grow>
                    )}
                    {attendanceFilter !== 'all' && (
                      <Grow in={true} timeout={1600}>
                        <Chip 
                          label={`Attendance: ${attendanceFilter}`}
                          onDelete={() => setAttendanceFilter('all')}
                          color="primary"
                          size="small"
                          sx={{ 
                            backgroundColor: greenColors.primary, 
                            color: 'white',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </Grow>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Slide>
        )}

        {/* Results Summary */}
        {!isMobile && (
          <Zoom in={filtersVisible} timeout={1400}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredStudents.length} of {students.length} students
              </Typography>
            </Box>
          </Zoom>
        )}

        {/* Students Table - Desktop */}
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
                        <TableCell sx={{ fontWeight: 600, color: 'white' }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white' }}>Age</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white' }}>Grade</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white' }}>Attendance</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: 'white' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedStudents.map((student, index) => (
                        <Grow 
                          in={tableVisible} 
                          timeout={900 + index * 50} 
                          key={student.id}
                        >
                          <TableRow 
                            sx={{ 
                              '&:hover': { backgroundColor: greenColors.hover },
                              cursor: 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={(e) => handleMenuClick(e, student)}
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
                                  {student.avatar}
                                </Avatar>
                                <Typography variant="body1" sx={{ fontWeight: 500, color: greenColors.dark }}>
                                  {highlightText(student.name, searchTerm)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>{student.age} years</TableCell>
                            <TableCell sx={{ py: 2 }}>{highlightText(student.grade, searchTerm)}</TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip 
                                label={student.status}
                                color={student.status === 'active' ? 'success' : 'warning'}
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
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={parseInt(student.attendance)} 
                                  sx={{ 
                                    width: 60, 
                                    height: 6, 
                                    borderRadius: 3,
                                    backgroundColor: greenColors.accent,
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: student.status === 'active' ? greenColors.light : '#f59e0b',
                                      borderRadius: 3,
                                      transition: 'all 0.5s ease'
                                    }
                                  }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {student.attendance}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <IconButton 
                                size="small"
                                onClick={(e) => handleMenuClick(e, student)}
                                sx={{ 
                                  color: greenColors.primary,
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.1)',
                                    backgroundColor: greenColors.hover
                                  }
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        </Grow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {paginatedStudents.length} of {filteredStudents.length} students
                  </Typography>
                  <Pagination
                    count={Math.ceil(filteredStudents.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: greenColors.primary,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      },
                      '& .Mui-selected': {
                        backgroundColor: greenColors.primary,
                        color: 'white'
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grow>
        )}

        {/* Quick Actions Card - Desktop */}
        {!isMobile && (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={4}>
              <Grow 
                in={actionsVisible} 
                timeout={500} 
                style={{ transformOrigin: '0 0 0' }}
              >
                <Card sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  background: greenColors.lightGradient,
                  border: `1px solid ${greenColors.accent}`,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenColors.dark }}>
                      Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button 
                        variant="outlined" 
                        startIcon={<UploadIcon />}
                        fullWidth
                        onClick={handleImportStudents}
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
                        Import Students
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<ReportIcon />}
                        fullWidth
                        onClick={handleGenerateReports}
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
                        Generate Reports
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<ListAltIcon />}
                        fullWidth
                        onClick={handleClassLists}
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
                        Class Lists
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grow 
                in={actionsVisible} 
                timeout={700} 
                style={{ transformOrigin: '0 0 0' }}
              >
                <Card sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  background: greenColors.lightGradient,
                  border: `1px solid ${greenColors.accent}`,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: greenColors.dark }}>
                      Recent Activity
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { action: 'New student enrolled', student: 'Emma Johnson', time: '2 hours ago' },
                        { action: 'Attendance updated', student: 'Liam Smith', time: '4 hours ago' },
                        { action: 'Grade promotion', student: 'Olivia Brown', time: '1 day ago' }
                      ].map((activity, index) => (
                        <Grow 
                          in={actionsVisible} 
                          timeout={900 + index * 200} 
                          key={index}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              transform: 'translateX(4px)'
                            }
                          }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {activity.action}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {activity.student}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {activity.time}
                            </Typography>
                          </Box>
                        </Grow>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        )}

        {/* Filter Dialog */}
        <Dialog 
          open={filterDialogOpen} 
          onClose={() => setFilterDialogOpen(false)}
          maxWidth="sm"
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
            Filter Students
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
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
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="class-filter-label">Class</InputLabel>
                <Select
                  labelId="class-filter-label"
                  value={classFilter}
                  label="Class"
                  onChange={(e) => setClassFilter(e.target.value)}
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
                  <MenuItem value="all">All Classes</MenuItem>
                  {schoolClasses.map((className) => (
                    <MenuItem key={className} value={className}>
                      {className}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel id="attendance-filter-label">Attendance</InputLabel>
                <Select
                  labelId="attendance-filter-label"
                  value={attendanceFilter}
                  label="Attendance"
                  onChange={(e) => setAttendanceFilter(e.target.value)}
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
                  <MenuItem value="all">All Attendance</MenuItem>
                  <MenuItem value="high">High (95%+)</MenuItem>
                  <MenuItem value="medium">Medium (85-94%)</MenuItem>
                  <MenuItem value="low">Low (&lt;85%)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={clearAllFilters}
              variant="outlined"
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
              Clear All
            </Button>
            <Button 
              onClick={() => setFilterDialogOpen(false)}
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
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

        {/* Import Students Dialog */}
        <Dialog 
          open={importDialogOpen} 
          onClose={() => setImportDialogOpen(false)}
          maxWidth="sm"
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
            Import Students
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box
              sx={{
                border: '2px dashed',
                borderColor: greenColors.primary,
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderColor: greenColors.dark,
                  transform: 'scale(1.02)'
                }
              }}
              onDrop={handleDropFile}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {importing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress sx={{ color: greenColors.primary }} />
                  <Typography>Importing students...</Typography>
                </Box>
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 48, color: greenColors.primary, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Drop CSV file here or click to browse
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Supported format: CSV with columns: Name, Age, Grade, Class
                  </Typography>
                </>
              )}
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".csv"
              style={{ display: 'none' }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => setImportDialogOpen(false)}
              variant="outlined"
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
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Generate Reports Dialog */}
        <Dialog 
          open={reportDialogOpen} 
          onClose={() => setReportDialogOpen(false)}
          maxWidth="sm"
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
            Generate Reports
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <List>
              <ListItem 
                button 
                onClick={() => generateStudentReport('all')}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: greenColors.hover,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon>
                  <GroupIcon sx={{ color: greenColors.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="All Students Report" 
                  secondary="Complete list of all students with their details" 
                />
              </ListItem>
              <ListItem 
                button 
                onClick={() => generateStudentReport('attendance')}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: greenColors.hover,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon>
                  <AssessmentIcon sx={{ color: greenColors.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Attendance Report" 
                  secondary="Student attendance statistics and records" 
                />
              </ListItem>
              <ListItem 
                button 
                onClick={() => generateStudentReport('classes')}
                sx={{ 
                  borderRadius: 2,
                  mb: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: greenColors.hover,
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon>
                  <SchoolIcon sx={{ color: greenColors.primary }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Class List Report" 
                  secondary="Students organized by their classes" 
                />
              </ListItem>
            </List>
            {generatingReport && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, justifyContent: 'center' }}>
                <CircularProgress size={20} sx={{ color: greenColors.primary }} />
                <Typography variant="body2">Generating report...</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => setReportDialogOpen(false)}
              variant="outlined"
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
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Class Lists Dialog */}
        <Dialog 
          open={classListDialogOpen} 
          onClose={() => setClassListDialogOpen(false)}
          maxWidth="lg"
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
            Class Lists
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Select a class to view, print, or export:
            </Typography>
            
            {schoolClasses.map((className) => (
              <Accordion 
                key={className} 
                sx={{ 
                  mb: 1, 
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon sx={{ color: greenColors.primary }} />}
                  sx={{ 
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.primary }}>
                    {className}
                  </Typography>
                  <Chip 
                    label={`${getClassStudents(className).length} students`}
                    size="small"
                    sx={{ 
                      ml: 2, 
                      backgroundColor: greenColors.primary, 
                      color: 'white',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Total Students: {getClassStudents(className).length}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<PrintIcon />}
                        onClick={() => handlePrintClass(className)}
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
                        Print
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleExportClass(className)}
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
                        Export
                      </Button>
                    </Box>
                  </Box>
                  
                  <List dense>
                    {getClassStudents(className).map((student, studentIndex) => (
                      <Grow 
                        in={true} 
                        timeout={100 + studentIndex * 50} 
                        key={student.id}
                      >
                        <ListItem sx={{ 
                          py: 0.5,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: greenColors.hover,
                            transform: 'translateX(4px)'
                          }
                        }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 2,
                              backgroundColor: greenColors.primary,
                              fontSize: '12px',
                              fontWeight: 600,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            {student.avatar}
                          </Avatar>
                          <ListItemText 
                            primary={student.name}
                            secondary={`Age: ${student.age} • ${student.status}`}
                          />
                          <Chip 
                            label={student.attendance}
                            size="small"
                            color={student.status === 'active' ? 'success' : 'warning'}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                        </ListItem>
                      </Grow>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => setClassListDialogOpen(false)}
              variant="outlined"
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
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Format Dialog */}
        <Dialog 
          open={exportDialogOpen} 
          onClose={() => setExportDialogOpen(false)}
          maxWidth="sm"
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
            Export {selectedClass} Class List
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" gutterBottom>
              Select the export format:
            </Typography>
            
            <Tabs value={exportTab} onChange={(e, newValue) => setExportTab(newValue)} sx={{ mb: 2 }}>
              <Tab label="Excel" icon={<ExcelIcon />} />
              <Tab label="PDF" icon={<PdfIcon />} />
              <Tab label="Word" icon={<DocxIcon />} />
            </Tabs>
            
            {exportTab === 0 && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Export as Excel spreadsheet (.xls) with all student details.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ExcelIcon />}
                  onClick={() => handleExportFormat('excel')}
                  disabled={exporting}
                  sx={{
                    backgroundColor: greenColors.primary,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: greenColors.dark,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {exporting ? 'Exporting...' : 'Export as Excel'}
                </Button>
              </Box>
            )}
            
            {exportTab === 1 && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Export as PDF document with formatted class list and pagination.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<PdfIcon />}
                  onClick={() => handleExportFormat('pdf')}
                  disabled={exporting}
                  sx={{
                    backgroundColor: greenColors.primary,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: greenColors.dark,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {exporting ? 'Exporting...' : 'Export as PDF'}
                </Button>
              </Box>
            )}
            
            {exportTab === 2 && (
              <Box>
                <Typography variant="body2" gutterBottom>
                  Export as Rich Text Format (.rtf) document that can be opened in Word.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<DocxIcon />}
                  onClick={() => handleExportFormat('docx')}
                  disabled={exporting}
                  sx={{
                    backgroundColor: greenColors.primary,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: greenColors.dark,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {exporting ? 'Exporting...' : 'Export as Word'}
                </Button>
              </Box>
            )}
            
            {exporting && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, justifyContent: 'center' }}>
                <CircularProgress size={20} sx={{ color: greenColors.primary }} />
                <Typography variant="body2">Exporting {selectedClass} class list...</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={() => setExportDialogOpen(false)}
              variant="outlined"
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
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
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
            onClick={handleMenuClose} 
            sx={{ 
              color: greenColors.primary,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: greenColors.hover
              }
            }}
          >
            <ViewIcon sx={{ mr: 1, fontSize: 20 }} />
            View Details
          </MenuItem>
          <MenuItem 
            onClick={handleMenuClose} 
            sx={{ 
              color: greenColors.primary,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: greenColors.hover
              }
            }}
          >
            <EditIcon sx={{ mr: 1, fontSize: 20 }} />
            Edit Student
          </MenuItem>
          <MenuItem 
            onClick={handleMenuClose} 
            sx={{ 
              color: greenColors.primary,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: greenColors.hover
              }
            }}
          >
            <ReportIcon sx={{ mr: 1, fontSize: 20 }} />
            Generate Report
          </MenuItem>
        </Menu>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Slide}
          direction="up"
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

export default StudentsPage;