import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Fab,
  Switch,
  FormControlLabel,
  Divider,
  Breadcrumbs,
  Link,
  Avatar,
  Menu,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ContactMail as ContactMailIcon,
  Publish as PublishIcon,
  Drafts as DraftIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  HowToReg as EnrollIcon,
  Login as LoginIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../api/api';

// Import the JsonEditor and its schema
import JsonEditor from '../../components/JsonEditor';
import { homePageSchema } from '../../components/JsonEditor';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  backgroundColor: '#2e7d32',
  '&:hover': {
    backgroundColor: '#1b5e20',
  },
}));

const PageStatusChip = styled(Chip)(({ status }) => ({
  backgroundColor:
    status === 'published' ? '#4caf50' :
      status === 'draft' ? '#ff9800' :
        status === 'scheduled' ? '#2196f3' :
          '#9e9e9e',
  color: 'white',
  fontWeight: 500,
}));

const PagesManagement = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    isHomePage: false,
    isPublished: false,
    publishedAt: null,
    template: 'default',
    featuredImage: '',
    author: '',
    category: 'general'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Page templates
  const pageTemplates = [
    { value: 'default', label: 'Default', icon: <DescriptionIcon /> },
    { value: 'home', label: 'Home Page', icon: <HomeIcon /> },
    { value: 'about', label: 'About Us', icon: <InfoIcon /> },
    { value: 'contact', label: 'Contact', icon: <ContactMailIcon /> },
    { value: 'programs', label: 'Programs', icon: <SchoolIcon /> },
    { value: 'admissions', label: 'Admissions', icon: <SchoolIcon /> },
    { value: 'enroll', label: 'Enroll Now', icon: <EnrollIcon /> },
    { value: 'login', label: 'Login', icon: <LoginIcon /> },
    { value: 'events', label: 'Events', icon: <EventIcon /> },
  ];

  // Page categories
  const pageCategories = [
    { value: 'general', label: 'General' },
    { value: 'academic', label: 'Academic' },
    { value: 'admissions', label: 'Admissions' },
    { value: 'events', label: 'Events' },
    { value: 'news', label: 'News & Updates' },
    { value: 'policies', label: 'Policies' },
  ];

  // Quill editor modules
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  // Quill editor formats
  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image', 'video'
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pages');
      const pagesData = response.data.data?.pages || response.data.pages || [];
      setPages(pagesData);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setSnackbar({ open: true, message: 'Failed to fetch pages', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = () => {
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      status: 'draft',
      metaTitle: '',
      metaDescription: '',
      isHomePage: false,
      isPublished: false,
      publishedAt: null,
      template: 'default',
      featuredImage: '',
      author: '',
      category: 'general'
    });
    setOpenDialog(true);
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    let parsedContent = page.content;
    if (page.template === 'home' && typeof page.content === 'string') {
      try {
        parsedContent = JSON.parse(page.content);
      } catch (e) {
        console.error('Error parsing content:', e);
        parsedContent = { hero: { title: "Error parsing content" } };
      }
    }
    setFormData({
      ...page,
      content: parsedContent,
      publishedAt: page.publishedAt ? new Date(page.publishedAt).toISOString().slice(0, 16) : ''
    });
    setOpenDialog(true);
  };

  const handleSavePage = async () => {
  try {
    let contentToSave = formData.content;
    if (formData.template === 'home' && typeof formData.content === 'object') {
      contentToSave = JSON.stringify(formData.content);
    }
    
    // Use consistent field names that match your database
    const pageData = {
      title: formData.title,
      slug: formData.slug,
      content: contentToSave,
      status: formData.status,
      metaTitle: formData.metaTitle, // This maps to seoTitle in database
      metaDescription: formData.metaDescription, // This maps to seoDescription in database
      isHomePage: formData.isHomePage,
      isPublished: formData.status === 'published', // This maps to both isPublished and is_published
      publishedAt: formData.publishedAt,
      template: formData.template,
      featuredImage: formData.featuredImage,
      authorId: formData.author,
      category: formData.category,
      seoData: formData.seoData || {}
    };

    console.log('📤 Sending page data:', pageData);

    let response;
    if (editingPage) {
      response = await api.put(`/pages/${editingPage.id}`, pageData);
      const updatedPage = response.data.data || response.data;
      setPages(prevPages => prevPages.map(p => p.id === editingPage.id ? updatedPage : p));
      setSnackbar({ open: true, message: 'Page updated successfully', severity: 'success' });
    } else {
      response = await api.post('/pages', pageData);
      const newPage = response.data.data || response.data;
      setPages(prevPages => [...prevPages, newPage]);
      setSnackbar({ open: true, message: 'Page created successfully', severity: 'success' });
    }
    
    setOpenDialog(false);
  } catch (error) {
    console.error('❌ Error saving page:', error);
    console.error('🔍 Error response:', error.response);
    setSnackbar({ open: true, message: 'Failed to save page', severity: 'error' });
  }
};

  const handleDeletePage = async () => {
  try {
    // FIX: Use the identifier endpoint
    await api.delete(`/pages/${selectedPage.id}`);
    setPages(pages.filter(p => p.id !== selectedPage.id));
    setSnackbar({ open: true, message: 'Page deleted successfully', severity: 'success' });
    setDeleteDialogOpen(false);
    setSelectedPage(null);
  } catch (error) {
    console.error('Error deleting page:', error);
    setSnackbar({ open: true, message: 'Failed to delete page', severity: 'error' });
  }
};

  const handleMenuClick = (event, page) => {
    setAnchorEl(event.currentTarget);
    setSelectedPage(page);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPage(null);
  };

  const handleStatusChange = async (pageId, newStatus) => {
  try {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      // FIX: Use the identifier endpoint
      const response = await api.put(`/pages/${page.id}`, { 
        ...page, 
        status: newStatus, 
        isPublished: newStatus === 'published' 
      });
      const updatedPage = response.data.data || response.data;
      setPages(prevPages => prevPages.map(p => p.id === pageId ? updatedPage : p));
      setSnackbar({ open: true, message: 'Page status updated', severity: 'success' });
    }
  } catch (error) {
    console.error('Error updating page status:', error);
    setSnackbar({ open: true, message: 'Failed to update page status', severity: 'error' });
  }
};

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: formData.slug || generateSlug(title), metaTitle: formData.metaTitle || title });
  };

  const filteredPages = Array.isArray(pages) ? pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) || page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusIcon = (status) => {
    switch (status) { case 'published': return <PublicIcon />; case 'draft': return <DraftIcon />; case 'scheduled': return <ScheduleIcon />; default: return <DraftIcon />; }
  };

  const getTemplateIcon = (template) => {
    const templateObj = pageTemplates.find(t => t.value === template);
    return templateObj ? templateObj.icon : <DescriptionIcon />;
  };

  const predefinedPages = [
    { title: 'Home Page', slug: 'home', template: 'home', category: 'general' },
    { title: 'About Us', slug: 'about', template: 'about', category: 'general' },
    { title: 'Contact Us', slug: 'contact', template: 'contact', category: 'general' },
    { title: 'Admissions', slug: 'admissions', template: 'admissions', category: 'admissions' },
    { title: 'Programs', slug: 'programs', template: 'programs', category: 'academic' },
    { title: 'Enroll Now', slug: 'enroll', template: 'enroll', category: 'admissions' },
    { title: 'Login', slug: 'login', template: 'login', category: 'general' }
  ];

  // Add this function to your PagesManagement component
