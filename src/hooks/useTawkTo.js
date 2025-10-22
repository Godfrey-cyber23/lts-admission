import { useState, useEffect, useCallback, useMemo } from 'react';

const useTawkTo = () => {
  // Tawk.to Configuration
  const tawkToConfig = useMemo(() => ({
    propertyId: '68538bdc562852190e9a0ebb', 
    widgetId: '1iu35klut',                
    embedUrl: 'https://embed.tawk.to',     
    apiUrl: 'https://api.tawk.to',         
    sessionUrl: 'https://va.tawk.to'       
  }), []);

  const [isChatReady, setIsChatReady] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  const initializeTawk = useCallback(async () => {
    if (!window.Tawk_API) {
      throw new Error('Tawk.to API not loaded');
    }

    return new Promise((resolve, reject) => {
      const maxAttempts = 10;
      let attempts = 0;

      const checkInitialized = () => {
        attempts++;

        if (window.Tawk_API?.getStatus && window.Tawk_API.getStatus() === 'online') {
          // Configure widget appearance
          window.Tawk_API.hideWidget();
          window.Tawk_API.setAttributes({
            'theme': 'default',
            'color': '#2c5e3a',
            'highlight': '#f5a623',
            'name': 'Website Visitor',
            'email': '',
            'phone': ''
          });

          setIsChatReady(true);
          resolve();
        } else if (attempts < maxAttempts) {
          setTimeout(checkInitialized, 300);
        } else {
          reject(new Error('Tawk.to initialization timed out'));
        }
      };

      checkInitialized();
    });
  }, []);

  const loadTawkScript = useCallback(() => {
    setIsChatLoading(true);
    setChatError(null);

    const script = document.createElement('script');
    script.async = true;
    script.src = `${tawkToConfig.embedUrl}/${tawkToConfig.propertyId}/${tawkToConfig.widgetId}`;
    script.charset = 'UTF-8';
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      initializeTawk()
        .then(() => setIsChatLoading(false))
        .catch(error => {
          setChatError(error);
          setIsChatLoading(false);
        });
    };

    script.onerror = () => {
      const error = new Error('Failed to load Tawk.to script');
      setChatError(error);
      setIsChatLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [tawkToConfig.embedUrl, tawkToConfig.propertyId, tawkToConfig.widgetId, initializeTawk]);

  useEffect(() => {
    if (window.Tawk_API) {
      initializeTawk()
        .catch(error => {
          setChatError(error);
        });
      return;
    }

    loadTawkScript();
  }, [initializeTawk, loadTawkScript]);

  const toggleChat = useCallback(() => {
    if (window.Tawk_API?.toggle) {
      try {
        // Update visitor info if available
        const userData = JSON.parse(localStorage.getItem('admissionFormData'));
        if (userData) {
          window.Tawk_API.setAttributes({
            'name': `${userData.studentInfo.firstName} ${userData.studentInfo.lastName}`,
            'email': userData.parentInfo.email,
            'phone': userData.parentInfo.phone
          });
        }

        window.Tawk_API.toggle();
      } catch (error) {
        console.error('Error toggling chat:', error);
      }
    } else {
      const error = new Error('Chat not available');
      setChatError(error);
    }
  }, []);

  return {
    isChatReady,
    isChatLoading,
    chatError,
    toggleChat
  };
};

export default useTawkTo;