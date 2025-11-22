import { Routes, Route, Navigate } from 'react-router-dom';
import EnrollmentFlow from './components/EnrollmentFlow';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import ResourcesPage from './pages/ResourcesPage';
import FaqPage from './pages/FAQPage';
import Register from './pages/Register';
import DashboardHome from './pages/admins/DashboardHome';
import AdminChatDashboard from './pages/admins/AdminChatDashboard';
import SiteMap from './components/Sitemap';
import StudentsPage from './pages/admins/StudentsPage';
import StaffPage from './pages/admins/StaffPage';
import SettingsPage from './pages/admins/SettingsPage';
import AdmissionsPage from './pages/admins/AdmissionsPage';
import PhotoGallery from './components/PhotoGallery';
import EventsPage from './pages/admins/EventsPage';
import ReportsPage from './pages/admins/ReportsPage';
import ProfilePage from './pages/admins/ProfilePage';
import AcademicPage from './pages/admins/AcademicPage';
import FinancePage from './pages/admins/FinancePage';
import MessagesPage from './pages/admins/MessagesPage';
import PagesManagement from './pages/admins/PagesManagement';
import Calendar from './components/Calendar'; 
import Faculty from './components/Faculty';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      {/* Updated admission route to use EnrollmentFlow */}
      <Route path="/admission" element={<EnrollmentFlow />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/sitemap" element={<SiteMap />} />
      <Route path="/gallery" element={<PhotoGallery />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/calendar" element={<Calendar />} /> 
      <Route path="/faculty" element={<Faculty />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute roles={['admin', 'staff']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="admissions" element={<AdmissionsPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="academic" element={<AcademicPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="pages" element={<PagesManagement />} /> 
        <Route path="chat" element={<AdminChatDashboard />} />
      </Route>

      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;