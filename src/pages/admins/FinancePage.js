import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Fab,
  Tab,
  Tabs,
  LinearProgress,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Fade,
  Slide,
  Grow,
  Menu,
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
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import api from '../../api/api';

// Import PDF and Excel libraries
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Mock data for finance (replace with API calls)
const mockFinancialData = {
  summary: {
    totalRevenue: 125000,
    totalExpenses: 87500,
    pendingPayments: 24500,
    netBalance: 37500,
    monthlyGrowth: 12.5
  },
  recentTransactions: [
    {
      id: 1,
      studentName: 'John Smith',
      type: 'tuition',
      amount: 5000,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Term 1 Tuition Fee'
    },
    {
      id: 2,
      studentName: 'Sarah Johnson',
      type: 'transport',
      amount: 1200,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'pending',
      description: 'Monthly Transport Fee'
    },
    {
      id: 3,
      studentName: 'Mike Brown',
      type: 'tuition',
      amount: 5000,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      description: 'Term 1 Tuition Fee'
    },
    {
      id: 4,
      studentName: 'Emma Wilson',
      type: 'other',
      amount: 800,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'failed',
      description: 'Activity Fee'
    }
  ],
  feeStructure: [
    { grade: 'Pre-School', tuition: 4000, transport: 1200, activities: 500, total: 5700 },
    { grade: 'Grade 1-3', tuition: 4500, transport: 1200, activities: 600, total: 6300 },
    { grade: 'Grade 4-6', tuition: 5000, transport: 1200, activities: 700, total: 6900 },
    { grade: 'Grade 7-9', tuition: 5500, transport: 1200, activities: 800, total: 7500 }
  ],
  expenses: [
    { id: 1, category: 'Salaries', amount: 45000, date: new Date(), status: 'paid', description: 'Staff Salaries' },
    { id: 2, category: 'Utilities', amount: 15000, date: new Date(), status: 'pending', description: 'Electricity & Water' },
    { id: 3, category: 'Maintenance', amount: 8000, date: new Date(), status: 'paid', description: 'Building Maintenance' },
    { id: 4, category: 'Supplies', amount: 12000, date: new Date(), status: 'paid', description: 'Teaching Materials' }
  ]
};

const FinancePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bottomNavValue, setBottomNavValue] = useState(0);

  // Form state for new transaction
  const [transactionForm, setTransactionForm] = useState({
    studentName: '',
    type: 'tuition',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending'
  });

  const transactionTypes = [
    { value: 'tuition', label: 'Tuition Fee', color: '#3b82f6' },
    { value: 'transport', label: 'Transport Fee', color: '#10b981' },
    { value: 'activities', label: 'Activities Fee', color: '#8b5cf6' },
    { value: 'other', label: 'Other', color: '#6b7280' }
  ];

  const statusTypes = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'failed', label: 'Failed', color: 'error' }
  ];

  useEffect(() => {
    fetchFinancialData();
    // Trigger page animation after component mounts
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  useEffect(() => {
    // Trigger cards animation after data is loaded
    if (financialData) {
      setTimeout(() => setCardsVisible(true), 300);
      setTimeout(() => setTableVisible(true), 600);
    }
  }, [financialData]);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await api.get('/api/finance');
      // setFinancialData(response.data.data);
      
      // Using mock data for now
      setTimeout(() => {
        setFinancialData(mockFinancialData);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Failed to fetch financial data:', err);
      setError('Failed to load financial data');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setBottomNavValue(newValue);
    // Reset animation states for smooth transition
    setTableVisible(false);
    setTimeout(() => setTableVisible(true), 100);
  };

  const handleBottomNavChange = (event, newValue) => {
    setBottomNavValue(newValue);
    setTabValue(newValue);
    // Reset animation states for smooth transition
    setTableVisible(false);
    setTimeout(() => setTableVisible(true), 100);
  };

  const handleOpenDialog = (transaction = null) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setTransactionForm({
        ...transaction,
        date: new Date(transaction.date).toISOString().split('T')[0]
      });
    } else {
      setSelectedTransaction(null);
      setTransactionForm({
        studentName: '',
        type: 'tuition',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTransaction(null);
  };

  const handleSaveTransaction = async () => {
    try {
      if (selectedTransaction) {
        // Update transaction
        // await api.put(`/api/finance/transactions/${selectedTransaction.id}`, transactionForm);
      } else {
        // Create new transaction
        // await api.post('/api/finance/transactions', transactionForm);
      }
      fetchFinancialData();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setError('Failed to save transaction');
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        // await api.delete(`/api/finance/transactions/${transactionId}`);
        fetchFinancialData();
      } catch (err) {
        console.error('Failed to delete transaction:', err);
        setError('Failed to delete transaction');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZM', {
      style: 'currency',
      currency: 'ZMW'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const statusObj = statusTypes.find(s => s.value === status);
    return statusObj ? statusObj.color : 'default';
  };

  const getTypeColor = (type) => {
    const typeObj = transactionTypes.find(t => t.value === type);
    return typeObj ? typeObj.color : '#6b7280';
  };

  const handleExportMenuOpen = (event) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  // Enhanced Export Functions
  const exportToCSV = (data, headers, filename) => {
    const csvContent = [headers, ...data]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (data, headers, filename) => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = (title, headers, data, summary = null) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 22);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    let yPosition = 40;
    
    // Add summary if provided
    if (summary) {
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text('Financial Summary', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.text(`Total Revenue: ${formatCurrency(summary.totalRevenue)}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Total Expenses: ${formatCurrency(summary.totalExpenses)}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Pending Payments: ${formatCurrency(summary.pendingPayments)}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Net Balance: ${formatCurrency(summary.netBalance)}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Monthly Growth: +${summary.monthlyGrowth}%`, 20, yPosition);
      yPosition += 15;
    }
    
    // Table
    doc.autoTable({
      startY: yPosition,
      head: [headers],
      body: data,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Specific Export Functions with Format Options
  const exportTransactions = (format = 'csv') => {
    const headers = ['Student Name', 'Description', 'Type', 'Amount', 'Date', 'Status'];
    const data = filteredTransactions.map(transaction => [
      transaction.studentName,
      transaction.description,
      transactionTypes.find(t => t.value === transaction.type)?.label,
      formatCurrency(transaction.amount),
      new Date(transaction.date).toLocaleDateString(),
      statusTypes.find(s => s.value === transaction.status)?.label
    ]);
    
    if (format === 'pdf') {
      exportToPDF('Transactions Report', headers, data);
    } else if (format === 'excel') {
      exportToExcel(data, headers, 'transactions-report');
    } else {
      exportToCSV(data, headers, 'transactions-report');
    }
  };

  const exportFeeStructure = (format = 'csv') => {
    const headers = ['Grade Level', 'Tuition Fee', 'Transport Fee', 'Activities Fee', 'Total Fee'];
    const data = financialData.feeStructure.map(fee => [
      fee.grade,
      formatCurrency(fee.tuition),
      formatCurrency(fee.transport),
      formatCurrency(fee.activities),
      formatCurrency(fee.total)
    ]);
    
    if (format === 'pdf') {
      exportToPDF('Fee Structure', headers, data);
    } else if (format === 'excel') {
      exportToExcel(data, headers, 'fee-structure');
    } else {
      exportToCSV(data, headers, 'fee-structure');
    }
  };

  const exportExpenses = (format = 'csv') => {
    const headers = ['Category', 'Description', 'Amount', 'Date', 'Status'];
    const data = filteredExpenses.map(expense => [
      expense.category,
      expense.description,
      formatCurrency(expense.amount),
      new Date(expense.date).toLocaleDateString(),
      expense.status
    ]);
    
    if (format === 'pdf') {
      exportToPDF('Expenses Report', headers, data);
    } else if (format === 'excel') {
      exportToExcel(data, headers, 'expenses-report');
    } else {
      exportToCSV(data, headers, 'expenses-report');
    }
  };

  const generateComprehensiveReport = () => {
    // Create a comprehensive Excel workbook with multiple sheets
    const workbook = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ['Financial Summary', ''],
      ['Total Revenue', financialData.summary.totalRevenue],
      ['Total Expenses', financialData.summary.totalExpenses],
      ['Pending Payments', financialData.summary.pendingPayments],
      ['Net Balance', financialData.summary.netBalance],
      ['Monthly Growth', financialData.summary.monthlyGrowth + '%'],
      ['', ''],
      ['Report Generated', new Date().toLocaleDateString()]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Transactions Sheet
    const transactionsData = [
      ['Student Name', 'Description', 'Type', 'Amount', 'Date', 'Status'],
      ...filteredTransactions.map(transaction => [
        transaction.studentName,
        transaction.description,
        transactionTypes.find(t => t.value === transaction.type)?.label,
        transaction.amount,
        new Date(transaction.date).toLocaleDateString(),
        statusTypes.find(s => s.value === transaction.status)?.label
      ])
    ];
    const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');
    
    // Fee Structure Sheet
    const feeData = [
      ['Grade Level', 'Tuition Fee', 'Transport Fee', 'Activities Fee', 'Total Fee'],
      ...financialData.feeStructure.map(fee => [
        fee.grade,
        fee.tuition,
        fee.transport,
        fee.activities,
        fee.total
      ])
    ];
    const feeSheet = XLSX.utils.aoa_to_sheet(feeData);
    XLSX.utils.book_append_sheet(workbook, feeSheet, 'Fee Structure');
    
    // Expenses Sheet
    const expensesData = [
      ['Category', 'Description', 'Amount', 'Date', 'Status'],
      ...filteredExpenses.map(expense => [
        expense.category,
        expense.description,
        expense.amount,
        new Date(expense.date).toLocaleDateString(),
        expense.status
      ])
    ];
    const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
    XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Expenses');
    
    XLSX.writeFile(workbook, `comprehensive-financial-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Comprehensive Financial Report', 14, 22);
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    let yPosition = 45;
    
    // Financial Summary
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Financial Summary', 14, yPosition);
    yPosition += 12;
    
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const summary = financialData.summary;
    doc.text(`Total Revenue: ${formatCurrency(summary.totalRevenue)}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Total Expenses: ${formatCurrency(summary.totalExpenses)}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Pending Payments: ${formatCurrency(summary.pendingPayments)}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Net Balance: ${formatCurrency(summary.netBalance)}`, 20, yPosition);
    yPosition += 7;
    doc.text(`Monthly Growth: +${summary.monthlyGrowth}%`, 20, yPosition);
    yPosition += 15;
    
    // Transactions Table
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Recent Transactions', 14, yPosition);
    yPosition += 10;
    
    const transactionHeaders = ['Student', 'Type', 'Amount', 'Date', 'Status'];
    const transactionData = filteredTransactions.map(transaction => [
      transaction.studentName,
      transactionTypes.find(t => t.value === transaction.type)?.label,
      formatCurrency(transaction.amount),
      new Date(transaction.date).toLocaleDateString(),
      statusTypes.find(s => s.value === transaction.status)?.label
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [transactionHeaders],
      body: transactionData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Fee Structure Table
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Fee Structure', 14, yPosition);
    yPosition += 10;
    
    const feeHeaders = ['Grade Level', 'Tuition', 'Transport', 'Activities', 'Total'];
    const feeData = financialData.feeStructure.map(fee => [
      fee.grade,
      formatCurrency(fee.tuition),
      formatCurrency(fee.transport),
      formatCurrency(fee.activities),
      formatCurrency(fee.total)
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [feeHeaders],
      body: feeData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [16, 185, 129] }
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Expenses Table
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.text('Expenses', 14, yPosition);
    yPosition += 10;
    
    const expenseHeaders = ['Category', 'Description', 'Amount', 'Date', 'Status'];
    const expenseData = filteredExpenses.map(expense => [
      expense.category,
      expense.description,
      formatCurrency(expense.amount),
      new Date(expense.date).toLocaleDateString(),
      expense.status
    ]);
    
    doc.autoTable({
      startY: yPosition,
      head: [expenseHeaders],
      body: expenseData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [239, 68, 68] }
    });
    
    doc.save(`comprehensive-financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
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

  const filteredTransactions = financialData?.recentTransactions.filter(transaction => {
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesStatus && matchesType;
  }) || [];

  const filteredExpenses = financialData?.expenses.filter(expense => {
    return filterStatus === 'all' || expense.status === filterStatus;
  }) || [];

  // Mobile Transaction Card Component
  const MobileTransactionCard = ({ transaction, index }) => (
    <Grow in timeout={900 + index * 100} key={transaction.id}>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2, 
                  bgcolor: getTypeColor(transaction.type),
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  {transaction.studentName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(transaction.date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={statusTypes.find(s => s.value === transaction.status)?.label}
              color={getStatusColor(transaction.status)}
              size="small"
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {transaction.description}
            </Typography>
            <Chip
              label={transactionTypes.find(t => t.value === transaction.type)?.label}
              size="small"
              sx={{
                bgcolor: `${getTypeColor(transaction.type)}20`,
                color: getTypeColor(transaction.type),
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {formatCurrency(transaction.amount)}
            </Typography>
            <Box>
              <IconButton
                size="small"
                onClick={() => handleOpenDialog(transaction)}
                sx={{ 
                  color: 'primary.main',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: 'rgba(59, 130, 246, 0.1)'
                  }
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteTransaction(transaction.id)}
                sx={{ 
                  color: 'error.main',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    bgcolor: 'rgba(239, 68, 68, 0.1)'
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

  // Mobile Expense Card Component
  const MobileExpenseCard = ({ expense, index }) => (
    <Grow in timeout={900 + index * 100} key={expense.id}>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                {expense.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {expense.description}
              </Typography>
            </Box>
            <Chip
              label={expense.status}
              color={getStatusColor(expense.status)}
              size="small"
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
              {formatCurrency(expense.amount)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(expense.date).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grow>
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
        <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.primary }}>
          Filters
        </Typography>
        <IconButton onClick={() => setMobileFilterOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          select
          label="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          {statusTypes.map(status => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          select
          label="Filter by Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="all">All Types</MenuItem>
          {transactionTypes.map(type => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        
        <Button
          fullWidth
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExportMenuOpen}
          disabled={filteredTransactions.length === 0}
          sx={{ mb: 2 }}
        >
          Export
        </Button>
        
        <Menu
          anchorEl={exportMenuAnchor}
          open={Boolean(exportMenuAnchor)}
          onClose={handleExportMenuClose}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={() => { exportTransactions('csv'); handleExportMenuClose(); }}>CSV</MenuItem>
          <MenuItem onClick={() => { exportTransactions('pdf'); handleExportMenuClose(); }}>PDF</MenuItem>
          <MenuItem onClick={() => { exportTransactions('excel'); handleExportMenuClose(); }}>Excel</MenuItem>
        </Menu>
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
        <Typography variant="h6" sx={{ fontWeight: 600, color: greenColors.primary, mb: 2 }}>
          Finance Management
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem button onClick={() => { setBottomNavValue(0); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Transactions" />
          </ListItem>
          <ListItem button onClick={() => { setBottomNavValue(1); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <AccountIcon />
            </ListItemIcon>
            <ListItemText primary="Fee Structure" />
          </ListItem>
          <ListItem button onClick={() => { setBottomNavValue(2); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <PaymentIcon />
            </ListItemIcon>
            <ListItemText primary="Expenses" />
          </ListItem>
          <ListItem button onClick={() => { setBottomNavValue(3); setMobileMenuOpen(false); }}>
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

  if (loading && !financialData) {
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
          Loading Financial Data...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={pageLoaded} timeout={800}>
      <Box sx={{ 
        p: isMobile ? 1 : 3, 
        bgcolor: '#f8fafc', 
        minHeight: '100vh',
        pb: isMobile ? 7 : 0 // Add padding for bottom navigation on mobile
      }}>
        {/* Mobile Header */}
        {isMobile && (
          <AppBar position="fixed" sx={{ 
            top: 0, 
            left: 0, 
            right: 0,
            zIndex: 1100,
            backgroundColor: greenColors.primary,
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
                Finance Management
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
          <Slide direction="down" in={pageLoaded} timeout={1000}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Box>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1e293b' }}>
                  Finance Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage school finances, fees, and expenses
                </Typography>
              </Box>
              <Fab
                color="primary"
                aria-label="add transaction"
                onClick={() => handleOpenDialog()}
                sx={{
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <AddIcon />
              </Fab>
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

        {/* Financial Summary Cards - Responsive Layout */}
        <Grid container spacing={isMobile ? 1 : 3} sx={{ mb: 4 }}>
          {/* Mobile: Show 2 cards per row in 2 rows */}
          {isMobile ? (
            <>
              {/* First Row */}
              <Grid item xs={6}>
                <Grow in={cardsVisible} timeout={500} style={{ transformOrigin: '0 0 0' }}>
                  <Card 
                    sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1.5, 
                          transition: 'all 0.3s ease', 
                          '&:hover': { transform: 'scale(1.1)' },
                          bgcolor: '#10b981'
                        }}>
                          <TrendingUpIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>
                            {financialData ? formatCurrency(financialData.summary.totalRevenue) : 'ZMW 0'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            Total Revenue
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ 
                          height: 4, 
                          borderRadius: 2,
                          bgcolor: '#10b98120',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: '#10b981',
                            transition: 'all 0.5s ease'
                          }
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>

              <Grid item xs={6}>
                <Grow in={cardsVisible} timeout={700} style={{ transformOrigin: '0 0 0' }}>
                  <Card 
                    sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1.5, 
                          transition: 'all 0.3s ease', 
                          '&:hover': { transform: 'scale(1.1)' },
                          bgcolor: '#ef4444'
                        }}>
                          <PaymentIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444', fontSize: '0.9rem' }}>
                            {financialData ? formatCurrency(financialData.summary.totalExpenses) : 'ZMW 0'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            Total Expenses
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={60} 
                        sx={{ 
                          height: 4, 
                          borderRadius: 2,
                          bgcolor: '#ef444420',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: '#ef4444',
                            transition: 'all 0.5s ease'
                          }
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>

              {/* Second Row */}
              <Grid item xs={6}>
                <Grow in={cardsVisible} timeout={900} style={{ transformOrigin: '0 0 0' }}>
                  <Card 
                    sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1.5, 
                          transition: 'all 0.3s ease', 
                          '&:hover': { transform: 'scale(1.1)' },
                          bgcolor: '#f59e0b'
                        }}>
                          <ScheduleIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b', fontSize: '0.9rem' }}>
                            {financialData ? formatCurrency(financialData.summary.pendingPayments) : 'ZMW 0'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            Pending Payments
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={40} 
                        sx={{ 
                          height: 4, 
                          borderRadius: 2,
                          bgcolor: '#f59e0b20',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: '#f59e0b',
                            transition: 'all 0.5s ease'
                          }
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>

              <Grid item xs={6}>
                <Grow in={cardsVisible} timeout={1100} style={{ transformOrigin: '0 0 0' }}>
                  <Card 
                    sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ 
                          width: 32, 
                          height: 32, 
                          mr: 1.5, 
                          transition: 'all 0.3s ease', 
                          '&:hover': { transform: 'scale(1.1)' },
                          bgcolor: '#3b82f6'
                        }}>
                          <AccountIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6', fontSize: '0.9rem' }}>
                            {financialData ? formatCurrency(financialData.summary.netBalance) : 'ZMW 0'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            Net Balance
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon sx={{ color: '#10b981', mr: 0.5, fontSize: 14, transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.2)' } }} />
                        <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600, fontSize: '0.7rem' }}>
                          +{financialData?.summary.monthlyGrowth || 0}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            </>
          ) : (
            /* Desktop: Show all 4 cards in one row */
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Grow in={cardsVisible} timeout={500} style={{ transformOrigin: '0 0 0' }}>
                  <Card 
                    sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#10b981', mr: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }}>
                          <TrendingUpIcon />
                        </Avatar>
                        <Box>
                          <Typography variant={isMobile ? "h6" : "h4"} sx={{ fontWeight: 700, color: '#10b981' }}>
                            {financialData ? formatCurrency(financialData.summary.totalRevenue) : 'ZMW 0'}
                          </Typography>
                          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                            Total Revenue
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: '#10b98120',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: '#10b981',
                            transition: 'all 0.5s ease'
                          }
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Grow in={cardsVisible} timeout={700} style={{ transformOrigin: '0 0 0' }}>
                  <Card 
                    sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#ef4444', mr: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }}>
                          <PaymentIcon />
                        </Avatar>
                        <Box>
                          <Typography variant={isMobile ? "h6" : "h4"} sx={{ fontWeight: 700, color: '#ef4444' }}>
                            {financialData ? formatCurrency(financialData.summary.totalExpenses) : 'ZMW 0'}
                          </Typography>
                          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                            Total Expenses
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={60} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: '#ef444420',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: '#ef4444',
                            transition: 'all 0.5s ease'
                          }
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Grow in={cardsVisible} timeout={900} style={{ transformOrigin: '0 0 0' }}>
                  <Card 
                    sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#f59e0b', mr: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }}>
                          <ScheduleIcon />
                        </Avatar>
                        <Box>
                          <Typography variant={isMobile ? "h6" : "h4"} sx={{ fontWeight: 700, color: '#f59e0b' }}>
                            {financialData ? formatCurrency(financialData.summary.pendingPayments) : 'ZMW 0'}
                          </Typography>
                          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                            Pending Payments
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={40} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: '#f59e0b20',
                          '& .MuiLinearProgress-bar': { 
                            bgcolor: '#f59e0b',
                            transition: 'all 0.5s ease'
                          }
                        }} 
                      />
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Grow in={cardsVisible} timeout={1100} style={{ transformOrigin: '0 0 0' }}>
                  <Card 
                    sx={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#3b82f6', mr: 2, transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.1)' } }}>
                          <AccountIcon />
                        </Avatar>
                        <Box>
                          <Typography variant={isMobile ? "h6" : "h4"} sx={{ fontWeight: 700, color: '#3b82f6' }}>
                            {financialData ? formatCurrency(financialData.summary.netBalance) : 'ZMW 0'}
                          </Typography>
                          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                            Net Balance
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon sx={{ color: '#10b981', mr: 0.5, transition: 'all 0.3s ease', '&:hover': { transform: 'scale(1.2)' } }} />
                        <Typography variant={isMobile ? "caption" : "body2"} sx={{ color: '#10b981', fontWeight: 600 }}>
                          +{financialData?.summary.monthlyGrowth || 0}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            </>
          )}
        </Grid>

        {/* Desktop Tabs and Filters */}
        {!isMobile && (
          <Slide direction="up" in={pageLoaded} timeout={1200}>
            <Card sx={{ mb: 3, borderRadius: '12px' }}>
              <CardContent sx={{ p: 3 }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{ mb: 2 }}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="Transactions" />
                  <Tab label="Fee Structure" />
                  <Tab label="Expenses" />
                  <Tab label="Reports" />
                </Tabs>

                {tabValue === 0 && (
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s ease'
                          },
                        }}
                      >
                        <MenuItem value="all">All Status</MenuItem>
                        {statusTypes.map(status => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        select
                        label="Filter by Type"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s ease'
                          },
                        }}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        {transactionTypes.map(type => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={handleExportMenuOpen}
                        disabled={filteredTransactions.length === 0}
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        Export
                      </Button>
                      <Menu
                        anchorEl={exportMenuAnchor}
                        open={Boolean(exportMenuAnchor)}
                        onClose={handleExportMenuClose}
                        TransitionComponent={Fade}
                      >
                        <MenuItem onClick={() => { exportTransactions('csv'); handleExportMenuClose(); }}>CSV</MenuItem>
                        <MenuItem onClick={() => { exportTransactions('pdf'); handleExportMenuClose(); }}>PDF</MenuItem>
                        <MenuItem onClick={() => { exportTransactions('excel'); handleExportMenuClose(); }}>Excel</MenuItem>
                      </Menu>
                    </Grid>
                  </Grid>
                )}

                {tabValue === 1 && financialData && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      onClick={() => exportFeeStructure('pdf')}
                      size="small"
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ExcelIcon />}
                      onClick={() => exportFeeStructure('excel')}
                      size="small"
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Excel
                    </Button>
                  </Box>
                )}

                {tabValue === 2 && financialData && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      onClick={() => exportExpenses('pdf')}
                      size="small"
                      disabled={filteredExpenses.length === 0}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ExcelIcon />}
                      onClick={() => exportExpenses('excel')}
                      size="small"
                      disabled={filteredExpenses.length === 0}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      Excel
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Slide>
        )}

        {/* Tab Content */}
        {tabValue === 0 && (
          <Grow in={tableVisible} timeout={800}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ p: isMobile ? 1 : 0 }}>
                {!isMobile && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<PdfIcon />}
                      onClick={() => exportTransactions('pdf')}
                      size="small"
                      disabled={filteredTransactions.length === 0}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ExcelIcon />}
                      onClick={() => exportTransactions('excel')}
                      size="small"
                      disabled={filteredTransactions.length === 0}
                      sx={{
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      Excel
                    </Button>
                  </Box>
                )}
                
                {isMobile ? (
                  // Mobile View - Card Layout
                  <Box sx={{ px: 1 }}>
                    {filteredTransactions.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <ReceiptIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No transactions found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filterStatus !== 'all' || filterType !== 'all' 
                            ? 'Try adjusting your filters'
                            : 'No transactions recorded yet'
                          }
                        </Typography>
                      </Box>
                    ) : (
                      filteredTransactions.map((transaction, index) => (
                        <MobileTransactionCard
                          key={transaction.id}
                          transaction={transaction}
                          index={index}
                        />
                      ))
                    )}
                  </Box>
                ) : (
                  // Desktop View - Table Layout
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.50' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Student</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTransactions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                              <ReceiptIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                              <Typography variant="h6" color="text.secondary" gutterBottom>
                                No transactions found
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {filterStatus !== 'all' || filterType !== 'all' 
                                  ? 'Try adjusting your filters'
                                  : 'No transactions recorded yet'
                                }
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTransactions.map((transaction, index) => (
                            <Grow 
                              in={tableVisible} 
                              timeout={900 + index * 100} 
                              key={transaction.id}
                            >
                              <TableRow sx={{ 
                                '&:hover': { backgroundColor: 'grey.50' },
                                transition: 'all 0.3s ease'
                              }}>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar 
                                      sx={{ 
                                        width: 32, 
                                        height: 32, 
                                        mr: 2, 
                                        bgcolor: getTypeColor(transaction.type),
                                        transition: 'all 0.3s ease',
                                        '&:hover': { transform: 'scale(1.1)' }
                                      }}
                                    >
                                      <PersonIcon />
                                    </Avatar>
                                    {transaction.studentName}
                                  </Box>
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={transactionTypes.find(t => t.value === transaction.type)?.label}
                                    size="small"
                                    sx={{
                                      bgcolor: `${getTypeColor(transaction.type)}20`,
                                      color: getTypeColor(transaction.type),
                                      fontWeight: 600,
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>
                                  {formatCurrency(transaction.amount)}
                                </TableCell>
                                <TableCell>
                                  {new Date(transaction.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={statusTypes.find(s => s.value === transaction.status)?.label}
                                    color={getStatusColor(transaction.status)}
                                    size="small"
                                    sx={{
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(transaction)}
                                    sx={{ 
                                      color: 'primary.main',
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.1)',
                                        bgcolor: 'rgba(59, 130, 246, 0.1)'
                                      }
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                    sx={{ 
                                      color: 'error.main',
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        transform: 'scale(1.1)',
                                        bgcolor: 'rgba(239, 68, 68, 0.1)'
                                      }
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            </Grow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grow>
        )}

        {tabValue === 1 && financialData && (
          <Grow in={tableVisible} timeout={800}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: greenColors.dark,
                            background: greenColors.gradient,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                    School Fee Structure
                  </Typography>
                  {!isMobile && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<PdfIcon />}
                        onClick={() => exportFeeStructure('pdf')}
                        size="small"
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ExcelIcon />}
                        onClick={() => exportFeeStructure('excel')}
                        size="small"
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        Excel
                      </Button>
                    </Box>
                  )}
                </Box>
                
                {isMobile ? (
                  // Mobile View - Accordion Layout
                  <Box>
                    {financialData.feeStructure.map((fee, index) => (
                      <Accordion key={index} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {fee.grade}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {formatCurrency(fee.total)}
                            </Typography>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Tuition</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {formatCurrency(fee.tuition)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Transport</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {formatCurrency(fee.transport)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Activities</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {formatCurrency(fee.activities)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Total</Typography>
                              <Typography variant="body1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {formatCurrency(fee.total)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                ) : (
                  // Desktop View - Table Layout
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.50' }}>
                          <TableCell sx={{ fontWeight: 600 }}>Grade Level</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="right">Tuition</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="right">Transport</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="right">Activities</TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {financialData.feeStructure.map((fee, index) => (
                          <Grow 
                            in={tableVisible} 
                            timeout={900 + index * 100} 
                            key={index}
                          >
                            <TableRow sx={{ 
                              '&:hover': { backgroundColor: 'grey.50' },
                              transition: 'all 0.3s ease'
                            }}>
                              <TableCell sx={{ fontWeight: 600 }}>{fee.grade}</TableCell>
                              <TableCell align="right">{formatCurrency(fee.tuition)}</TableCell>
                              <TableCell align="right">{formatCurrency(fee.transport)}</TableCell>
                              <TableCell align="right">{formatCurrency(fee.activities)}</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                {formatCurrency(fee.total)}
                              </TableCell>
                            </TableRow>
                          </Grow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grow>
        )}

        {tabValue === 2 && financialData && (
          <Grow in={tableVisible} timeout={800}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: greenColors.dark,
                            background: greenColors.gradient,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                    Expense Management
                  </Typography>
                  {!isMobile && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<PdfIcon />}
                        onClick={() => exportExpenses('pdf')}
                        size="small"
                        disabled={filteredExpenses.length === 0}
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<ExcelIcon />}
                        onClick={() => exportExpenses('excel')}
                        size="small"
                        disabled={filteredExpenses.length === 0}
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        Excel
                      </Button>
                    </Box>
                  )}
                </Box>
                
                {isMobile ? (
                  // Mobile View - Card Layout
                  <Box>
                    {filteredExpenses.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 6 }}>
                        <PaymentIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No expenses found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filterStatus !== 'all' 
                            ? 'Try adjusting your status filter'
                            : 'No expenses recorded yet'
                          }
                        </Typography>
                      </Box>
                    ) : (
                      filteredExpenses.map((expense, index) => (
                        <MobileExpenseCard
                          key={expense.id}
                          expense={expense}
                          index={index}
                        />
                      ))
                    )}
                  </Box>
                ) : (
                  // Desktop View - Grid Layout
                  <Grid container spacing={3}>
                    {filteredExpenses.length === 0 ? (
                      <Grid item xs={12}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <PaymentIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            No expenses found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {filterStatus !== 'all' 
                              ? 'Try adjusting your status filter'
                              : 'No expenses recorded yet'
                            }
                          </Typography>
                        </Box>
                      </Grid>
                    ) : (
                      filteredExpenses.map((expense, index) => (
                        <Grow 
                          in={tableVisible} 
                          timeout={900 + index * 100} 
                          key={expense.id}
                        >
                          <Grid item xs={12} md={6}>
                            <Card 
                              variant="outlined" 
                              sx={{ 
                                p: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {expense.category}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {expense.description}
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main', mt: 1 }}>
                                    {formatCurrency(expense.amount)}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={expense.status}
                                  color={getStatusColor(expense.status)}
                                  sx={{
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.05)'
                                    }
                                  }}
                                />
                              </Box>
                            </Card>
                          </Grid>
                        </Grow>
                      ))
                    )}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grow>
        )}

        {tabValue === 3 && (
          <Grow in={tableVisible} timeout={800}>
            <Card sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ p: isMobile ? 2 : 4 }}>
                <Typography variant="h6" gutterBottom sx={{
                            fontWeight: 600,
                            mb: 3,
                            color: greenColors.dark,
                            background: greenColors.gradient,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                  Financial Reports & Analytics
                </Typography>
                
                <Grid container spacing={isMobile ? 2 : 3}>
                  <Grid item xs={12} md={6}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        p: isMobile ? 2 : 3, 
                        textAlign: 'center', 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <ExcelIcon sx={{ fontSize: isMobile ? 36 : 48, color: 'success.main', mb: 2 }} />
                      <Typography variant={isMobile ? "h6" : "h5"} sx={{color:'primary.main'}} gutterBottom>
                        Excel Report
                      </Typography>
                      <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary" sx={{ mb: 3 }}>
                        Comprehensive Excel report for all financial data
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<DownloadIcon />}
                        onClick={generateComprehensiveReport}
                        disabled={!financialData}
                        color="success"
                        fullWidth={isMobile}
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        Download Excel Report
                      </Button>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        p: isMobile ? 2 : 3, 
                        textAlign: 'center', 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <PdfIcon sx={{ fontSize: isMobile ? 36 : 48, color: 'error.main', mb: 2 }} />
                      <Typography variant={isMobile ? "h6" : "h5"} sx={{color:'primary.main'}} gutterBottom>
                        PDF Report
                      </Typography>
                      <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary" sx={{ mb: 3 }}>
                        Professional PDF report with formatted tables and financial summaries
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<PdfIcon />}
                        onClick={generatePDFReport}
                        disabled={!financialData}
                        color="error"
                        fullWidth={isMobile}
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        Generate PDF Report
                      </Button>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Quick Exports by Format
                    </Typography>
                    <Grid container spacing={isMobile ? 1 : 2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color='text.primary' gutterBottom>Transactions</Typography>
                        <Stack direction={isMobile ? "column" : "row"} spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => exportTransactions('pdf')}
                            disabled={!financialData || filteredTransactions.length === 0}
                            fullWidth={isMobile}
                            sx={{ 
                              mb: isMobile ? 1 : 0,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            PDF
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => exportTransactions('excel')}
                            disabled={!financialData || filteredTransactions.length === 0}
                            fullWidth={isMobile}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            Excel
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" sx={{color:'text.primary'}} gutterBottom>Fee Structure</Typography>
                        <Stack direction={isMobile ? "column" : "row"} spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => exportFeeStructure('pdf')}
                            disabled={!financialData}
                            fullWidth={isMobile}
                            sx={{ 
                              mb: isMobile ? 1 : 0,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            PDF
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => exportFeeStructure('excel')}
                            disabled={!financialData}
                            fullWidth={isMobile}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            Excel
                          </Button>
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" sx={{color:'text.primary'}} gutterBottom>Expenses</Typography>
                        <Stack direction={isMobile ? "column" : "row"} spacing={1}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => exportExpenses('pdf')}
                            disabled={!financialData || filteredExpenses.length === 0}
                            fullWidth={isMobile}
                            sx={{ 
                              mb: isMobile ? 1 : 0,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            PDF
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => exportExpenses('excel')}
                            disabled={!financialData || filteredExpenses.length === 0}
                            fullWidth={isMobile}
                            sx={{
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            Excel
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grow>
        )}

        {/* Add/Edit Transaction Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          fullScreen={isSmallMobile}
          TransitionComponent={Slide}
          transitionDuration={300}
          PaperProps={{
            sx: {
              borderRadius: isSmallMobile ? 0 : '12px',
              transition: 'all 0.3s ease'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color:'black' }}>
              {selectedTransaction ? 'Edit Transaction' : 'Record New Transaction'}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Student Name"
                  value={transactionForm.studentName}
                  onChange={(e) => setTransactionForm({ ...transactionForm, studentName: e.target.value })}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Transaction Type"
                  value={transactionForm.type}
                  onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease'
                    },
                  }}
                >
                  {transactionTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>ZMW</Typography>
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease'
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={transactionForm.status}
                  onChange={(e) => setTransactionForm({ ...transactionForm, status: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease'
                    },
                  }}
                >
                  {statusTypes.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button 
              onClick={handleCloseDialog} 
              variant="outlined"
              sx={{
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
              onClick={handleSaveTransaction} 
              variant="contained"
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }
              }}
            >
              {selectedTransaction ? 'Update Transaction' : 'Record Transaction'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mobile Floating Action Button */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add transaction"
            onClick={() => handleOpenDialog()}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 16,
              backgroundColor: greenColors.primary,
              '&:hover': {
                backgroundColor: greenColors.dark
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
              onChange={handleBottomNavChange}
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
              <BottomNavigationAction label="Transactions" icon={<ReceiptIcon />} />
              <BottomNavigationAction label="Fees" icon={<AccountIcon />} />
              <BottomNavigationAction label="Expenses" icon={<PaymentIcon />} />
              <BottomNavigationAction label="Reports" icon={<AssessmentIcon />} />
            </BottomNavigation>
          </Paper>
        )}

        {/* Mobile Components */}
        <MobileFilterDrawer />
        <MobileMenuDrawer />
      </Box>
    </Fade>
  );
};

export default FinancePage;