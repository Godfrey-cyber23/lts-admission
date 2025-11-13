// src/components/AdminChatDashboard.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Menu
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Menu as MenuIcon,
  MarkChatRead as MarkChatReadIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, serverTimestamp, off } from 'firebase/database';

// Firebase configuration - same as in CustomChat
const firebaseConfig = {
  apiKey: "AIzaSyC9_p1FA0kxbHpCAyvhukWq2ZqIPDh3Vis",
  authDomain: "lts-admission-form.firebaseapp.com",
  databaseURL: "https://lts-admission-form-default-rtdb.firebaseio.com",
  projectId: "lts-admission-form",
  storageBucket: "lts-admission-form.firebasestorage.app",
  messagingSenderId: "469201694810",
  appId: "1:469201694810:web:c7675449c451b8a7bba863",
  measurementId: "G-SW94NFJB7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const AdminChatDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [sessions, setSessions] = useState({});
  const [selectedSession, setSelectedSession] = useState(null);
  const [message, setMessage] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [agentName, setAgentName] = useState("");
  const messagesEndRef = useRef(null); // Fixed: Using useRef instead of useState
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [sessionFilter, setSessionFilter] = useState('all');
  const [chatStatus, setChatStatus] = useState('online');
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [sessions, selectedSession, scrollToBottom]);

  // Check if user is authenticated as agent
  useEffect(() => {
    const agentStatus = localStorage.getItem('isAgent') === 'true';
    const savedAgentName = localStorage.getItem('agentName') || 'Support Agent';
    setIsAgent(agentStatus);
    setAgentName(savedAgentName);
    
    if (!agentStatus) {
      window.location.href = '/admin/login';
    }
  }, []);

  // Listen for active chat sessions
  useEffect(() => {
    const sessionsRef = ref(database, 'sessions');
    
    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        setSessions(data || {});
        setLoading(false);
        
        // Calculate unread counts for each session
        const counts = {};
        if (data) {
          Object.keys(data).forEach(sessionId => {
            const session = data[sessionId];
            const userMessages = session.messages ? 
              Object.values(session.messages).filter(msg => msg.sender === 'user' && !msg.read) : 
              [];
            
            counts[sessionId] = userMessages.length;
          });
          setUnreadCounts(counts);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        setSnackbar({ open: true, message: 'Error loading sessions', severity: 'error' });
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase error:', error);
      setSnackbar({ open: true, message: 'Connection error', severity: 'error' });
      setLoading(false);
    });

    return () => {
      // Fixed: Proper cleanup of Firebase listener
      off(sessionsRef);
    };
  }, []);

  // Cleanup typing indicator
  useEffect(() => {
    return () => {
      if (selectedSession) {
        set(ref(database, `sessions/${selectedSession}/status/agentTyping`), false);
      }
    };
  }, [selectedSession]);

  // Select a session to chat with
  const selectSession = (sessionId) => {
    setSelectedSession(sessionId);
    setMobileMenuAnchor(null);
    
    // Close drawer on mobile after selecting a session
    if (isMobile) {
      setDrawerOpen(false);
    }
    
    // Mark agent as online for this session
    set(ref(database, `sessions/${sessionId}/status/agentOnline`), true);
    
    // Mark all user messages in this session as read
    if (sessions[sessionId] && sessions[sessionId].messages) {
      Object.entries(sessions[sessionId].messages).forEach(([msgId, msg]) => {
        if (msg.sender === 'user' && !msg.read) {
          set(ref(database, `sessions/${sessionId}/messages/${msgId}/read`), true);
        }
      });
    }
    
    // Reset unread count for this session
    setUnreadCounts(prev => ({
      ...prev,
      [sessionId]: 0
    }));
  };

  // Send agent message
  const sendMessage = async () => {
    if (message.trim() === "" || !selectedSession) return;

    try {
      const messageData = {
        text: message.trim(),
        sender: "agent",
        senderName: agentName,
        timestamp: new Date().toISOString(),
        read: true
      };

      const messagesRef = ref(database, `sessions/${selectedSession}/messages`);
      await push(messagesRef, messageData);
      
      // Clear typing indicator
      await set(ref(database, `sessions/${selectedSession}/status/agentTyping`), false);
      
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbar({ open: true, message: 'Failed to send message', severity: 'error' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle typing indicator
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    if (selectedSession) {
      set(ref(database, `sessions/${selectedSession}/status/agentTyping`), e.target.value.trim() !== "");
    }
  };

  // End chat session
  const endChatSession = () => {
    if (selectedSession && window.confirm('Are you sure you want to end this chat session?')) {
      set(ref(database, `sessions/${selectedSession}/status/agentOnline`), false);
      
      const messagesRef = ref(database, `sessions/${selectedSession}/messages`);
      push(messagesRef, {
        text: `Chat session ended by ${agentName}`,
        sender: "system",
        timestamp: new Date().toISOString(),
        read: true
      });
      
      setSelectedSession(null);
      setSnackbar({ open: true, message: 'Chat session ended', severity: 'info' });
    }
  };

  // Format time
  const formatTime = (date) => {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '--:--';
    }
  };

  // Filter sessions based on status
  const filteredSessions = Object.keys(sessions).filter(sessionId => {
    const session = sessions[sessionId];
    if (!session || !session.status) return false;
    
    switch (sessionFilter) {
      case 'all':
        return true;
      case 'active':
        return session.status.userOnline && session.status.agentOnline;
      case 'waiting':
        return session.status.userOnline && !session.status.agentOnline;
      default:
        return true;
    }
  });

  // Get session status text
  const getSessionStatusText = (sessionId) => {
    const session = sessions[sessionId];
    if (!session || !session.status) return 'Offline';
    
    if (session.status.userOnline && session.status.agentOnline) return 'Active';
    if (session.status.userOnline && !session.status.agentOnline) return 'Waiting';
    return 'Offline';
  };

  // Get session status color
  const getSessionStatusColor = (sessionId) => {
    const status = getSessionStatusText(sessionId);
    switch (status) {
      case 'Active': return '#4caf50';
      case 'Waiting': return '#ff9800';
      case 'Offline': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  // Handle agent status change
  const handleStatusChange = (newStatus) => {
    setChatStatus(newStatus);
    
    Object.keys(sessions).forEach(sessionId => {
      const session = sessions[sessionId];
      if (session && session.status && session.status.agentOnline) {
        set(ref(database, `sessions/${sessionId}/status/agentStatus`), newStatus);
      }
    });
  };

  // Handle mobile menu
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Toggle drawer for mobile
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  if (!isAgent) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Verifying authentication...</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading chat sessions...</Typography>
      </Box>
    );
  }

  // Mobile layout with drawer
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* Mobile App Bar */}
        <AppBar position="fixed" sx={{ zIndex: 1100 }}>
          <Toolbar>
            {!selectedSession ? (
              <>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                  Live Chat Sessions
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={handleMobileMenuOpen}
                >
                  <MoreVertIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  onClick={() => setSelectedSession(null)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Session {selectedSession.substring(0, 8)}...
                </Typography>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  onClick={endChatSession}
                >
                  <CloseIcon />
                </IconButton>
              </>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
        >
          <MenuItem onClick={() => { setSessionFilter('all'); handleMobileMenuClose(); }}>
            All Sessions
          </MenuItem>
          <MenuItem onClick={() => { setSessionFilter('active'); handleMobileMenuClose(); }}>
            Active Sessions
          </MenuItem>
          <MenuItem onClick={() => { setSessionFilter('waiting'); handleMobileMenuClose(); }}>
            Waiting Sessions
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { handleStatusChange('online'); handleMobileMenuClose(); }}>
            <Chip label="Online" size="small" sx={{ backgroundColor: '#4caf50', color: 'white', mr: 1 }} />
          </MenuItem>
          <MenuItem onClick={() => { handleStatusChange('away'); handleMobileMenuClose(); }}>
            <Chip label="Away" size="small" sx={{ backgroundColor: '#ff9800', color: 'white', mr: 1 }} />
          </MenuItem>
          <MenuItem onClick={() => { handleStatusChange('busy'); handleMobileMenuClose(); }}>
            <Chip label="Busy" size="small" sx={{ backgroundColor: '#f44336', color: 'white', mr: 1 }} />
          </MenuItem>
        </Menu>

        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          pt: 8, // Offset for the AppBar
          height: '100vh'
        }}>
          {!selectedSession ? (
            /* Session List for Mobile */
            <>
              {/* Filter tabs */}
              <Box sx={{ borderBottom: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
                <Tabs
                  value={sessionFilter}
                  onChange={(e, newValue) => setSessionFilter(newValue)}
                  variant="fullWidth"
                >
                  <Tab label="All" value="all" />
                  <Tab label="Active" value="active" />
                  <Tab label="Waiting" value="waiting" />
                </Tabs>
              </Box>
              
              {/* Sessions list */}
              <Box sx={{ flex: 1, overflow: 'auto', p: 1, backgroundColor: '#fff' }}>
                {filteredSessions.length === 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '50%',
                    pt: 4
                  }}>
                    <PersonIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                    <Typography variant="body2" color="#ccc" align="center">
                      {sessionFilter === 'all' ? 'No chat sessions yet' : 
                       sessionFilter === 'active' ? 'No active sessions' : 'No waiting sessions'}
                    </Typography>
                  </Box>
                ) : (
                  filteredSessions.map(sessionId => {
                    const session = sessions[sessionId];
                    const lastMessage = session.messages ? 
                      Object.values(session.messages).pop() : 
                      null;
                    
                    return (
                      <Box
                        key={sessionId}
                        onClick={() => selectSession(sessionId)}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          backgroundColor: selectedSession === sessionId ? '#f5f5f5' : 'transparent',
                          '&:hover': {
                            backgroundColor: '#f0f0f0'
                          },
                          borderBottom: '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Badge 
                            badgeContent={unreadCounts[sessionId] || 0} 
                            color="error"
                            sx={{ mr: 1 }}
                          >
                            <Avatar sx={{ 
                              width: 36, 
                              height: 36, 
                              fontSize: 14,
                              fontWeight: 600,
                              backgroundColor: getSessionStatusColor(sessionId)
                            }}>
                              U
                            </Avatar>
                          </Badge>
                          
                          <Box sx={{ flex: 1, ml: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Session {sessionId.substring(0, 8)}...
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#666' }}>
                              {getSessionStatusText(sessionId)}
                            </Typography>
                          </Box>
                          
                          {(unreadCounts[sessionId] || 0) > 0 && (
                            <Chip 
                              label={unreadCounts[sessionId]} 
                              size="small"
                              color="error"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                        
                        {lastMessage && (
                          <Typography variant="caption" sx={{ 
                            color: '#666',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block'
                          }}>
                            {lastMessage.sender === 'user' ? 'User: ' : 'You: '}
                            {lastMessage.text.substring(0, 40)}
                            {lastMessage.text.length > 40 ? '...' : ''}
                          </Typography>
                        )}
                      </Box>
                    );
                  })
                )}
              </Box>
            </>
          ) : (
            /* Chat Panel for Mobile */
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              backgroundColor: '#fff'
            }}>
              {/* Messages area */}
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {sessions[selectedSession]?.messages ? (
                  Object.entries(sessions[selectedSession].messages).map(([messageId, message]) => (
                    <Box
                      key={messageId}
                      sx={{
                        alignSelf: message.sender === 'user' ? 'flex-start' : 'flex-end',
                        maxWidth: '80%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'user' ? '#e8f5e9' : '#2e7d32',
                          color: message.sender === 'user' ? '#333' : '#fff',
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Typography variant="body2">
                          {message.text}
                        </Typography>
                      </Box>
                      
                      <Typography variant="caption" sx={{ 
                        color: '#666',
                        mt: 0.5,
                        alignSelf: message.sender === 'user' ? 'flex-start' : 'flex-end'
                      }}>
                        {message.senderName && `${message.senderName} • `}
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%'
                  }}>
                    <Typography variant="body2" color="#ccc">
                      No messages yet. Start the conversation!
                    </Typography>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>
              
              {/* Typing indicator */}
              {sessions[selectedSession]?.status?.userTyping && (
                <Box sx={{ 
                  p: 2, 
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    alignSelf: 'flex-start'
                  }}>
                    <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                      User is typing...
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {/* Message input */}
              <Box sx={{ 
                p: 2, 
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1
              }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type your response..."
                  value={message}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  endIcon={<SendIcon />}
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  sx={{
                    backgroundColor: '#2e7d32',
                    '&:hover': {
                      backgroundColor: '#1b5e20'
                    },
                    '&:disabled': {
                      backgroundColor: '#ccc'
                    }
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  // Desktop layout
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar with session list */}
      <Box sx={{ 
        width: 350, 
        backgroundColor: '#fff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Live Chat Sessions
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              label={chatStatus} 
              size="small"
              onClick={() => {
                const nextStatus = chatStatus === 'online' ? 'away' : 
                                chatStatus === 'away' ? 'busy' : 'online';
                handleStatusChange(nextStatus);
              }}
              sx={{
                backgroundColor: chatStatus === 'online' ? '#4caf50' : 
                               chatStatus === 'away' ? '#ff9800' : '#f44336',
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            />
          </Box>
        </Box>
        
        {/* Filter tabs */}
        <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Tabs
            value={sessionFilter}
            onChange={(e, newValue) => setSessionFilter(newValue)}
            variant="fullWidth"
            size="small"
          >
            <Tab label="All" value="all" />
            <Tab label="Active" value="active" />
            <Tab label="Waiting" value="waiting" />
          </Tabs>
        </Box>
        
        {/* Sessions list */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          {filteredSessions.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '50%',
              pt: 4
            }}>
              <PersonIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="body2" color="#ccc" align="center">
                {sessionFilter === 'all' ? 'No chat sessions yet' : 
                 sessionFilter === 'active' ? 'No active sessions' : 'No waiting sessions'}
              </Typography>
            </Box>
          ) : (
            filteredSessions.map(sessionId => {
              const session = sessions[sessionId];
              const lastMessage = session.messages ? 
                Object.values(session.messages).pop() : 
                null;
              
              return (
                <Box
                  key={sessionId}
                  onClick={() => selectSession(sessionId)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    backgroundColor: selectedSession === sessionId ? '#f5f5f5' : 'transparent',
                    '&:hover': {
                      backgroundColor: '#f0f0f0'
                    },
                    borderBottom: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Badge 
                      badgeContent={unreadCounts[sessionId] || 0} 
                      color="error"
                      sx={{ mr: 1 }}
                    >
                      <Avatar sx={{ 
                        width: 36, 
                        height: 36, 
                        fontSize: 14,
                        fontWeight: 600,
                        backgroundColor: getSessionStatusColor(sessionId)
                      }}>
                        U
                      </Avatar>
                    </Badge>
                    
                    <Box sx={{ flex: 1, ml: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Session {sessionId.substring(0, 8)}...
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {getSessionStatusText(sessionId)}
                      </Typography>
                    </Box>
                    
                    {(unreadCounts[sessionId] || 0) > 0 && (
                      <Chip 
                        label={unreadCounts[sessionId]} 
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  
                  {lastMessage && (
                    <Typography variant="caption" sx={{ 
                      color: '#666',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block'
                    }}>
                      {lastMessage.sender === 'user' ? 'User: ' : 'You: '}
                      {lastMessage.text.substring(0, 40)}
                      {lastMessage.text.length > 40 ? '...' : ''}
                    </Typography>
                  )}
                </Box>
              );
            })
          )}
        </Box>
      </Box>

      {/* Chat panel */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: '#fff',
        position: 'relative',
        height: '100vh',
        opacity: selectedSession ? 1 : 0.7,
        transition: 'opacity 0.3s ease'
      }}>
        {selectedSession ? (
          <>
            {/* Chat header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#2e7d32',
              color: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Session {selectedSession.substring(0, 8)}...
                </Typography>
                <Typography variant="caption" sx={{ color: '#e8f5e9', ml: 1 }}>
                  {agentName}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={chatStatus} 
                  size="small"
                  onClick={() => {
                    const nextStatus = chatStatus === 'online' ? 'away' : 
                                    chatStatus === 'away' ? 'busy' : 'online';
                    handleStatusChange(nextStatus);
                  }}
                  sx={{
                    backgroundColor: chatStatus === 'online' ? '#4caf50' : 
                                   chatStatus === 'away' ? '#ff9800' : '#f44336',
                    color: 'white',
                    cursor: 'pointer',
                    mr: 1
                  }}
                />
                
                <IconButton 
                  onClick={endChatSession}
                  sx={{ color: '#fff' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            
            {/* Messages area */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                {sessions[selectedSession]?.messages ? (
                  Object.entries(sessions[selectedSession].messages).map(([messageId, message]) => (
                    <Box
                      key={messageId}
                      sx={{
                        alignSelf: message.sender === 'user' ? 'flex-start' : 'flex-end',
                        maxWidth: '80%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: message.sender === 'user' ? '#e8f5e9' : '#2e7d32',
                          color: message.sender === 'user' ? '#333' : '#fff',
                          wordBreak: 'break-word',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}
                      >
                        <Typography variant="body2">
                          {message.text}
                        </Typography>
                      </Box>
                      
                      <Typography variant="caption" sx={{ 
                        color: '#666',
                        mt: 0.5,
                        alignSelf: message.sender === 'user' ? 'flex-start' : 'flex-end'
                      }}>
                        {message.senderName && `${message.senderName} • `}
                        {formatTime(message.timestamp)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%'
                  }}>
                    <Typography variant="body2" color="#ccc">
                      No messages yet. Start the conversation!
                    </Typography>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>
              
              {/* Typing indicator */}
              {sessions[selectedSession]?.status?.userTyping && (
                <Box sx={{ 
                  p: 2, 
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#f5f5f5',
                    alignSelf: 'flex-start'
                  }}>
                    <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                      User is typing...
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            
            {/* Message input */}
            <Box sx={{ 
              p: 2, 
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1
            }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Type your response..."
                value={message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Button 
                variant="contained" 
                endIcon={<SendIcon />}
                onClick={sendMessage}
                disabled={!message.trim()}
                sx={{
                  backgroundColor: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#1b5e20'
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc'
                  }
                }}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          /* No session selected state */
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            textAlign: 'center',
            p: 3
          }}>
            <GroupIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="#666" gutterBottom>
              No Chat Selected
            </Typography>
            <Typography variant="body2" color="#999">
              {filteredSessions.length > 0 
                ? 'Select a chat session from the sidebar to start messaging'
                : 'No active chat sessions available'
              }
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminChatDashboard;