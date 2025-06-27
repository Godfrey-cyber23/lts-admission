/**
 * Enhanced web vitals reporting for Literacy Tree School
 * Tracks performance metrics and sends to analytics
 */
export function reportWebVitals(onPerfEntry) {
  // Only run in production or when explicitly enabled
  if (process.env.NODE_ENV !== 'production' && 
      process.env.REACT_APP_ENABLE_WEB_VITALS !== 'true') {
    return;
  }

  // Verify the callback is valid
  if (typeof onPerfEntry !== 'function') {
    console.warn('Invalid web vitals callback provided');
    return;
  }

  // Dynamic import with error handling
  import('web-vitals')
    .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // School-specific metric tracking
      const trackMetric = (metric) => {
        // Standard callback
        onPerfEntry(metric);
        
        // Enhanced school analytics
        if (window.schoolAnalytics) {
          const schoolMetric = {
            ...metric,
            formType: 'admission',
            school: 'Literacy Tree',
            timestamp: new Date().toISOString()
          };
          window.schoolAnalytics('performance', schoolMetric);
        }
        
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
          console.groupCollapsed(`📊 ${metric.name} (${metric.id})`);
          console.log('Value:', metric.value);
          console.log('Rating:', metric.rating);
          console.log('School Context:', {
            formType: 'admission',
            page: window.location.pathname
          });
          console.groupEnd();
        }
      };

      // Track all vital metrics
      getCLS(trackMetric, { reportAllChanges: true });
      getFID(trackMetric);
      getFCP(trackMetric);
      getLCP(trackMetric, { reportAllChanges: true });
      getTTFB(trackMetric);

    })
    .catch((error) => {
      console.error('Failed to load web-vitals:', error);
      if (window.schoolAnalytics) {
        window.schoolAnalytics('error', {
          type: 'web_vitals_load_failed',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });
}

/**
 * School-specific performance monitoring setup
 */
export function initSchoolPerformanceMonitoring() {
  if (typeof window !== 'undefined') {
    window.schoolAnalytics = window.schoolAnalytics || function() {
      console.log('[School Analytics]', ...arguments);
    };
    
    // Enable debugging in development
    if (process.env.NODE_ENV === 'development') {
      window.schoolAnalytics.debug = true;
    }
  }
}

export function trackFormInteraction(eventName, metadata = {}) {
  if (window.schoolAnalytics) {
    window.schoolAnalytics('form_interaction', {
      event: eventName,
      ...metadata,
      school: 'Literacy Tree',
      timestamp: new Date().toISOString()
    });
  }
}