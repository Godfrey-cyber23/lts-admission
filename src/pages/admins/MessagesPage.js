import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Badge,
  Tab,
  Tabs,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Snackbar,
  Paper,
  Fade,
  Slide,
  Zoom,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Drawer,
  Menu,
  Hidden
} from '@mui/material';
import {
  Add as AddIcon,
  Send as SendIcon,
  Search as SearchIcon,
  MarkEmailRead as ReadIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Campaign as AnnouncementIcon,
  School as SchoolIcon, 
  FilterList as FilterIcon,
  Reply as ReplyIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

// Mock data for messages and notifications
const mockMessages = [
  {
    id: 1,
    sender: 'Principal Office',
    senderAvatar: 'P',
    subject: 'Parent-Teacher Meeting Reminder',
    preview: 'This is a preview of the parent-teacher meeting scheduled for Friday...',
    fullContent: 'Dear Parents,\n\nThis is a reminder about the upcoming parent-teacher meeting scheduled for Friday, October 15th at 3:00 PM. The meeting will be held in the school auditorium.\n\nPlease make arrangements to attend as we will be discussing important matters regarding your child\'s academic progress and upcoming school events.\n\nIf you have any questions, please feel free to contact the school office.\n\nThank you,\nPrincipal Office',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unread: true,
    type: 'announcement',
    priority: 'high',
    replies: [
      {
        id: 101,
        sender: 'John Smith',
        content: 'Thank you for the reminder. I will be attending the meeting.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isReply: true
      }
    ]
  },
  {
    id: 2,
    sender: 'Sports Department',
    senderAvatar: 'S',
    subject: 'Sports Day Preparation',
    preview: 'Please ensure your child comes prepared for the sports day activities...',
    fullContent: 'Dear Parents,\n\nOur annual Sports Day is scheduled for next Saturday, October 23rd. Please ensure your child comes prepared with:\n\n1. Proper sports attire\n2. Water bottle\n3. Sunscreen\n4. Healthy snacks\n\nThe event will start at 9:00 AM and is expected to conclude by 2:00 PM. Parents are welcome to attend and cheer for their children.\n\nIf you have any concerns, please contact the Sports Department.\n\nRegards,\nSports Department',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    unread: true,
    type: 'announcement',
    priority: 'medium',
    replies: []
  },
  {
    id: 3,
    sender: 'John Smith (Parent)',
    senderAvatar: 'J',
    subject: 'Query about tuition fees',
    preview: 'Hello, I have a question regarding the tuition fee structure for next term...',
    fullContent: 'Hello,\n\nI have a question regarding the tuition fee structure for next term. Could you please provide me with a detailed breakdown of the fees?\n\nAlso, are there any scholarships available for students with exceptional academic performance?\n\nThank you,\nJohn Smith',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unread: false,
    type: 'personal',
    priority: 'medium',
    replies: [
      {
        id: 201,
        sender: 'Finance Department',
        content: 'Dear Mr. Smith,\n\nThank you for your inquiry. The detailed fee structure for next term has been sent to your email. Regarding scholarships, we do offer merit-based scholarships. Please check the scholarship section on our school website for more information.\n\nBest regards,\nFinance Department',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
        isReply: true
      },
      {
        id: 202,
        sender: 'John Smith',
        content: 'Thank you for the prompt response. I will check my email and the website for the scholarship details.',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
        isReply: true
      }
    ]
  },
  {
    id: 4,
    sender: 'Sarah Johnson (Parent)',
    senderAvatar: 'S',
    subject: 'Medical certificate submission',
    preview: 'I have submitted the medical certificate for my child through the portal...',
    fullContent: 'Hello,\n\nI have submitted the medical certificate for my child through the portal. Could you please confirm if you have received it?\n\nThe certificate was for my child\'s absence last week due to illness.\n\nThank you,\nSarah Johnson',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    unread: false,
    type: 'personal',
    priority: 'low',
    replies: [
      {
        id: 301,
        sender: 'School Office',
        content: 'Dear Ms. Johnson,\n\nWe have received the medical certificate. Thank you for submitting it promptly. The absence has been marked as excused in our system.\n\nBest regards,\nSchool Office',
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 days ago
        isReply: true
      }
    ]
  }
];

const mockNotifications = [
  {
    id: 1,
    title: 'New admission application',
    description: 'Godfrey Bwalya has submitted an admission application',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    type: 'admission',
    read: false,
    actionUrl: '/admin/admissions'
  },
  {
    id: 2,
    title: 'Fee payment received',
    description: 'Payment of ZMW 5,000 received from Mike Brown',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    type: 'payment',
    read: false,
    actionUrl: '/admin/finance'
  },
  {
    id: 3,
    title: 'Staff meeting reminder',
    description: 'Weekly staff meeting starts in 1 hour',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    type: 'reminder',
    read: true,
    actionUrl: '/admin/calendar'
  },
  {
    id: 4,
    title: 'System maintenance',
    description: 'Scheduled maintenance this weekend from 10 PM to 2 AM',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    type: 'system',
    read: true,
    actionUrl: '/admin/settings'
  }
];

const MessagesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Compose message form
  const [composeForm, setComposeForm] = useState({
    recipientType: 'all',
    recipients: [],
    subject: '',
    message: '',
    priority: 'medium',
    schedule: false,
    scheduledDate: ''
  });

  const recipientTypes = [
    { value: 'all', label: 'All Parents', icon: <GroupIcon /> },
    { value: 'grade', label: 'By Grade', icon: <SchoolIcon /> },
    { value: 'individual', label: 'Individual', icon: <PersonIcon /> }
  ];

  const priorityTypes = [
    { value: 'low', label: 'Low', color: '#81c784' },
    { value: 'medium', label: 'Medium', color: '#4caf50' },
    { value: 'high', label: 'High', color: '#f44336' }
  ];

  useEffect(() => {
    fetchMessages();
    fetchNotifications();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedMessage?.replies]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setNotifications(mockNotifications);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleComposeOpen = () => {
    setComposeOpen(true);
  };

  const handleComposeClose = () => {
    setComposeOpen(false);
    setComposeForm({
      recipientType: 'all',
      recipients: [],
      subject: '',
      message: '',
      priority: 'medium',
      schedule: false,
      scheduledDate: ''
    });
  };

  const handleViewMessage = (message) => {
    // Add animation
    setAnimatingItems(prev => new Set(prev).add(message.id));
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.id);
        return newSet;
      });
    }, 500);
    
    setSelectedMessage(message);
    setViewOpen(true);
    // Mark as read
    if (message.unread) {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, unread: false } : msg
      ));
    }
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedMessage(null);
  };

  const handleReplyOpen = () => {
    setReplyOpen(true);
  };

  const handleReplyClose = () => {
    setReplyOpen(false);
    setReplyText('');
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    
    const newReply = {
      id: Date.now(),
      sender: 'You',
      content: replyText,
      timestamp: new Date(),
      isReply: true
    };
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, replies: [...msg.replies, newReply] }
        : msg
    ));
    
    setSelectedMessage(prev => ({
      ...prev,
      replies: [...prev.replies, newReply]
    }));
    
    setReplyText('');
    setReplyOpen(false);
    setSnackbar({ open: true, message: 'Reply sent successfully!', severity: 'success' });
  };

  const handleSendMessage = async () => {
    try {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        senderAvatar: 'Y',
        subject: composeForm.subject,
        preview: composeForm.message.substring(0, 100) + '...',
        fullContent: composeForm.message,
        timestamp: new Date(),
        unread: false,
        type: composeForm.recipientType === 'individual' ? 'personal' : 'announcement',
        priority: composeForm.priority,
        replies: []
      };
      
      setMessages(prev => [newMessage, ...prev]);
      handleComposeClose();
      setSnackbar({ open: true, message: 'Message sent successfully!', severity: 'success' });
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    }
  };

  const handleMarkAsRead = (messageId) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, unread: false } : msg
    ));
    setSnackbar({ open: true, message: 'Message marked as read!', severity: 'success' });
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSnackbar({ open: true, message: 'Message deleted successfully!', severity: 'success' });
    }
  };

  const handleClearAllNotifications = () => {
    if (window.confirm('Clear all notifications?')) {
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      setSnackbar({ open: true, message: 'All notifications cleared!', severity: 'success' });
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     message.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || message.type === filterType;
    return matchesSearch && matchesType;
  });

  const unreadMessagesCount = messages.filter(msg => msg.unread).length;
  const unreadNotificationsCount = notifications.filter(notif => !notif.read).length;

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorityTypes.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : '#4caf50';
  };

  if (loading && messages.length === 0) {
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
      p: isSmallScreen ? 1 : 3, 
      backgroundColor: '#e8f5e9', 
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(to bottom, #e8f5e9, #c8e6c9)',
      pb: isMobile ? 8 : 3 // Add bottom padding for mobile to account for FAB
    }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: '#e8f5e9', mb: 2 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#fff', fontWeight: 700 }}>
              Messages
            </Typography>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon sx={{ color: '#ffffff' }} />
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
        <MenuItem onClick={() => { handleComposeOpen(); handleMobileMenuClose(); }}>
          <AddIcon sx={{ mr: 1, color: '#2e7d32' }} />
          Compose Message
        </MenuItem>
        <MenuItem onClick={() => { setFilterDrawerOpen(true); handleMobileMenuClose(); }}>
          <FilterIcon sx={{ mr: 1, color: '#2e7d32' }} />
          Filters
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleClearAllNotifications(); handleMobileMenuClose(); }}>
          <NotificationsIcon sx={{ mr: 1, color: '#2e7d32' }} />
          Clear Notifications
        </MenuItem>
      </Menu>

      {/* Header - Desktop */}
      {!isMobile && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
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
              Messages & Notifications
            </Typography>
            <Typography variant="body1" color="#2e7d32">
              Communicate with parents and manage notifications
            </Typography>
          </Box>
          <Fab
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' },
              boxShadow: '0 4px 10px rgba(46, 125, 50, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 14px rgba(46, 125, 50, 0.6)'
              }
            }}
            color="primary"
            aria-label="compose message"
            onClick={handleComposeOpen}
          >
            <AddIcon />
          </Fab>
        </Box>
      )}

      <Fade in={error} timeout={500}>
        <Box>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                backgroundColor: '#ffebee',
                color: '#c62828'
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Stats Cards */}
      <Grid container spacing={isSmallScreen ? 2 : 3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={300} style={{ transitionDelay: '100ms' }}>
            <Card sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, #a5d6a7, #81c784)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
                <Badge badgeContent={unreadMessagesCount} color="error">
                  <Avatar sx={{ 
                    bgcolor: '#2e7d32', 
                    mx: 'auto',
                    mb: 2,
                    width: isSmallScreen ? 48 : 56,
                    height: isSmallScreen ? 48 : 56,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}>
                    <SendIcon fontSize={isSmallScreen ? "medium" : "large"} />
                  </Avatar>
                </Badge>
                <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#1b5e20' }}>
                  {messages.length}
                </Typography>
                <Typography variant="body2" color="#1b5e20">
                  Total Messages
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={300} style={{ transitionDelay: '200ms' }}>
            <Card sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, #90caf9, #64b5f6)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
                <Badge badgeContent={unreadNotificationsCount} color="error">
                  <Avatar sx={{ 
                    bgcolor: '#1565c0', 
                    mx: 'auto',
                    mb: 2,
                    width: isSmallScreen ? 48 : 56,
                    height: isSmallScreen ? 48 : 56,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}>
                    <NotificationsIcon fontSize={isSmallScreen ? "medium" : "large"} />
                  </Avatar>
                </Badge>
                <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#0d47a1' }}>
                  {notifications.length}
                </Typography>
                <Typography variant="body2" color="#0d47a1">
                  Notifications
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={300} style={{ transitionDelay: '300ms' }}>
            <Card sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, #80deea, #4dd0e1)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
                <Avatar sx={{ 
                  bgcolor: '#00838f', 
                  mx: 'auto',
                  mb: 2,
                  width: isSmallScreen ? 48 : 56,
                  height: isSmallScreen ? 48 : 56,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}>
                  <AnnouncementIcon fontSize={isSmallScreen ? "medium" : "large"} />
                </Avatar>
                <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#006064' }}>
                  {messages.filter(m => m.type === 'announcement').length}
                </Typography>
                <Typography variant="body2" color="#006064">
                  Announcements
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Zoom in={true} timeout={300} style={{ transitionDelay: '400ms' }}>
            <Card sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              background: 'linear-gradient(135deg, #ffcc80, #ffb74d)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: isSmallScreen ? 2 : 3 }}>
                <Avatar sx={{ 
                  bgcolor: '#e65100', 
                  mx: 'auto',
                  mb: 2,
                  width: isSmallScreen ? 48 : 56,
                  height: isSmallScreen ? 48 : 56,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}>
                  <PersonIcon fontSize={isSmallScreen ? "medium" : "large"} />
                </Avatar>
                <Typography variant={isSmallScreen ? "h5" : "h4"} sx={{ fontWeight: 700, color: '#bf360c' }}>
                  {messages.filter(m => m.type === 'personal').length}
                </Typography>
                <Typography variant="body2" color="#bf360c">
                  Personal Messages
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      {/* Tabs and Filters - Desktop */}
      {!isMobile && (
        <Slide direction="up" in={true} timeout={500}>
          <Card sx={{ 
            mb: 3, 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{ 
                  mb: 2,
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
                <Tab label="Messages" />
                <Tab label="Notifications" />
                <Tab label="Announcements" />
              </Tabs>

              <Collapse in={tabValue === 0}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="#2e7d32" />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.2)'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      select
                      label="Filter by Type"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.2)'
                          }
                        }
                      }}
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="announcement">Announcements</MenuItem>
                      <MenuItem value="personal">Personal</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterType('all');
                      }}
                      startIcon={<FilterIcon />}
                      sx={{
                        borderRadius: 2,
                        borderColor: '#2e7d32',
                        color: '#2e7d32',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(46, 125, 50, 0.1)',
                          borderColor: '#1b5e20'
                        }
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Grid>
                </Grid>
              </Collapse>
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
            Filters & Options
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="#2e7d32" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            select
            label="Filter by Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="announcement">Announcements</MenuItem>
            <MenuItem value="personal">Personal</MenuItem>
          </TextField>
          
          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            startIcon={<FilterIcon />}
            sx={{
              borderRadius: 2,
              borderColor: '#2e7d32',
              color: '#2e7d32',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderColor: '#1b5e20'
              }
            }}
          >
            Clear Filters
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              handleComposeOpen();
              setFilterDrawerOpen(false);
            }}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' }
            }}
          >
            Compose Message
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<NotificationsIcon />}
            onClick={() => {
              handleClearAllNotifications();
              setFilterDrawerOpen(false);
            }}
            sx={{
              borderRadius: 2,
              borderColor: '#2e7d32',
              color: '#2e7d32',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderColor: '#1b5e20'
              }
            }}
          >
            Clear Notifications
          </Button>
        </Box>
      </Drawer>

      {/* Mobile Tabs */}
      {isMobile && (
        <Card sx={{ 
          mb: 3, 
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
        }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
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
              <Tab label="Messages" />
              <Tab label="Notifications" />
              <Tab label="Announcements" />
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={isSmallScreen ? 2 : 3}>
          {/* Messages List */}
          <Grid item xs={12} md={8}>
            <Fade in={true} timeout={700}>
              <Card sx={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                }
              }}>
                <CardContent sx={{ p: 0 }}>
                  <List sx={{ width: '100%' }}>
                    {filteredMessages.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <SendIcon sx={{ fontSize: 64, color: '#81c784', mb: 2 }} />
                        <Typography variant="h6" color="#2e7d32" gutterBottom>
                          No messages found
                        </Typography>
                        <Typography variant="body2" color="#4caf50">
                          {searchTerm || filterType !== 'all' 
                            ? 'Try adjusting your search or filters'
                            : 'No messages yet'
                          }
                        </Typography>
                      </Box>
                    ) : (
                      filteredMessages.map((message, index) => (
                        <Slide 
                          key={message.id} 
                          direction="up" 
                          in={true} 
                          timeout={500}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <Box>
                            <ListItem 
                              alignItems="flex-start"
                              sx={{
                                cursor: 'pointer',
                                backgroundColor: message.unread ? 'rgba(129, 199, 132, 0.2)' : 'transparent',
                                '&:hover': { backgroundColor: 'rgba(129, 199, 132, 0.1)' },
                                transition: 'all 0.3s ease',
                                transform: animatingItems.has(message.id) ? 'scale(0.98)' : 'scale(1)',
                                flexDirection: isSmallScreen ? 'column' : 'row',
                                alignItems: isSmallScreen ? 'flex-start' : 'flex-start',
                                p: isSmallScreen ? 2 : 3
                              }}
                              onClick={() => handleViewMessage(message)}
                            >
                              <ListItemAvatar>
                                <Badge
                                  color="error"
                                  variant="dot"
                                  invisible={!message.unread}
                                >
                                  <Avatar sx={{ 
                                    width: isSmallScreen ? 40 : 48, 
                                    height: isSmallScreen ? 40 : 48, 
                                    bgcolor: message.type === 'announcement' ? '#1565c0' : '#2e7d32',
                                    fontSize: isSmallScreen ? '14px' : '16px',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.1)'
                                    }
                                  }}>
                                    {message.senderAvatar}
                                  </Avatar>
                                </Badge>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Typography variant={isSmallScreen ? "subtitle2" : "subtitle1"} sx={{ fontWeight: message.unread ? 600 : 500, color: '#1b5e20' }}>
                                      {message.sender}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Chip
                                        label={message.priority}
                                        size="small"
                                        sx={{
                                          backgroundColor: getPriorityColor(message.priority),
                                          color: 'white',
                                          fontWeight: 500,
                                          fontSize: isSmallScreen ? '0.7rem' : '0.75rem'
                                        }}
                                      />
                                      <Typography variant="caption" color="#4caf50">
                                        {formatTime(message.timestamp)}
                                      </Typography>
                                    </Box>
                                  </Box>
                                }
                                secondary={
                                  <Box>
                                    <Typography
                                      variant={isSmallScreen ? "body2" : "subtitle2"}
                                      sx={{ 
                                        fontWeight: message.unread ? 600 : 500, 
                                        mb: 0.5,
                                        color: '#2e7d32'
                                      }}
                                    >
                                      {message.subject}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="#4caf50"
                                      sx={{
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: isSmallScreen ? 2 : 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                      }}
                                    >
                                      {message.preview}
                                    </Typography>
                                  </Box>
                                }
                              />
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: isSmallScreen ? 'row' : 'column',
                                gap: 0.5,
                                mt: isSmallScreen ? 1 : 0,
                                alignSelf: isSmallScreen ? 'flex-end' : 'center'
                              }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(message.id);
                                  }}
                                  sx={{ color: '#2e7d32' }}
                                >
                                  <ReadIcon fontSize={isSmallScreen ? "small" : "medium"} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMessage(message.id);
                                  }}
                                  sx={{ color: '#d32f2f' }}
                                >
                                  <DeleteIcon fontSize={isSmallScreen ? "small" : "medium"} />
                                </IconButton>
                              </Box>
                            </ListItem>
                            {index < filteredMessages.length - 1 && <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(46, 125, 50, 0.2)' }} />}
                          </Box>
                        </Slide>
                      ))
                    )}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Notifications Sidebar - Desktop Only */}
          {!isMobile && (
            <Grid item xs={12} md={4}>
              <Fade in={true} timeout={900}>
                <Card sx={{ 
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  background: 'linear-gradient(to right, #ffffff, #e3f2fd)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1565c0' }}>
                        Recent Notifications
                      </Typography>
                      <Button
                        size="small"
                        onClick={handleClearAllNotifications}
                        disabled={unreadNotificationsCount === 0}
                        sx={{
                          color: '#1565c0',
                          '&:hover': {
                            backgroundColor: 'rgba(21, 101, 192, 0.1)'
                          }
                        }}
                      >
                        Clear All
                      </Button>
                    </Box>
                    <List dense>
                      {notifications.slice(0, 5).map((notification, index) => (
                        <Slide 
                          key={notification.id} 
                          direction="up" 
                          in={true} 
                          timeout={500}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <ListItem
                            sx={{
                              backgroundColor: notification.read ? 'transparent' : 'rgba(21, 101, 192, 0.1)',
                              borderRadius: 2,
                              mb: 1,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(21, 101, 192, 0.2)'
                              }
                            }}
                          >
                            <ListItemIcon>
                              <Avatar sx={{ 
                                width: 36, 
                                height: 36, 
                                bgcolor: '#1565c0'
                              }}>
                                <NotificationsIcon />
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: notification.read ? 400 : 600, color: '#1565c0' }}>
                                    {notification.title}
                                  </Typography>
                                  <Typography variant="caption" color="#42a5f5">
                                    {formatTime(notification.timestamp)}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography variant="body2" color="#1976d2">
                                  {notification.description}
                                </Typography>
                              }
                            />
                          </ListItem>
                        </Slide>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          )}
        </Grid>
      )}

      {tabValue === 1 && (
        <Fade in={true} timeout={700}>
          <Card sx={{ 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(to right, #ffffff, #e3f2fd)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            }
          }}>
            <CardContent sx={{ p: isSmallScreen ? 3 : 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: isSmallScreen ? 48 : 64, color: '#42a5f5', mb: 2 }} />
              <Typography variant={isSmallScreen ? "h6" : "h5"} color="#1565c0" gutterBottom>
                Notification Center
              </Typography>
              <Typography variant="body2" color="#1976d2" sx={{ mb: 3 }}>
                View and manage all notifications
              </Typography>
              <Button 
                variant="contained" 
                sx={{
                  bgcolor: '#1565c0',
                  '&:hover': { bgcolor: '#0d47a1' }
                }}
              >
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </Fade>
      )}

      {tabValue === 2 && (
        <Fade in={true} timeout={700}>
          <Card sx={{ 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(to right, #ffffff, #e0f2f1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            }
          }}>
            <CardContent sx={{ p: isSmallScreen ? 3 : 4, textAlign: 'center' }}>
              <AnnouncementIcon sx={{ fontSize: isSmallScreen ? 48 : 64, color: '#26a69a', mb: 2 }} />
              <Typography variant={isSmallScreen ? "h6" : "h5"} color="#00897b" gutterBottom>
                Announcement History
              </Typography>
              <Typography variant="body2" color="#26a69a" sx={{ mb: 3 }}>
                View and manage all announcements
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleComposeOpen}
                sx={{
                  bgcolor: '#00897b',
                  '&:hover': { bgcolor: '#00695c' }
                }}
              >
                Create Announcement
              </Button>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Compose Message Dialog */}
      <Dialog 
        open={composeOpen} 
        onClose={handleComposeClose}
        maxWidth="md"
        fullWidth
        fullScreen={isSmallScreen}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? 0 : '16px',
            background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }
        }}
        TransitionComponent={Slide}
        transitionDuration={500}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'rgba(46, 125, 50, 0.2)', 
          pb: 2,
          backgroundColor: 'rgba(46, 125, 50, 0.05)'
        }}>
          <Typography variant={isSmallScreen ? "h6" : "h5"} sx={{ fontWeight: 600, color: '#1b5e20' }}>
            Compose Message
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={isSmallScreen ? 2 : 3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Recipient Type"
                value={composeForm.recipientType}
                onChange={(e) => setComposeForm({ ...composeForm, recipientType: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#2e7d32'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32'
                    }
                  }
                }}
              >
                {recipientTypes.map(type => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ color: '#2e7d32', mr: 1 }}>{type.icon}</Box>
                      <Typography>{type.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                value={composeForm.priority}
                onChange={(e) => setComposeForm({ ...composeForm, priority: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#2e7d32'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32'
                    }
                  }
                }}
              >
                {priorityTypes.map(priority => (
                  <MenuItem key={priority.value} value={priority.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: priority.color,
                          mr: 1
                        }} 
                      />
                      <Typography>{priority.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={composeForm.subject}
                onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                placeholder="Enter message subject..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
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
                label="Message"
                value={composeForm.message}
                onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                multiline
                rows={isSmallScreen ? 4 : 6}
                placeholder="Type your message here..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
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
              <Accordion sx={{ 
                backgroundColor: 'rgba(46, 125, 50, 0.05)',
                '&:before': {
                  display: 'none'
                }
              }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#2e7d32' }} />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ScheduleIcon sx={{ color: '#2e7d32', mr: 1 }} />
                    <Typography sx={{ color: '#2e7d32' }}>Schedule Message</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Schedule Date & Time"
                    value={composeForm.scheduledDate}
                    onChange={(e) => setComposeForm({ ...composeForm, scheduledDate: e.target.value })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: '#2e7d32'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2e7d32'
                        }
                      }
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'rgba(46, 125, 50, 0.2)' }}>
          <Button 
            onClick={handleComposeClose} 
            variant="outlined"
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
            onClick={handleSendMessage} 
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' }
            }}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Message Dialog */}
      <Dialog 
        open={viewOpen} 
        onClose={handleViewClose}
        maxWidth="md"
        fullWidth
        fullScreen={isSmallScreen}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? 0 : '16px',
            background: 'linear-gradient(to right, #ffffff, #f1f8e9)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }
        }}
        TransitionComponent={Slide}
        transitionDuration={500}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid', 
          borderColor: 'rgba(46, 125, 50, 0.2)', 
          pb: 2,
          backgroundColor: 'rgba(46, 125, 50, 0.05)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant={isSmallScreen ? "h6" : "h5"} sx={{ fontWeight: 600, color: '#1b5e20' }}>
                {selectedMessage?.subject}
              </Typography>
              <Typography variant="body2" color="#2e7d32">
                From: {selectedMessage?.sender} • {formatTime(selectedMessage?.timestamp)}
              </Typography>
            </Box>
            <IconButton onClick={handleViewClose} sx={{ color: '#2e7d32' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" paragraph sx={{ color: '#37474f', lineHeight: 1.6 }}>
            {selectedMessage?.fullContent}
          </Typography>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(46, 125, 50, 0.2)' }} />
          
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1b5e20', mb: 2 }}>
            Conversation History
          </Typography>
          
          <Box sx={{ maxHeight: isSmallScreen ? 200 : 300, overflowY: 'auto', pr: 1 }}>
            {selectedMessage?.replies.map((reply, index) => (
              <Fade key={reply.id} in={true} timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                      {reply.sender}
                    </Typography>
                    <Typography variant="caption" color="#4caf50">
                      {formatTime(reply.timestamp)}
                    </Typography>
                  </Box>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      backgroundColor: reply.isReply ? 'rgba(46, 125, 50, 0.05)' : 'rgba(21, 101, 192, 0.05)',
                      borderLeft: `3px solid ${reply.isReply ? '#2e7d32' : '#1565c0'}`
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#37474f', lineHeight: 1.6 }}>
                      {reply.content}
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            ))}
            <div ref={messagesEndRef} />
          </Box>
          
          <Collapse in={replyOpen}>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={isSmallScreen ? 3 : 4}
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#2e7d32'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#2e7d32'
                    }
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                  onClick={handleReplyClose}
                  sx={{
                    mr: 1,
                    color: '#2e7d32'
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendReply}
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{
                    bgcolor: '#2e7d32',
                    '&:hover': { bgcolor: '#1b5e20' }
                  }}
                >
                  Send Reply
                </Button>
              </Box>
            </Box>
          </Collapse>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'rgba(46, 125, 50, 0.2)' }}>
          <Button 
            onClick={handleViewClose} 
            variant="outlined"
            sx={{
              borderColor: '#2e7d32',
              color: '#2e7d32',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)'
              }
            }}
          >
            Close
          </Button>
          <Button 
            variant="contained"
            startIcon={<ReplyIcon />}
            onClick={replyOpen ? handleSendReply : handleReplyOpen}
            sx={{
              bgcolor: '#2e7d32',
              '&:hover': { bgcolor: '#1b5e20' }
            }}
          >
            {replyOpen ? 'Send Reply' : 'Reply'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="compose message"
          onClick={handleComposeOpen}
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Slide}
        transitionDuration={300}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default MessagesPage;