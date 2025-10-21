import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  TextField,
  MenuItem,
  Fab,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  TablePagination,
  Menu,
  Snackbar,
  Fade,
  Slide,
  Grow,
  useMediaQuery,
  useTheme,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Hidden
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Sports as SportsIcon,
  Celebration as CelebrationIcon,
  Today as TodayIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Description as ExcelIcon,
  Clear as ClearIcon,
  AttachMoney as MoneyIcon,
  Checkroom as AttireIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Fruit colors for different grades
const gradeColors = {
  'Grade 1': '#FF9E80', // Light orange
  'Grade 2': '#FFCC80', // Lighter orange
  'Grade 3': '#FFF176', // Light yellow
  'Grade 4': '#DCE775', // Light green
  'Grade 5': '#AED581', // Medium green
  'Grade 6': '#81C784', // Green
  'Grade 7': '#4DB6AC', // Teal,
};

// Mock data for events (replace with API calls)
const mockEvents = [
  {
    id: 1,
    title: 'Parent-Teacher Meeting',
    description: 'Quarterly parent-teacher meeting to discuss student progress',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    startTime: '14:00',
    endTime: '16:00',
    location: 'School Auditorium',
    type: 'academic',
    attendees: 45,
    status: 'upcoming',
    organizer: 'Principal Office',
    grade: 'Grade 5',
    audience: {
      parents: true,
      teachers: true,
      pupils: {
        included: true,
        grades: ['Grade 5'],
        classTeachers: ['Ms. Johnson', 'Mr. Smith']
      }
    },
    requirements: {
      participationFee: 0,
      attire: 'Formal',
      materials: 'Student progress reports',
      notes: 'Please bring any questions about your child\'s progress'
    }
  },
  {
    id: 4,
    title: 'Cultural Festival',
    description: 'Annual cultural festival showcasing student talents',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    startTime: '11:00',
    endTime: '17:00',
    location: 'Main Campus',
    type: 'cultural',
    attendees: 200,
    status: 'upcoming',
    organizer: 'Cultural Committee',
    grade: 'Grade 6',
    audience: {
      parents: true,
      teachers: true,
      pupils: {
        included: true,
        grades: ['Grade 6', 'Grade 7', 'Grade 8'],
        classTeachers: ['All Class Teachers']
      }
    },
    requirements: {
      participationFee: 15,
      attire: 'Traditional costume',
      materials: 'Performance props',
      notes: 'Parents are invited to attend the evening show'
    }
  }
];

const EventsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pageLoaded, setPageLoaded] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD for input type="date"
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    type: 'academic',
    attendees: 0,
    organizer: '',
    grade: 'Grade 1',
    audience: {
      parents: true,
      teachers: true,
      pupils: {
        included: true,
        grades: [],
        classTeachers: []
      }
    },
    requirements: {
      participationFee: 0,
      attire: '',
      materials: '',
      notes: ''
    }
  });

  const eventTypes = [
    { value: 'academic', label: 'Academic', icon: <SchoolIcon />, color: '#2e7d32' },
    { value: 'sports', label: 'Sports', icon: <SportsIcon />, color: '#388e3c' },
    { value: 'cultural', label: 'Cultural', icon: <CelebrationIcon />, color: '#43a047' },
    { value: 'other', label: 'Other', icon: <EventIcon />, color: '#4caf50' }
  ];

  const grades = Object.keys(gradeColors);

  // Helper functions - moved before usage
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = (date) => {
    return new Date(date) >= new Date();
  };

  const getDaysUntilEvent = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEventTypeIcon = (type) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.icon : <EventIcon />;
  };

  const getEventTypeColor = (type) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType ? eventType.color : '#4caf50';
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    fetchEvents();
    // Trigger page animation after component mounts
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  useEffect(() => {
    // Trigger cards animation after events are loaded
    if (events.length > 0) {
      setTimeout(() => setCardsVisible(true), 300);
    }
  }, [events]);

  useEffect(() => {
    // Update active filters
    const filters = [];
    if (searchTerm) filters.push({ type: 'search', value: searchTerm, label: `Search: ${searchTerm}` });
    if (filterType !== 'all') filters.push({ type: 'type', value: filterType, label: `Type: ${filterType}` });
    if (filterGrade !== 'all') filters.push({ type: 'grade', value: filterGrade, label: `Grade: ${filterGrade}` });
    setActiveFilters(filters);
  }, [searchTerm, filterType, filterGrade]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await api.get('/api/events');
      // setEvents(response.data.data.events || []);

      // Using mock data for now
      setTimeout(() => {
        setEvents(mockEvents);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setError('Failed to load events');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset card visibility for animation
    setCardsVisible(false);
    setTimeout(() => setCardsVisible(true), 100);
  };

  const handleOpenDialog = (event = null) => {
    if (event) {
      setSelectedEvent(event);
      setEventForm({
        ...event,
        date: new Date(event.date).toISOString().split('T')[0] // Convert to input format
      });
    } else {
      setSelectedEvent(null);
      setEventForm({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        type: 'academic',
        attendees: 0,
        organizer: '',
        grade: 'Grade 1',
        audience: {
          parents: true,
          teachers: true,
          pupils: {
            included: true,
            grades: [],
            classTeachers: []
          }
        },
        requirements: {
          participationFee: 0,
          attire: '',
          materials: '',
          notes: ''
        }
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = async () => {
    try {
      if (selectedEvent) {
        // Update event
        // await api.put(`/api/events/${selectedEvent.id}`, eventForm);
      } else {
        // Create new event
        // await api.post('/api/events', eventForm);
      }
      fetchEvents();
      handleCloseDialog();
      showSnackbar(selectedEvent ? 'Event updated successfully' : 'Event created successfully');
    } catch (err) {
      console.error('Failed to save event:', err);
      setError('Failed to save event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // await api.delete(`/api/events/${eventId}`);
        fetchEvents();
        showSnackbar('Event deleted successfully');
      } catch (err) {
        console.error('Failed to delete event:', err);
        setError('Failed to delete event');
      }
    }
  };

  const handleClearFilter = (filterType) => {
    if (filterType === 'search') setSearchTerm('');
    else if (filterType === 'type') setFilterType('all');
    else if (filterType === 'grade') setFilterGrade('all');
  };

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterGrade('all');
  };

  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();

      // Set colors - clean and professional
      const primaryColor = [46, 125, 50]; // #2e7d32 for titles only
      const darkText = [0, 0, 0];         // Pure black for text (instead of dark gray)
      const mediumText = [80, 80, 80];    // Medium gray
      const lightGray = [240, 240, 240];  // Light gray for alternating rows
      const white = [255, 255, 255];

      // Title (keeping green only for the main title)
      doc.setFontSize(20);
      doc.setTextColor(...primaryColor);
      doc.setFont(undefined, 'bold');
      doc.text('School Events Report', 14, 20);

      // Date range and filters
      doc.setFontSize(11);
      doc.setTextColor(...mediumText);
      doc.setFont(undefined, 'normal');
      const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Generated on: ${reportDate}`, 14, 30);

      // Add filters if any
      let yPos = 40;
      if (activeFilters.length > 0) {
        doc.setFontSize(11);
        doc.setTextColor(...darkText);
        doc.setFont(undefined, 'bold');
        doc.text('Applied Filters:', 14, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setTextColor(...mediumText);
        doc.setFont(undefined, 'normal');
        activeFilters.forEach(filter => {
          doc.text(`• ${filter.label}`, 20, yPos);
          yPos += 5;
        });
        yPos += 8;
      } else {
        yPos += 5;
      }

      // Prepare table data
      const tableData = filteredEvents.map(event => [
        event.title,
        formatDate(event.date),
        `${event.startTime} - ${event.endTime}`,
        event.location,
        eventTypes.find(et => et.value === event.type)?.label || event.type,
        event.grade,
        event.attendees.toString(),
        isUpcoming(event.date) ? 'Upcoming' : 'Completed'
      ]);

      // Table headers
      const headers = ['Title', 'Date', 'Time', 'Location', 'Type', 'Grade', 'Attendees', 'Status'];
      const columnWidths = [45, 25, 25, 35, 22, 18, 18, 20];

      // Draw table headers with light gray background and dark text
      doc.setFillColor(...lightGray);
      doc.setTextColor(...darkText);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');

      let xPos = 14;
      headers.forEach((header, index) => {
        doc.rect(xPos, yPos, columnWidths[index], 8, 'F');
        // Center text in header cells
        const textWidth = doc.getTextWidth(header);
        const centerX = xPos + (columnWidths[index] - textWidth) / 2;
        doc.text(header, Math.max(xPos + 2, centerX), yPos + 5);
        xPos += columnWidths[index];
      });

      // Draw table rows - clean without colors
      yPos += 8;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');

      tableData.forEach((row, rowIndex) => {
        // Simple alternating white and light gray rows
        if (rowIndex % 2 === 0) {
          doc.setFillColor(...white);
        } else {
          doc.setFillColor(...lightGray);
        }

        xPos = 14;
        row.forEach((cell, cellIndex) => {
          // Standard black text for all cells
          doc.setTextColor(...darkText);

          // Special styling only for status column (no background color)
          if (cellIndex === 7) { // Status column
            if (cell === 'Upcoming') {
              doc.setFont(undefined, 'bold');
            } else {
              doc.setFont(undefined, 'normal');
            }
          }

          // Draw cell background (white or light gray)
          doc.rect(xPos, yPos, columnWidths[cellIndex], 7, 'F');

          // Prepare text for display
          let displayText = cell;
          const maxWidth = columnWidths[cellIndex] - 4; // 2px padding on each side

          // Truncate text if too long
          let textWidth = doc.getTextWidth(displayText);
          while (textWidth > maxWidth && displayText.length > 4) {
            displayText = displayText.substring(0, displayText.length - 4) + '...';
            textWidth = doc.getTextWidth(displayText);
          }

          // Add text with padding
          doc.text(displayText, xPos + 2, yPos + 4.5);
          xPos += columnWidths[cellIndex];

          // Reset font for next cell
          doc.setFont(undefined, 'normal');
        });
        yPos += 7;

        // Add new page if needed
        if (yPos > 270 && rowIndex < tableData.length - 1) {
          doc.addPage();
          yPos = 20;

          // Redraw headers on new page
          doc.setFillColor(...lightGray);
          doc.setTextColor(...darkText);
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');

          xPos = 14;
          headers.forEach((header, index) => {
            doc.rect(xPos, yPos, columnWidths[index], 8, 'F');
            const textWidth = doc.getTextWidth(header);
            const centerX = xPos + (columnWidths[index] - textWidth) / 2;
            doc.text(header, Math.max(xPos + 2, centerX), yPos + 5);
            xPos += columnWidths[index];
          });
          yPos += 8;
        }
      });

      // Add summary section - clean without colors
      yPos += 12;
      doc.setFontSize(12);
      doc.setTextColor(...darkText);
      doc.setFont(undefined, 'bold');
      doc.text('Report Summary', 14, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(...darkText);

      // Summary information - simple text without colored boxes
      doc.text(`• Total Events: ${filteredEvents.length}`, 20, yPos);
      doc.text(`• Upcoming Events: ${filteredEvents.filter(e => isUpcoming(e.date)).length}`, 20, yPos + 8);
      doc.text(`• Completed Events: ${filteredEvents.filter(e => !isUpcoming(e.date)).length}`, 20, yPos + 16);

      // Right column
      const totalAttendees = filteredEvents.reduce((sum, e) => sum + e.attendees, 0);
      doc.text(`• Total Attendees: ${totalAttendees}`, 110, yPos);

      // Event type breakdown
      const typeCounts = {};
      filteredEvents.forEach(event => {
        const type = eventTypes.find(et => et.value === event.type)?.label || event.type;
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });

      let typeY = yPos + 8;
      Object.entries(typeCounts).forEach(([type, count]) => {
        doc.text(`• ${type}: ${count}`, 110, typeY);
        typeY += 8;
      });

      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...mediumText);
        doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });

        // Add footer with school name
        doc.text('Generated by School Events System', 14, 290);
      }

      // Save the PDF
      const fileName = `events_report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      showSnackbar('PDF exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      showSnackbar('Failed to export PDF', 'error');
    }
    handleExportMenuClose();
  };

  // Excel Export Function
  const handleExportExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = filteredEvents.map(event => ({
        'Event Title': event.title,
        'Description': event.description,
        'Date': formatDate(event.date),
        'Start Time': event.startTime,
        'End Time': event.endTime,
        'Location': event.location,
        'Type': eventTypes.find(et => et.value === event.type)?.label || event.type,
        'Grade': event.grade,
        'Expected Attendees': event.attendees,
        'Status': isUpcoming(event.date) ? 'Upcoming' : 'Completed',
        'Organizer': event.organizer,
        'Audience - Parents': event.audience.parents ? 'Yes' : 'No',
        'Audience - Teachers': event.audience.teachers ? 'Yes' : 'No',
        'Audience - Pupils': event.audience.pupils.included ? 'Yes' : 'No',
        'Target Grades': event.audience.pupils.grades.join(', '),
        'Class Teachers': event.audience.pupils.classTeachers.join(', '),
        'Participation Fee ($)': event.requirements.participationFee,
        'Attire': event.requirements.attire,
        'Materials': event.requirements.materials,
        'Additional Notes': event.requirements.notes
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Main events sheet
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Add some basic styling through column widths
      const colWidths = [
        { wch: 25 }, // Event Title
        { wch: 40 }, // Description
        { wch: 15 }, // Date
        { wch: 12 }, // Start Time
        { wch: 12 }, // End Time
        { wch: 20 }, // Location
        { wch: 15 }, // Type
        { wch: 10 }, // Grade
        { wch: 8 },  // Expected Attendees
        { wch: 12 }, // Status
        { wch: 20 }, // Organizer
        { wch: 8 },  // Audience - Parents
        { wch: 8 },  // Audience - Teachers
        { wch: 8 },  // Audience - Pupils
        { wch: 20 }, // Target Grades
        { wch: 25 }, // Class Teachers
        { wch: 8 },  // Participation Fee ($)
        { wch: 15 }, // Attire
        { wch: 25 }, // Materials
        { wch: 30 }  // Additional Notes
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Events');

      // Create a summary sheet with better formatting
      const summaryData = [
        ['School Events Report Summary'],
        [''],
        ['Report Generated:', new Date().toLocaleString()],
        [''],
        ['Summary Metrics', 'Value'],
        ['Total Events', filteredEvents.length],
        ['Upcoming Events', filteredEvents.filter(e => isUpcoming(e.date)).length],
        ['Completed Events', filteredEvents.filter(e => !isUpcoming(e.date)).length],
        ['Total Expected Attendees', filteredEvents.reduce((sum, e) => sum + e.attendees, 0)],
        [''],
        ['Event Type Breakdown', 'Count']
      ];

      // Add event type breakdown
      const typeBreakdown = {};
      filteredEvents.forEach(event => {
        const type = eventTypes.find(et => et.value === event.type)?.label || event.type;
        typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
      });

      Object.entries(typeBreakdown).forEach(([type, count]) => {
        summaryData.push([type, count]);
      });

      // Add grade breakdown
      summaryData.push(['', '']);
      summaryData.push(['Grade Breakdown', 'Count']);
      const gradeBreakdown = {};
      filteredEvents.forEach(event => {
        gradeBreakdown[event.grade] = (gradeBreakdown[event.grade] || 0) + 1;
      });

      Object.entries(gradeBreakdown).forEach(([grade, count]) => {
        summaryData.push([grade, count]);
      });

      // Add filter information
      if (activeFilters.length > 0) {
        summaryData.push(['', '']);
        summaryData.push(['Applied Filters', '']);
        activeFilters.forEach(filter => {
          summaryData.push([filter.label, '']);
        });
      }

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      wsSummary['!cols'] = [{ wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // Create events by type sheet
      const eventsByType = [];
      eventTypes.forEach(type => {
        const typeEvents = filteredEvents.filter(e => e.type === type.value);
        if (typeEvents.length > 0) {
          eventsByType.push([`${type.label} Events (${typeEvents.length})`]);
          eventsByType.push(['Title', 'Date', 'Location', 'Grade', 'Attendees']);
          typeEvents.forEach(event => {
            eventsByType.push([
              event.title,
              formatDate(event.date),
              event.location,
              event.grade,
              event.attendees
            ]);
          });
          eventsByType.push(['']);
        }
      });

      if (eventsByType.length > 0) {
        const wsByType = XLSX.utils.aoa_to_sheet(eventsByType);
        wsByType['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(wb, wsByType, 'Events by Type');
      }

      // Save the Excel file
      const fileName = `events_report_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      showSnackbar('Excel exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      showSnackbar('Failed to export Excel', 'error');
    }
    handleExportMenuClose();
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesGrade = filterGrade === 'all' || event.grade === filterGrade;

    if (tabValue === 0) return matchesSearch && matchesType && matchesGrade; // All events
    if (tabValue === 1) return matchesSearch && matchesType && matchesGrade && isUpcoming(event.date);
    if (tabValue === 2) return matchesSearch && matchesType && matchesGrade && !isUpcoming(event.date);

    return matchesSearch && matchesType && matchesGrade;
  });

  const paginatedEvents = filteredEvents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleGradeChange = (event) => {
    const { value } = event.target;
    setEventForm(prev => ({
      ...prev,
      audience: {
        ...prev.audience,
        pupils: {
          ...prev.audience.pupils,
          grades: typeof value === 'string' ? value.split(',') : value
        }
      }
    }));
  };

  const handleClassTeacherChange = (event) => {
    const { value } = event.target;
    setEventForm(prev => ({
      ...prev,
      audience: {
        ...prev.audience,
        pupils: {
          ...prev.audience.pupils,
          classTeachers: typeof value === 'string' ? value.split(',') : value
        }
      }
    }));
  };

  if (loading && events.length === 0) {
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
          Loading Events...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={pageLoaded} timeout={800}>
      <Box sx={{ 
        p: isSmallScreen ? 1 : 3, 
        bgcolor: '#f1f8e9', 
        minHeight: '100vh',
        pb: isMobile ? 8 : 3 // Add bottom padding for mobile to account for FAB
      }}>
        {/* Mobile App Bar */}
        {isMobile && (
          <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: '#e8f5e9', mb: 2 }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#1b5e20', fontWeight: 700 }}>
                Events
              </Typography>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon sx={{ color: '#2e7d32' }} />
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
          <MenuItem onClick={() => { handleOpenDialog(); handleMobileMenuClose(); }}>
            <AddIcon sx={{ mr: 1, color: '#2e7d32' }} />
            Add Event
          </MenuItem>
          <MenuItem onClick={() => { handleExportMenuOpen(); handleMobileMenuClose(); }}>
            <DownloadIcon sx={{ mr: 1, color: '#2e7d32' }} />
            Export
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setFilterDrawerOpen(true); handleMobileMenuClose(); }}>
            <FilterIcon sx={{ mr: 1, color: '#2e7d32' }} />
            Filters
          </MenuItem>
        </Menu>

        {/* Export Menu */}
        <Menu
          anchorEl={exportMenuAnchor}
          open={Boolean(exportMenuAnchor)}
          onClose={handleExportMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }
          }}
        >
          <MenuItem onClick={handleExportPDF} sx={{ '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.04)' } }}>
            <PdfIcon sx={{ mr: 1, color: '#f44336' }} />
            Export as PDF
          </MenuItem>
          <MenuItem onClick={handleExportExcel} sx={{ '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.04)' } }}>
            <ExcelIcon sx={{ mr: 1, color: '#4caf50' }} />
            Export as Excel
          </MenuItem>
        </Menu>

        {/* Header - Desktop */}
        {!isMobile && (
          <Slide direction="down" in={pageLoaded} timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  Events Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage school events, meetings, and activities
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportMenuOpen}
                  sx={{
                    borderColor: '#2e7d32',
                    color: '#2e7d32',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#1b5e20',
                      bgcolor: 'rgba(46, 125, 50, 0.04)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Export
                </Button>
                <Fab
                  color="primary"
                  aria-label="add event"
                  onClick={() => handleOpenDialog()}
                  sx={{
                    bgcolor: '#2e7d32',
                    boxShadow: '0 4px 14px rgba(46, 125, 50, 0.4)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#1b5e20',
                      boxShadow: '0 6px 20px rgba(46, 125, 50, 0.6)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <AddIcon />
                </Fab>
              </Box>
            </Box>
          </Slide>
        )}

        {error && (
          <Grow in={!!error} timeout={500}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Grow>
        )}

        {/* Filters and Tabs - Desktop */}
        {!isMobile && (
          <Slide direction="up" in={pageLoaded} timeout={1200}>
            <Card sx={{ mb: 3, borderRadius: '12px', bgcolor: '#ffffff' }}>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: <EventIcon sx={{ mr: 1, color: '#2e7d32' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#2e7d32',
                          },
                          transition: 'all 0.3s ease'
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Event Type</InputLabel>
                      <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        sx={{
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2e7d32',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        {eventTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Grade</InputLabel>
                      <Select
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                        sx={{
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2e7d32',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <MenuItem value="all">All Grades</MenuItem>
                        {grades.map(grade => (
                          <MenuItem key={grade} value={grade}>
                            {grade}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={handleClearAllFilters}
                      startIcon={<ClearIcon />}
                      sx={{
                        borderColor: '#2e7d32',
                        color: '#2e7d32',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#1b5e20',
                          bgcolor: 'rgba(46, 125, 50, 0.04)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>

                {/* Active Filters */}
                {activeFilters.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {activeFilters.map((filter, index) => (
                      <Grow in={true} timeout={300 + index * 100} key={index}>
                        <Chip
                          label={filter.label}
                          onDelete={() => handleClearFilter(filter.type)}
                          deleteIcon={<CloseIcon />}
                          sx={{
                            bgcolor: '#e8f5e9',
                            color: '#2e7d32',
                            '& .MuiChip-deleteIcon': {
                              color: '#2e7d32',
                            },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </Grow>
                    ))}
                  </Box>
                )}

                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{ mt: 2 }}
                  indicatorColor="primary"
                  textColor="primary"
                  variant={isSmallScreen ? "fullWidth" : "standard"}
                >
                  <Tab label="All Events" />
                  <Tab label="Upcoming" />
                  <Tab label="Past Events" />
                </Tabs>
              </CardContent>
            </Card>
          </Slide>
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
              Filters
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <EventIcon sx={{ mr: 1, color: '#2e7d32' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#2e7d32',
                  },
                  transition: 'all 0.3s ease'
                },
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2e7d32',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                {eventTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Grade</InputLabel>
              <Select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2e7d32',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <MenuItem value="all">All Grades</MenuItem>
                {grades.map(grade => (
                  <MenuItem key={grade} value={grade}>
                    {grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              variant="outlined"
              onClick={handleClearAllFilters}
              startIcon={<ClearIcon />}
              sx={{
                borderColor: '#2e7d32',
                color: '#2e7d32',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#1b5e20',
                  bgcolor: 'rgba(46, 125, 50, 0.04)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Clear Filters
            </Button>
            
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {activeFilters.map((filter, index) => (
                  <Chip
                    key={index}
                    label={filter.label}
                    onDelete={() => handleClearFilter(filter.type)}
                    deleteIcon={<CloseIcon />}
                    sx={{
                      bgcolor: '#e8f5e9',
                      color: '#2e7d32',
                      '& .MuiChip-deleteIcon': {
                        color: '#2e7d32',
                      },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                ))}
              </Box>
            )}
            
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="All Events" />
              <Tab label="Upcoming" />
              <Tab label="Past Events" />
            </Tabs>
          </Box>
        </Drawer>

        {/* Events Grid */}
        <Grid container spacing={isSmallScreen ? 2 : 3}>
          {paginatedEvents.length === 0 ? (
            <Grid item xs={12}>
              <Grow in={cardsVisible} timeout={800}>
                <Paper sx={{ p: isSmallScreen ? 3 : 6, textAlign: 'center', borderRadius: '12px', bgcolor: '#ffffff' }}>
                  <EventIcon sx={{ fontSize: isSmallScreen ? 48 : 64, color: '#a5d6a7', mb: 2 }} />
                  <Typography variant={isSmallScreen ? "body1" : "h6"} color="text.secondary" gutterBottom>
                    No events found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {searchTerm || filterType !== 'all' || filterGrade !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'No events scheduled yet'
                    }
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                      bgcolor: '#2e7d32',
                      '&:hover': {
                        bgcolor: '#1b5e20',
                      },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Create First Event
                  </Button>
                </Paper>
              </Grow>
            </Grid>
          ) : (
            paginatedEvents.map((event, index) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Grow
                  in={cardsVisible}
                  timeout={500 + index * 150}
                  style={{ transformOrigin: '0 0 0' }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      },
                      borderTop: `4px solid ${gradeColors[event.grade] || '#4caf50'}`
                    }}
                  >
                    <CardContent sx={{ p: isSmallScreen ? 2 : 3 }}>
                      {/* Event Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: getEventTypeColor(event.type),
                              mr: 2,
                              width: isSmallScreen ? 32 : 40,
                              height: isSmallScreen ? 32 : 40,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                          >
                            {getEventTypeIcon(event.type)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant={isSmallScreen ? "body1" : "h6"} 
                              sx={{ 
                                fontWeight: 600, 
                                color: '#1b5e20',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {event.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                              <Chip
                                label={eventTypes.find(et => et.value === event.type)?.label}
                                size="small"
                                sx={{
                                  bgcolor: `${getEventTypeColor(event.type)}20`,
                                  color: getEventTypeColor(event.type),
                                  fontWeight: 600,
                                  fontSize: isSmallScreen ? '0.7rem' : '0.75rem',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                              <Chip
                                label={event.grade}
                                size="small"
                                sx={{
                                  bgcolor: `${gradeColors[event.grade]}20`,
                                  color: gradeColors[event.grade],
                                  fontWeight: 600,
                                  fontSize: isSmallScreen ? '0.7rem' : '0.75rem',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(event)}
                            sx={{ 
                              color: '#2e7d32',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                bgcolor: 'rgba(46, 125, 50, 0.1)'
                              }
                            }}
                          >
                            <EditIcon fontSize={isSmallScreen ? "small" : "medium"} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteEvent(event.id)}
                            sx={{ 
                              color: '#d32f2f',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                bgcolor: 'rgba(211, 47, 47, 0.1)'
                              }
                            }}
                          >
                            <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Event Description */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: isSmallScreen ? 2 : 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {event.description}
                      </Typography>

                      {/* Event Details */}
                      <List dense sx={{ mb: 2, p: 0 }}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: isSmallScreen ? 32 : 40 }}>
                            <TodayIcon color="action" fontSize={isSmallScreen ? "small" : "medium"} />
                          </ListItemIcon>
                          <ListItemText
                            primary={formatDate(event.date)}
                            secondary={`${event.startTime} - ${event.endTime}`}
                            primaryTypographyProps={{ variant: isSmallScreen ? "body2" : "body1" }}
                            secondaryTypographyProps={{ variant: isSmallScreen ? "caption" : "body2" }}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: isSmallScreen ? 32 : 40 }}>
                            <LocationIcon color="action" fontSize={isSmallScreen ? "small" : "medium"} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={event.location}
                            primaryTypographyProps={{ variant: isSmallScreen ? "body2" : "body1" }}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: isSmallScreen ? 32 : 40 }}>
                            <PeopleIcon color="action" fontSize={isSmallScreen ? "small" : "medium"} />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${event.attendees} attendees`}
                            secondary={event.organizer}
                            primaryTypographyProps={{ variant: isSmallScreen ? "body2" : "body1" }}
                            secondaryTypographyProps={{ variant: isSmallScreen ? "caption" : "body2" }}
                          />
                        </ListItem>
                      </List>

                      {/* Status Badge */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={isUpcoming(event.date) ? 'Upcoming' : 'Completed'}
                          color={isUpcoming(event.date) ? 'success' : 'default'}
                          variant="outlined"
                          size="small"
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {isUpcoming(event.date) ? 'In ' : ''}
                          {Math.abs(getDaysUntilEvent(event.date))} days
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))
          )}
        </Grid>

        {/* Pagination */}
        {filteredEvents.length > rowsPerPage && (
          <Slide direction="up" in={cardsVisible} timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <TablePagination
                rowsPerPageOptions={isSmallScreen ? [6, 12] : [6, 12, 24]}
                component="div"
                count={filteredEvents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                  // Reset card visibility for animation
                  setCardsVisible(false);
                  setTimeout(() => setCardsVisible(true), 100);
                }}
                sx={{
                  '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                    color: '#2e7d32',
                    fontSize: isSmallScreen ? '0.75rem' : '0.875rem'
                  },
                  '& .MuiTablePagination-actions .MuiIconButton-root': {
                    color: '#2e7d32',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      bgcolor: 'rgba(46, 125, 50, 0.1)'
                    }
                  }
                }}
              />
            </Box>
          </Slide>
        )}

        {/* Mobile FAB */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add event"
            onClick={() => handleOpenDialog()}
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
            <AddIcon />
          </Fab>
        )}

        {/* Add/Edit Event Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          fullScreen={isSmallScreen}
          TransitionComponent={Slide}
          transitionDuration={300}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? 0 : '12px',
              bgcolor: '#ffffff',
              transition: 'all 0.3s ease',
              maxHeight: isSmallScreen ? '100vh' : '90vh'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#e8f5e9' }}>
            <Typography variant={isSmallScreen ? "h6" : "h5"} sx={{ fontWeight: 600, color: '#1b5e20' }}>
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={isSmallScreen ? 2 : 3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} sx={{ fontWeight: 600, color: '#2e7d32', mb: 2 }}>
                  Basic Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  multiline
                  rows={isSmallScreen ? 2 : 3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Event Date"
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {eventTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expected Attendees"
                  type="number"
                  value={eventForm.attendees}
                  onChange={(e) => setEventForm({ ...eventForm, attendees: parseInt(e.target.value) || 0 })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Organizer"
                  value={eventForm.organizer}
                  onChange={(e) => setEventForm({ ...eventForm, organizer: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    value={eventForm.grade}
                    onChange={(e) => setEventForm({ ...eventForm, grade: e.target.value })}
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {grades.map(grade => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Audience Section */}
              <Grid item xs={12}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} sx={{ fontWeight: 600, color: '#2e7d32', mb: 2, mt: 2 }}>
                  Audience
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: isSmallScreen ? 1 : 3, mb: 2, flexWrap: 'wrap' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={eventForm.audience.parents}
                        onChange={(e) => setEventForm({
                          ...eventForm,
                          audience: {
                            ...eventForm.audience,
                            parents: e.target.checked
                          }
                        })}
                        sx={{
                          color: '#2e7d32',
                          '&.Mui-checked': {
                            color: '#2e7d32',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      />
                    }
                    label="Parents"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={eventForm.audience.teachers}
                        onChange={(e) => setEventForm({
                          ...eventForm,
                          audience: {
                            ...eventForm.audience,
                            teachers: e.target.checked
                          }
                        })}
                        sx={{
                          color: '#2e7d32',
                          '&.Mui-checked': {
                            color: '#2e7d32',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      />
                    }
                    label="Teachers"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={eventForm.audience.pupils.included}
                        onChange={(e) => setEventForm({
                          ...eventForm,
                          audience: {
                            ...eventForm.audience,
                            pupils: {
                              ...eventForm.audience.pupils,
                              included: e.target.checked
                            }
                          }
                        })}
                        sx={{
                          color: '#2e7d32',
                          '&.Mui-checked': {
                            color: '#2e7d32',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      />
                    }
                    label="Pupils"
                  />
                </Box>
              </Grid>
              {eventForm.audience.pupils.included && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Grades</InputLabel>
                      <Select
                        multiple
                        value={eventForm.audience.pupils.grades}
                        onChange={handleGradeChange}
                        input={<OutlinedInput label="Grades" />}
                        renderValue={(selected) => selected.join(', ')}
                        sx={{
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2e7d32',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            <Checkbox checked={eventForm.audience.pupils.grades.indexOf(grade) > -1} />
                            {grade}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Class Teachers"
                      value={eventForm.audience.pupils.classTeachers.join(', ')}
                      onChange={(e) => setEventForm({
                        ...eventForm,
                        audience: {
                          ...eventForm.audience,
                          pupils: {
                            ...eventForm.audience.pupils,
                            classTeachers: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          }
                        }
                      })}
                      helperText="Separate multiple teachers with commas"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#2e7d32',
                          },
                          transition: 'all 0.3s ease'
                        },
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Requirements Section */}
              <Grid item xs={12}>
                <Typography variant={isSmallScreen ? "subtitle1" : "h6"} sx={{ fontWeight: 600, color: '#2e7d32', mb: 2, mt: 2 }}>
                  Requirements
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Participation Fee ($)"
                  type="number"
                  value={eventForm.requirements.participationFee}
                  onChange={(e) => setEventForm({
                    ...eventForm,
                    requirements: {
                      ...eventForm.requirements,
                      participationFee: parseFloat(e.target.value) || 0
                    }
                  })}
                  InputProps={{
                    startAdornment: <MoneyIcon sx={{ mr: 1, color: '#2e7d32' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Attire"
                  value={eventForm.requirements.attire}
                  onChange={(e) => setEventForm({
                    ...eventForm,
                    requirements: {
                      ...eventForm.requirements,
                      attire: e.target.value
                    }
                  })}
                  InputProps={{
                    startAdornment: <AttireIcon sx={{ mr: 1, color: '#2e7d32' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Materials"
                  value={eventForm.requirements.materials}
                  onChange={(e) => setEventForm({
                    ...eventForm,
                    requirements: {
                      ...eventForm.requirements,
                      materials: e.target.value
                    }
                  })}
                  helperText="List any materials participants need to bring"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  value={eventForm.requirements.notes}
                  onChange={(e) => setEventForm({
                    ...eventForm,
                    requirements: {
                      ...eventForm.requirements,
                      notes: e.target.value
                    }
                  })}
                  multiline
                  rows={isSmallScreen ? 2 : 3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#e8f5e9' }}>
            <Button 
              onClick={handleCloseDialog} 
              variant="outlined" 
              sx={{ 
                borderColor: '#2e7d32', 
                color: '#2e7d32',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent} 
              variant="contained" 
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
              {selectedEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Slide}
          transitionDuration={{ enter: 300, exit: 300 }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default EventsPage;