import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      isMobile: false
    };
    
    // Check if device is mobile
    this.checkMobile = this.checkMobile.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.checkMobile();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.checkMobile();
  }

  checkMobile() {
    const isMobile = window.innerWidth < 768;
    if (isMobile !== this.state.isMobile) {
      this.setState({ isMobile });
    }
  }

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
      const { isMobile } = this.state;
      
      return (
        <div className="error-fallback" style={{
          ...styles.errorContainer,
          padding: isMobile ? '15px' : '20px'
        }}>
          <div style={{
            ...styles.errorContent,
            maxWidth: isMobile ? '100%' : '600px',
            padding: isMobile ? '20px' : '30px',
            margin: isMobile ? '0' : 'auto'
          }}>
            <img 
              src="/school-logo.png" 
              alt="Literacy Tree School" 
              style={{
                ...styles.logo,
                height: isMobile ? '45px' : '60px',
                marginBottom: isMobile ? '15px' : '20px'
              }}
            />
            <h2 style={{
              ...styles.heading,
              fontSize: isMobile ? '1.5rem' : '1.8rem',
              marginBottom: isMobile ? '12px' : '15px'
            }}>
              Admission Form Error
            </h2>
            <p style={{
              ...styles.message,
              fontSize: isMobile ? '0.95rem' : '1rem',
              marginBottom: isMobile ? '15px' : '20px',
              lineHeight: isMobile ? '1.4' : '1.5'
            }}>
              We encountered an issue with the admission form. Our team has been notified.
            </p>
            <div style={{
              ...styles.details,
              margin: isMobile ? '15px 0' : '20px 0'
            }}>
              {process.env.NODE_ENV === 'development' && (
                <details style={{
                  ...styles.detailsContent,
                  padding: isMobile ? '8px' : '10px',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  <summary>Error Details</summary>
                  <p>{this.state.error?.toString()}</p>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: isMobile ? '11px' : '12px'
                  }}>
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <button 
              onClick={this.handleRefresh}
              style={{
                ...styles.button,
                padding: isMobile ? '14px 20px' : '12px 24px',
                fontSize: isMobile ? '1rem' : '16px',
                width: isMobile ? '100%' : 'auto',
                marginTop: isMobile ? '15px' : '10px'
              }}
            >
              Refresh Page
            </button>
            <p style={{
              ...styles.contact,
              marginTop: isMobile ? '15px' : '20px',
              fontSize: isMobile ? '13px' : '14px'
            }}>
              Need help? Contact <a href="mailto:admissions@literacytree.edu" style={{
                color: '#2c5e3a',
                textDecoration: 'none',
                fontWeight: '500'
              }}>admissions@literacytree.edu</a>
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
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    boxSizing: 'border-box'
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
    fontSize: '14px',
    maxHeight: '200px',
    overflow: 'auto'
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
    marginTop: '10px',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  contact: {
    marginTop: '20px',
    color: '#6c757d',
    fontSize: '14px'
  }
};