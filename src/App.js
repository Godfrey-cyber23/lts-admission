import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import useTawkTo from './hooks/useTawkTo';
import AdmissionForm from './AdmissionForm';
import { ThemeProvider } from './styles/themes';
import { ErrorBoundary } from './components/ErrorBoundary';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import ResourcesPage from './pages/ResourcesPage';
import HomePage from './pages/HomePage';
import FaqPage from './pages/FAQPage';
import Footer from './components/Footer';
import SiteMap from './components/Sitemap';
import PhotoGallery from './components/PhotoGallery';
import ScrollToTop from './components/ScrollToTop';
import './styles/global.css';
import './styles/fonts.css';


function App() {
  const { isChatReady, isChatLoading, toggleChat } = useTawkTo();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <div className={`literacy-tree-app ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            {/* Enhanced Header with School Motto and Navigation */}
            <header className="app-header">
              <div className="header-top-bar">
                <div className="school-contact">
                  <span className="contact-item">
                    <i className="icon">📧</i> admissions@literacytree.edu
                  </span>
                  <span className="contact-item">
                    <i className="icon">📞</i> (+260) 977/966 - 845317 / +260 971-935653
                  </span>
                </div>
              </div>
                

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
                  {/* Hamburger button */}
                  <div className={`mobile-menu-wrapper ${isMobileMenuOpen ? 'menu-open' : ''}`}>
                    <button
                      className={`hamburger-button ${isMobileMenuOpen ? 'open' : ''}`}
                      onClick={toggleMobileMenu}
                      aria-label="Toggle menu"
                      aria-expanded={isMobileMenuOpen}
                    >
                      <span className="hamburger-line"></span>
                      <span className="hamburger-line"></span>
                      <span className="hamburger-line"></span>
                    </button>
                  </div>

                  {/* Navigation links - desktop and mobile */}
                  <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                    <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Our School</Link>
                    <Link to="/programs" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Academic Programs</Link>
                    <Link to="/faq" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Admission FAQ</Link>
                    <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                    <Link to="/admission" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Enroll Now</Link>
                  </div>
                </nav>
              
            </header>

            {/* Rest of your code remains the same */}
            <main className="app-content">
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
              </Routes>
            </main>

            {isChatReady && (
              <button
                className="chat-button"
                onClick={toggleChat}
                disabled={isChatLoading}
              >
                {isChatLoading ? 'Loading Chat...' : 'Live Chat'}
              </button>
            )}

            {/* {chatError && (
              <div className="chat-error">
                Chat is currently unavailable. Please contact us via email.
              </div>
            )} */}

            <Footer />
          </div>
          <ScrollToTop />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;