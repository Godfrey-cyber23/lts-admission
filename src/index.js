// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './styles/themes';
import App from './App';
import {ErrorBoundary} from './components/ErrorBoundary';
import { initSchoolPerformanceMonitoring } from './utils/webVitals';
import './styles/global.css';
import './styles/fonts.css';

// Combined analytics and performance monitoring initialization
const initializeTracking = () => {
  // Always initialize school performance monitoring
  initSchoolPerformanceMonitoring();

  // Production-only analytics
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4
    import('react-ga4').then((ga) => {
      ga.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID);
      ga.send('pageview', {
        page_title: 'Admission Form',
        page_location: window.location.href,
        school: 'Literacy Tree'
      });
    }).catch(err => {
      console.error('GA4 initialization failed:', err);
      window.schoolAnalytics('error', {
        type: 'ga_load_failed',
        error: err.message
      });
    });

    // Web Vitals Reporting
    if (process.env.REACT_APP_ENABLE_WEB_VITALS === 'true') {
      import('./utils/webVitals').then(({ reportWebVitals }) => {
        const vitalsHandler = (metric) => {
          // Enhanced school tracking
          window.schoolAnalytics('web_vital', {
            ...metric,
            formStage: getFormStage(), // Custom function to track progress
            schoolBranch: 'main' // Customize per branch if needed
          });

          // Also send to GA4
          if (window.gtag) {
            window.gtag('event', 'web_vital', metric);
          }
        };
        reportWebVitals(vitalsHandler);
      });
    }
  }
};

// Helper to track form progress (add to form component)
const getFormStage = () => {
  const path = window.location.pathname;
  if (path.includes('/personal')) return 'personal_info';
  if (path.includes('/academic')) return 'academic_info';
  if (path.includes('/review')) return 'review';
  return 'landing';
};

const root = ReactDOM.createRoot(document.getElementById('root'));
initializeTracking();

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ErrorBoundary>
        <div className="literacy-tree-app">
          <App />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>
);