import { useState, useEffect } from 'react';
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
  MenuItem as MenuItemComponent,
  ListItemIcon,
  ListItemText
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
  Login as LoginIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

const PageStatusChip = styled(Chip)(({ theme, status }) => ({
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
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
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
      // Simulate API call - replace with actual API
      const mockPages = [
        {
          id: 1,
          title: 'Home Page',
          slug: 'home',
          content: '<p>Welcome to Literacy Tree School...</p>',
          status: 'published',
          metaTitle: 'Literacy Tree School - Home',
          metaDescription: 'Welcome to Literacy Tree School',
          isHomePage: true,
          isPublished: true,
          publishedAt: '2024-01-15T10:00:00Z',
          template: 'home',
          featuredImage: '/images/home-hero.jpg',
          author: 'Admin',
          category: 'general',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z'
        },
        {
          id: 2,
          title: 'About Us',
          slug: 'about',
          content: '<p>Learn about our school...</p>',
          status: 'published',
          metaTitle: 'About Us - Literacy Tree School',
          metaDescription: 'Learn about Literacy Tree School',
          isHomePage: false,
          isPublished: true,
          publishedAt: '2024-01-16T11:00:00Z',
          template: 'about',
          featuredImage: '/images/about-us.jpg',
          author: 'Admin',
          category: 'general',
          createdAt: '2024-01-16T11:00:00Z',
          updatedAt: '2024-01-18T16:45:00Z'
        },
        {
          id: 3,
          title: 'Contact Us',
          slug: 'contact',
          content: '<p>Get in touch with us...</p>',
          status: 'published',
          metaTitle: 'Contact Us - Literacy Tree School',
          metaDescription: 'Contact information for Literacy Tree School',
          isHomePage: false,
          isPublished: true,
          publishedAt: '2024-01-17T09:00:00Z',
          template: 'contact',
          featuredImage: '/images/contact-us.jpg',
          author: 'Admin',
          category: 'general',
          createdAt: '2024-01-17T09:00:00Z',
          updatedAt: '2024-01-19T13:20:00Z'
        },
        {
          id: 4,
          title: 'Admissions',
          slug: 'admissions',
          content: '<p>Join our school...</p>',
          status: 'published',
          metaTitle: 'Admissions - Literacy Tree School',
          metaDescription: 'Admission information for Literacy Tree School',
          isHomePage: false,
          isPublished: true,
          publishedAt: '2024-01-18T10:00:00Z',
          template: 'admissions',
          featuredImage: '/images/admissions.jpg',
          author: 'Admin',
          category: 'admissions',
          createdAt: '2024-01-18T10:00:00Z',
          updatedAt: '2024-01-20T11:30:00Z'
        },
        {
          id: 5,
          title: 'Programs',
          slug: 'programs',
          content: '<p>Explore our programs...</p>',
          status: 'published',
          metaTitle: 'Programs - Literacy Tree School',
          metaDescription: 'Academic programs at Literacy Tree School',
          isHomePage: false,
          isPublished: true,
          publishedAt: '2024-01-19T10:00:00Z',
          template: 'programs',
          featuredImage: '/images/programs.jpg',
          author: 'Admin',
          category: 'academic',
          createdAt: '2024-01-19T10:00:00Z',
          updatedAt: '2024-01-21T14:30:00Z'
        },
        {
          id: 6,
          title: 'Enroll Now',
          slug: 'enroll',
          content: '<p>Start your enrollment process...</p>',
          status: 'published',
          metaTitle: 'Enroll Now - Literacy Tree School',
          metaDescription: 'Enrollment information for Literacy Tree School',
          isHomePage: false,
          isPublished: true,
          publishedAt: '2024-01-20T10:00:00Z',
          template: 'enroll',
          featuredImage: '/images/enroll.jpg',
          author: 'Admin',
          category: 'admissions',
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-22T09:15:00Z'
        },
        {
          id: 7,
          title: 'Login',
          slug: 'login',
          content: '<p>Login to your account...</p>',
          status: 'published',
          metaTitle: 'Login - Literacy Tree School',
          metaDescription: 'Login to Literacy Tree School portal',
          isHomePage: false,
          isPublished: true,
          publishedAt: '2024-01-21T10:00:00Z',
          template: 'login',
          featuredImage: '/images/login.jpg',
          author: 'Admin',
          category: 'general',
          createdAt: '2024-01-21T10:00:00Z',
          updatedAt: '2024-01-23T16:45:00Z'
        }
      ];
      setPages(mockPages);
    } catch (error) {
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
      author: 'Admin',
      category: 'general'
    });
    setOpenDialog(true);
  };

  const handleEditPage = (page) => {
    setEditingPage(page);
    setFormData({
      ...page,
      publishedAt: page.publishedAt ? new Date(page.publishedAt).toISOString().slice(0, 16) : ''
    });
    setOpenDialog(true);
  };

  const handleSavePage = async () => {
    try {
      // Simulate API call - replace with actual API
      const newPage = {
        ...formData,
        id: editingPage ? editingPage.id : Date.now(),
        createdAt: editingPage ? editingPage.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublished: formData.status === 'published'
      };

      if (editingPage) {
        setPages(pages.map(p => p.id === editingPage.id ? newPage : p));
        setSnackbar({ open: true, message: 'Page updated successfully', severity: 'success' });
      } else {
        setPages([...pages, newPage]);
        setSnackbar({ open: true, message: 'Page created successfully', severity: 'success' });
      }

      setOpenDialog(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save page', severity: 'error' });
    }
  };

  const handleDeletePage = async () => {
    try {
      // Simulate API call - replace with actual API
      setPages(pages.filter(p => p.id !== selectedPage.id));
      setSnackbar({ open: true, message: 'Page deleted successfully', severity: 'success' });
      setDeleteDialogOpen(false);
      setSelectedPage(null);
    } catch (error) {
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

  const handleStatusChange = (pageId, newStatus) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? { ...page, status: newStatus, isPublished: newStatus === 'published' }
        : page
    ));
    setSnackbar({ open: true, message: 'Page status updated', severity: 'success' });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
      metaTitle: formData.metaTitle || title
    });
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <PublicIcon />;
      case 'draft': return <DraftIcon />;
      case 'scheduled': return <ScheduleIcon />;
      default: return <DraftIcon />;
    }
  };

  const getTemplateIcon = (template) => {
    const templateObj = pageTemplates.find(t => t.value === template);
    return templateObj ? templateObj.icon : <DescriptionIcon />;
  };

  // Predefined page options for quick creation
  const predefinedPages = [
    { title: 'Home Page', slug: 'home', template: 'home', category: 'general' },
    { title: 'About Us', slug: 'about', template: 'about', category: 'general' },
    { title: 'Contact Us', slug: 'contact', template: 'contact', category: 'general' },
    { title: 'Admissions', slug: 'admissions', template: 'admissions', category: 'admissions' },
    { title: 'Programs', slug: 'programs', template: 'programs', category: 'academic' },
    { title: 'Enroll Now', slug: 'enroll', template: 'enroll', category: 'admissions' },
    { title: 'Login', slug: 'login', template: 'login', category: 'general' }
  ];

  const handleCreatePredefinedPage = (predefinedPage) => {
    setEditingPage(null);
    setFormData({
      title: predefinedPage.title,
      slug: predefinedPage.slug,
      content: '',
      status: 'draft',
      metaTitle: predefinedPage.title,
      metaDescription: '',
      isHomePage: predefinedPage.slug === 'home',
      isPublished: false,
      publishedAt: null,
      template: predefinedPage.template,
      featuredImage: '',
      author: 'Admin',
      category: predefinedPage.category
    });
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1, color: '#2e7d32', fontWeight: 600 }}>
            Pages Management
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/admin">
              Dashboard
            </Link>
            <Typography color="text.primary">Pages</Typography>
          </Breadcrumbs>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreatePage}
          sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
        >
          Create Page
        </Button>
      </Box>

      {/* Predefined Pages Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
          Quick Create Standard Pages
        </Typography>
        <Grid container spacing={2}>
          {predefinedPages.map((page, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={getTemplateIcon(page.template)}
                onClick={() => handleCreatePredefinedPage(page)}
                sx={{ 
                  justifyContent: 'flex-start',
                  py: 1.5,
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                  '&:hover': {
                    backgroundColor: '#e8f5e9',
                    borderColor: '#1b5e20',
                  }
                }}
              >
                {page.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Search and Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchPages}
            sx={{ height: '56px' }}
          >
            Refresh
          </Button>
        </Grid>
      </Grid>

      {/* Pages Grid */}
      <Grid container spacing={3}>
        {filteredPages.map((page) => (
          <Grid item xs={12} md={6} lg={4} key={page.id}>
            <StyledCard>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#2e7d32' }}>
                      {getTemplateIcon(page.template)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {page.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        /{page.slug}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, page)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {page.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <PageStatusChip
                    size="small"
                    icon={getStatusIcon(page.status)}
                    label={page.status}
                    status={page.status}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ViewIcon />}
                    onClick={() => {
                      setSelectedPage(page);
                      setViewDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditPage(page)}
                  >
                    Edit
                  </Button>
                </Box>

                {page.isHomePage && (
                  <Chip
                    size="small"
                    icon={<HomeIcon />}
                    label="Home Page"
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredPages.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <DescriptionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No pages found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first page to get started'
            }
          </Typography>
          {!searchTerm && filterStatus === 'all' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreatePage}
              sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
            >
              Create Page
            </Button>
          )}
        </Box>
      )}

      {/* Floating Action Button */}
      <StyledFab
        color="primary"
        aria-label="add"
        onClick={handleCreatePage}
      >
        <AddIcon />
      </StyledFab>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItemComponent onClick={() => {
          if (selectedPage) {
            handleEditPage(selectedPage);
          }
          handleMenuClose();
        }}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => {
          if (selectedPage) {
            setSelectedPage(selectedPage);
            setViewDialogOpen(true);
          }
          handleMenuClose();
        }}>
          <ListItemIcon><ViewIcon /></ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItemComponent>
        <MenuItemComponent onClick={() => {
          if (selectedPage) {
            const newStatus = selectedPage.status === 'published' ? 'draft' : 'published';
            handleStatusChange(selectedPage.id, newStatus);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            {selectedPage?.status === 'published' ? <DraftIcon /> : <PublishIcon />}
          </ListItemIcon>
          <ListItemText>
            {selectedPage?.status === 'published' ? 'Unpublish' : 'Publish'}
          </ListItemText>
        </MenuItemComponent>
        <Divider />
        <MenuItemComponent onClick={() => {
          if (selectedPage) {
            setDeleteDialogOpen(true);
          }
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItemComponent>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {editingPage ? 'Edit Page' : 'Create New Page'}
        </DialogTitle>
        <DialogContent sx={{ minHeight: '600px' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Content
              </Typography>
              <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                <ReactQuill
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  modules={quillModules}
                  formats={quillFormats}
                  style={{ height: '200px' }}
                />
              </Box>
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
        <DialogTitle>
          {selectedPage?.title}
        </DialogTitle>
        <DialogContent>
          {selectedPage && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  URL: /{selectedPage.slug}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Status: <PageStatusChip
                    size="small"
                    icon={getStatusIcon(selectedPage.status)}
                    label={selectedPage.status}
                    status={selectedPage.status}
                  />
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box
                dangerouslySetInnerHTML={{ __html: selectedPage.content }}
                sx={{ 
                  '& img': { maxWidth: '100%', height: 'auto' },
                  '& a': { color: '#2e7d32' }
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Page</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedPage?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeletePage}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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
  );
};

export default PagesManagement;