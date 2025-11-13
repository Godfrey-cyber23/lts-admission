import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom';
import CustomChat from './components/CustomChat';
import useTawkTo from './hooks/useTawkTo'; // Make sure this is the updated hook
import { ThemeProvider } from './styles/themes';
import { ErrorBoundary } from './components/ErrorBoundary';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AppRoutes from './routes';
import './styles/global.css';
import { FaBars, FaTimes } from 'react-icons/fa';

// Create a wrapper component that uses the router hooks
function AppContent() {
  const { isChatReady, isChatLoading, isChatOpen, toggleChat, closeChat } = useTawkTo();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if current route is an admin or dashboard route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  
  // Don't show UI elements on admin or dashboard routes
  const shouldShowUI = !isAdminRoute && !isDashboardRoute;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.nav-links') && !event.target.closest('.hamburger-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className={`literacy-tree-app ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      {/* Conditionally render header - don't show on admin or dashboard routes */}
      {shouldShowUI && (
        <header className={`app-header ${scrolled ? 'scrolled' : ''}`}>
          <div className="header-main">
            <div className="container">
              <nav className="header-nav">
                <div className="header-branding-wrapper">
                  <img
                    src="/school-logo.jpg"
                    alt="Literacy Tree School"
                    className="school-logo"
                  />
                  <div className="school-branding">
                    <h1>Literacy Tree School</h1>
                    <p className="school-motto">"To teach is to touch a life forever"</p>
                  </div>
                </div>
                
                <div className="mobile-menu-wrapper">
                  <button
                    className={`hamburger-button ${isMobileMenuOpen ? 'open' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen}
                  >
                    {isMobileMenuOpen ? (
                      <FaTimes className="menu-icon" />
                    ) : (
                      <FaBars className="menu-icon" />
                    )}
                  </button>
                </div>

                <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                  <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                  <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</NavLink>
                  <NavLink to="/programs" onClick={() => setIsMobileMenuOpen(false)}>Programs</NavLink>
                  <NavLink to="/faq" onClick={() => setIsMobileMenuOpen(false)}>FAQs</NavLink>
                  <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</NavLink>
                  <NavLink to="/admission" className="enroll-btn" onClick={() => setIsMobileMenuOpen(false)}>Enroll Now</NavLink>
                  <NavLink to="/login" className="login-btn" onClick={() => setIsMobileMenuOpen(false)}>Login</NavLink>
                </div>
              </nav>
            </div>
          </div>
        </header>
      )}

      <main className="app-content">
        <AppRoutes />
      </main>

      {/* Conditionally render chat button - don't show on admin or dashboard routes */}
      {isChatReady && shouldShowUI && (
        <>
          <button
            className="chat-button pulse"
            onClick={toggleChat}
            disabled={isChatLoading}
            aria-label="Live chat support"
          >
            {isChatLoading ? 'Loading...' : (
              <div className="chat-content">
                <span className="chat-bubble">💬</span>
                <span className="chat-text">Need help?</span>
              </div>
            )}
          </button>
          
          <CustomChat isOpen={isChatOpen} onClose={closeChat} />
        </>
      )}

      {/* Conditionally render footer - don't show on admin or dashboard routes */}
      {shouldShowUI && <Footer />}
      
      <ScrollToTop />
    </div>
  );
}

// Custom NavLink component for active styling
function NavLink({ to, children, className, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`nav-link ${isActive ? 'active' : ''} ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

// Main App component
function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;