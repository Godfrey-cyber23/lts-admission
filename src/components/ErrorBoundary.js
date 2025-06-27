import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { 
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Track errors with school analytics
    if (window.schoolAnalytics) {
      window.schoolAnalytics('error', {
        type: 'react_error_boundary',
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        formStage: this.getFormStage(),
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }

    // Optional: Log to error tracking service
    if (process.env.NODE_ENV === 'production') {
      console.error('Admission Form Error:', error, errorInfo);
    }
  }

  // Helper to determine current form stage
  getFormStage = () => {
    const path = window.location.pathname;
    if (path.includes('/personal')) return 'personal_info';
    if (path.includes('/academic')) return 'academic_info';
    if (path.includes('/medical')) return 'medical_info';
    if (path.includes('/review')) return 'review_submission';
    if (path.includes('/payment')) return 'payment_processing';
    return 'landing_page';
  };

  handleRefresh = () => {
    // Track refresh action
    if (window.schoolAnalytics) {
      window.schoolAnalytics('user_action', {
        action: 'error_refresh',
        previousError: this.state.error?.toString(),
        formStage: this.getFormStage()
      });
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback" style={styles.errorContainer}>
          <div style={styles.errorContent}>
            <img 
              src="/images/school-logo-error.png" 
              alt="Literacy Tree School" 
              style={styles.logo}
            />
            <h2 style={styles.heading}>Admission Form Error</h2>
            <p style={styles.message}>
              We encountered an issue with the admission form. Our team has been notified.
            </p>
            <div style={styles.details}>
              {process.env.NODE_ENV === 'development' && (
                <details style={styles.detailsContent}>
                  <summary>Error Details</summary>
                  <p>{this.state.error?.toString()}</p>
                  <pre>{this.state.errorInfo?.componentStack}</pre>
                </details>
              )}
            </div>
            <button 
              onClick={this.handleRefresh}
              style={styles.button}
            >
              Refresh Page
            </button>
            <p style={styles.contact}>
              Need help? Contact admissions@literacytree.edu
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Inline styles for better isolation
const styles = {
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    fontFamily: '"Open Sans", sans-serif'
  },
  errorContent: {
    maxWidth: '600px',
    textAlign: 'center',
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  logo: {
    height: '60px',
    marginBottom: '20px'
  },
  heading: {
    color: '#2c5e3a',
    marginBottom: '15px',
    fontFamily: '"Merriweather", serif'
  },
  message: {
    color: '#5a5a5a',
    marginBottom: '20px',
    lineHeight: '1.5'
  },
  details: {
    margin: '20px 0',
    textAlign: 'left'
  },
  detailsContent: {
    backgroundColor: '#f1f1f1',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '14px'
  },
  button: {
    backgroundColor: '#2c5e3a',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginTop: '10px'
  },
  contact: {
    marginTop: '20px',
    color: '#6c757d',
    fontSize: '14px'
  }
};