const getDefaultHomeContent = () => ({
  hero: {
    title: "Welcome To Literacy Tree School",
    subtitle: "Nurturing young minds for a brighter future through quality education and holistic development.",
    images: [
      { src: "/school-building.jpg", alt: "School campus with modern facilities" },
      { src: "/classroom.jpg", alt: "Students engaged in classroom learning" },
      { src: "/pre-school.jpg", alt: "Children playing in school playground" },
      { src: "/graduation.jpg", alt: "Graduation ceremony at our school" }
    ],
    buttons: [
      { text: "Apply Now", link: "/admission", icon: "arrow" },
      { text: "Our Programs", link: "/programs", icon: "graduation" }
    ]
  },
  stats: [
    { number: "15", label: "Years Experience", icon: "graduation" },
    { number: "7", label: "Grades Offered", icon: "book" },
    { number: "200", label: "Pupils Enrolled", icon: "users" },
    { number: "100", label: "School Placement", icon: "chart", suffix: "%" }
  ],
  about: {
    title: "About Our School",
    description: "Literacy Tree School is a premier educational institution located in Lusaka, Zambia, offering quality education from early childhood through upper primary levels. We believe that each child is an individual with his/her own unique temperament, needs, interests and abilities.",
    image: "/school-building.jpg",
    linkText: "Learn more about us",
    link: "/about"
  },
  programs: {
    title: "Our Academic Programs",
    subtitle: "Tailored education for every stage of development",
    items: [
      {
        title: "Nursery Section",
        description: "Play-based learning for ages 3-6 focusing on foundational skills",
        icon: "👶",
        image: "/classroom-2.jpg"
      },
      {
        title: "Lower Primary Section",
        description: "Comprehensive curriculum for Grades 1-7 with STEM emphasis",
        icon: "✏️",
        image: "/pre-school.jpg"
      },
      {
        title: "Upper Primary Section",
        description: "Preparation for international examinations and university",
        icon: "🎓",
        image: "/classroom.jpg"
      }
    ]
  },
  testimonials: {
    title: "What Parents Say",
    subtitle: "Hear from our school community",
    items: [
      {
        quote: "Literacy Tree has transformed my child's learning experience. The teachers are exceptional.",
        author: "Mrs. Banda, Parent",
        role: "Grade 3 Parent"
      }
    ]
  },
  cta: {
    title: "Ready to Join Our Community?",
    subtitle: "Applications for the 2025-2026 academic year are now open. Limited spaces available.",
    buttons: [
      { text: "Start Application", link: "/admission" },
      { text: "Contact Admissions", link: "/contact" }
    ]
  }
});

  const handleCreatePredefinedPage = (predefinedPage) => {
    setEditingPage(null);
    setFormData({
      title: predefinedPage.title, slug: predefinedPage.slug, content: '', status: 'draft',
      metaTitle: predefinedPage.title, metaDescription: '', isHomePage: predefinedPage.slug === 'home',
      isPublished: false, publishedAt: null, template: predefinedPage.template,
      featuredImage: '', author: '', category: predefinedPage.category
    });
    setOpenDialog(true);
  };

  // Helper to render structured content for the View dialog
  const renderStructuredContent = (content) => {
    return (
      <Box>
        {Object.entries(content).map(([key, value]) => (
          <Accordion key={key} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>{key}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Array.isArray(value) ? (
                <Box>
                  {value.map((item, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                      <Typography variant="subtitle2">Item {index + 1}</Typography>
                      {renderStructuredContent(item)}
                    </Box>
                  ))}
                </Box>
              ) : typeof value === 'object' && value !== null ? (
                renderStructuredContent(value)
              ) : (
                <Typography variant="body2">{value}</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px"><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, color: '#2e7d32', fontWeight: 600 }}>Pages Management</Typography>
          <Breadcrumbs aria-label="breadcrumb"><Link color="inherit" href="/admin">Dashboard</Link><Typography color="text.primary">Pages</Typography></Breadcrumbs>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreatePage} sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}>Create Page</Button>
      </Box>

      {/* Predefined Pages Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>Quick Create Standard Pages</Typography>
        <Grid container spacing={2}>
          {predefinedPages.map((page, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Button variant="outlined" fullWidth startIcon={getTemplateIcon(page.template)} onClick={() => handleCreatePredefinedPage(page)} sx={{ justifyContent: 'flex-start', py: 1.5, borderColor: '#2e7d32', color: '#2e7d32', '&:hover': { backgroundColor: '#e8f5e9', borderColor: '#1b5e20' } }}>{page.title}</Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField fullWidth placeholder="Search pages..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} /> }} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FormControl fullWidth><InputLabel>Status</InputLabel><Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status"><MenuItem value="all">All Status</MenuItem><MenuItem value="published">Published</MenuItem><MenuItem value="draft">Draft</MenuItem><MenuItem value="scheduled">Scheduled</MenuItem></Select></FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Button fullWidth variant="outlined" startIcon={<RefreshIcon />} onClick={fetchPages} sx={{ height: '56px' }}>Refresh</Button>
        </Grid>
      </Grid>

      {/* Pages Grid */}
      <Grid container spacing={3}>
        {filteredPages.map((page) => (
          <Grid key={page.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <StyledCard>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#2e7d32' }}>{getTemplateIcon(page.template)}</Avatar>
                    <Box><Typography variant="h6" sx={{ fontWeight: 600 }}>{page.title}</Typography><Typography variant="body2" color="text.secondary">/{page.slug}</Typography></Box>
                  </Box>
                  <IconButton size="small" onClick={(e) => handleMenuClick(e, page)}><MoreVertIcon /></IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{typeof page.content === 'string' ? page.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : JSON.stringify(page.content).substring(0, 100) + '...'}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <PageStatusChip size="small" icon={getStatusIcon(page.status)} label={page.status} status={page.status} />
                  <Typography variant="caption" color="text.secondary">{new Date(page.updatedAt).toLocaleDateString()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" startIcon={<ViewIcon />} onClick={() => { setSelectedPage(page); setViewDialogOpen(true); }}>View</Button>
                  <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditPage(page)}>Edit</Button>
                </Box>
                {page.isHomePage && <Chip size="small" icon={<HomeIcon />} label="Home Page" color="primary" sx={{ mt: 1 }} />}
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredPages.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>No pages found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Create your first page to get started'}</Typography>
          {!searchTerm && filterStatus === 'all' && <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreatePage} sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}>Create Page</Button>}
        </Box>
      )}

      {/* Floating Action Button */}
      <StyledFab color="primary" aria-label="add" onClick={handleCreatePage}><AddIcon /></StyledFab>

      {/* Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { if (selectedPage) { handleEditPage(selectedPage); } handleMenuClose(); }}><ListItemIcon><EditIcon /></ListItemIcon><ListItemText>Edit</ListItemText></MenuItem>
        <MenuItem onClick={() => { if (selectedPage) { setSelectedPage(selectedPage); setViewDialogOpen(true); } handleMenuClose(); }}><ListItemIcon><ViewIcon /></ListItemIcon><ListItemText>View</ListItemText></MenuItem>
        <MenuItem onClick={() => { if (selectedPage) { const newStatus = selectedPage.status === 'published' ? 'draft' : 'published'; handleStatusChange(selectedPage.id, newStatus); } handleMenuClose(); }}><ListItemIcon>{selectedPage?.status === 'published' ? <DraftIcon /> : <PublishIcon />}</ListItemIcon><ListItemText>{selectedPage?.status === 'published' ? 'Unpublish' : 'Publish'}</ListItemText></MenuItem>
        <Divider />
        <MenuItem onClick={() => { if (selectedPage) { setDeleteDialogOpen(true); } handleMenuClose(); }} sx={{ color: 'error.main' }}><ListItemIcon><DeleteIcon /></ListItemIcon><ListItemText>Delete</ListItemText></MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth sx={{ '& .MuiDialog-paper': { maxHeight: '90vh' } }}>
  <DialogTitle>
    {editingPage ? 'Edit Page' : 'Create New Page'}
    {formData.template === 'home' && (
      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
        Home Page - Using JSON Editor
      </Typography>
    )}
  </DialogTitle>
  <DialogContent sx={{ minHeight: '400px', overflow: 'hidden' }}>
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Page Title"
          value={formData.title}
          onChange={handleTitleChange}
          required
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="URL Slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          helperText="This will be used in the URL"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Template</InputLabel>
          <Select
            value={formData.template}
            onChange={(e) => setFormData({ ...formData, template: e.target.value })}
            label="Template"
          >
            {pageTemplates.map((template) => (
              <MenuItem key={template.value} value={template.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {template.icon}
                  {template.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            label="Category"
          >
            {pageCategories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      {/* Content Section - Updated for JSON Editor */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Content
        </Typography>
        {formData.template === 'home' ? (
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2, mb: 2, maxHeight: '500px', overflow: 'auto' }}>
            <Typography variant="body2" sx={{ mb: 2, color: 'primary.main' }}>
              Home Page Editor - Edit structured content using the form below
            </Typography>
            
            {/* JSON Editor for Home Page */}
            <JsonEditor
              value={typeof formData.content === 'object' ? formData.content : getDefaultHomeContent()}
              onChange={(newContent) => setFormData({ ...formData, content: newContent })}
              schema={homePageSchema}
            />
            
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Note:</strong> This content will be saved as JSON and rendered dynamically on the home page.
                Changes made here will immediately reflect on the live site.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <ReactQuill
              value={typeof formData.content === 'string' ? formData.content : ''}
              onChange={(value) => setFormData({ ...formData, content: value })}
              modules={quillModules}
              formats={quillFormats}
              style={{ height: '200px' }}
            />
          </Box>
        )}
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Featured Image URL"
          value={formData.featuredImage}
          onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
          helperText="Optional: URL to the featured image"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Meta Title"
          value={formData.metaTitle}
          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          helperText="SEO meta title (optional)"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Meta Description"
          value={formData.metaDescription}
          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          helperText="SEO meta description (optional)"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            label="Status"
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={formData.isHomePage}
              onChange={(e) => setFormData({ ...formData, isHomePage: e.target.checked })}
            />
          }
          label="Set as Home Page"
        />
      </Grid>
    </Grid>
  </DialogContent>
  <DialogActions sx={{ p: 3 }}>
    <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
      Cancel
    </Button>
    <Button
      onClick={handleSavePage}
      variant="contained"
      startIcon={<SaveIcon />}
      sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
    >
      {editingPage ? 'Update' : 'Create'}
    </Button>
  </DialogActions>
</Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedPage?.title}</DialogTitle>
        <DialogContent>
          {selectedPage && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">URL: /{selectedPage.slug}</Typography>
                <Typography variant="subtitle2" color="text.secondary">Status: <PageStatusChip size="small" icon={getStatusIcon(selectedPage.status)} label={selectedPage.status} status={selectedPage.status} /></Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              {selectedPage.template === 'home' && typeof selectedPage.content === 'string' ? (
                <Box>
                  {renderStructuredContent(JSON.parse(selectedPage.content))}
                </Box>
              ) : (
                <Box dangerouslySetInnerHTML={{ __html: selectedPage.content }} sx={{ '& img': { maxWidth: '100%', height: 'auto' }, '& a': { color: '#2e7d32' } }} />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Page</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete "{selectedPage?.title}"? This action cannot be undone.</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button><Button onClick={handleDeletePage} color="error" variant="contained">Delete</Button></DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PagesManagement;