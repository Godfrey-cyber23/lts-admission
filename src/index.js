// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './styles/themes';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initSchoolPerformanceMonitoring, reportWebVitals } from './utils/webVitals';
import './styles/global.css';

// Combined analytics and performance monitoring initialization
const initializeTracking = () => {
  try {
    // Initialize performance monitoring
    initSchoolPerformanceMonitoring();

    // Production-only analytics
    if (process.env.NODE_ENV === 'production') {
      // Google Analytics 4 with early childhood education tracking
      import('react-ga4').then((ga) => {
        // Initialize GA4 only if measurement ID is provided
        if (process.env.REACT_APP_GA_MEASUREMENT_ID) {
          ga.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID, {
            gaOptions: {
              siteSpeedSampleRate: 100 // Track all page loads
            }
          });
          
          // Enhanced tracking for early childhood education
          ga.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
            custom_map: {
              dimension1: 'child_age_group',
              dimension2: 'parent_engagement',
              dimension3: 'learning_progress'
            }
          });
          
          // Set custom dimensions
          ga.gtag('set', 'dimension1', 'preschool');
          ga.gtag('set', 'dimension2', 'medium');
          
          // Send initial pageview
          ga.send('pageview', {
            page_title: 'Literacy Tree Preschool Portal',
            page_location: window.location.href,
            school_type: 'early_childhood'
          });
          
          console.log('GA4 initialized successfully');
        } else {
          console.warn('GA4 measurement ID not provided. Analytics disabled.');
        }
      }).catch(err => {
        console.error('GA4 initialization failed:', err);
        window.schoolAnalytics?.('error', {
          type: 'analytics_load_failed',
          error: err.message
        });
      });

      // Web Vitals Reporting
      if (process.env.REACT_APP_ENABLE_WEB_VITALS === 'true') {
        const vitalsHandler = (metric) => {
          // Preschool-focused tracking
          window.schoolAnalytics?.('performance', {
            ...metric,
            context: 'preschool_portal',
            user_type: getCurrentUserType() // parent/teacher
          });

          // Also send to GA4 if available
          if (window.gtag) {
            window.gtag('event', 'web_vital', {
              ...metric,
              school_type: 'early_childhood'
            });
          }
        };
        reportWebVitals(vitalsHandler);
      }
    }
  } catch (error) {
    console.error('Tracking initialization error:', error);
  }
};

// Helper to determine user context
const getCurrentUserType = () => {
  try {
    const path = window.location.pathname;
    if (path.includes('/parent')) return 'parent';
    if (path.includes('/teacher')) return 'teacher';
    if (path.includes('/admin')) return 'admin';
    return 'guest';
  } catch (error) {
    console.error('Error determining user type:', error);
    return 'unknown';
  }
};

// Global error handlers
const registerGlobalErrorHandlers = () => {
  // Uncaught exceptions
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    window.schoolAnalytics?.('error', {
      type: 'uncaught_exception',
      message: event.error?.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    window.schoolAnalytics?.('error', {
      type: 'unhandled_rejection',
      reason: event.reason?.toString()
    });
  });
};

// Initialize PWA service worker
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registered: ', registration.scope);
        })
        .catch(error => {
          console.error('ServiceWorker registration failed: ', error);
        });
    });
  }
};

// Create root and initialize app
const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      throw new Error('Root element not found');
    }
    
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ThemeProvider>
          <ErrorBoundary>
            <div className="literacy-tree-preschool">
              <App />
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </React.StrictMode>
    );
    
    return root;
  } catch (error) {
    console.error('App initialization failed:', error);
    // Fallback UI
    document.getElementById('root').innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
        <h1>Application Error</h1>
        <p>We're sorry, but Literacy Tree School Portal failed to load.</p>
        <p>Please try refreshing the page or contact support if the problem persists.</p>
        <p><button onclick="window.location.reload()">Reload Application</button></p>
        <p>Error details: ${error.message}</p>
      </div>
    `;
    return null;
  }
};

// Main initialization flow
const init = () => {
  registerGlobalErrorHandlers();
  initializeTracking();
  registerServiceWorker();
  initializeApp();
};

// Start the application
init();