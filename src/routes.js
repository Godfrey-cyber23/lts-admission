import { Routes, Route } from 'react-router-dom';
import AdmissionForm from './AdmissionForm';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import ResourcesPage from './pages/ResourcesPage';
import FaqPage from './pages/FAQPage';
import SiteMap from './components/Sitemap';
import PhotoGallery from './components/PhotoGallery';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admission" element={<AdmissionForm />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/sitemap" element={<SiteMap />} />
      <Route path="/gallery" element={<PhotoGallery />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route element={<ProtectedRoute roles={['admin', 'staff']} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;