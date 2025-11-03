import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

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

  // Use a ref to track if the script has been loaded to prevent duplicate loads
  const isScriptLoaded = useRef(false);

  const initializeTawk = useCallback(async () => {
    if (!window.Tawk_API) {
      throw new Error('Tawk.to API not loaded');
    }

    return new Promise((resolve, reject) => {
      const maxAttempts = 10;
      let attempts = 0;

      const checkInitialized = () => {
        attempts++;

        if (window.Tawk_API?.getStatus && window.Tawk_API.getStatus() !== 'offline') {
          // Configure widget appearance
          window.Tawk_API.hideWidget();
          window.Tawk_API.setAttributes({
            'theme': 'default',
            'color': '#2c5e3a',
            'highlight': '#f5a623',
            'name': 'Website Visitor',
            'email': '',
            'phone': ''
          }, function(error) {
              if(error) {
                  console.error('Tawk setAttributes error:', error);
              }
          });

          setIsChatReady(true);
          resolve();
        } else if (attempts < maxAttempts) {
          setTimeout(checkInitialized, 300);
        } else {
          // Don't reject as an error, the chat might just be offline
          console.warn('Tawk.to initialization timed out or is offline.');
          setIsChatReady(true); // Consider it "ready" even if offline
          resolve();
        }
      };

      checkInitialized();
    });
  }, []);

  const loadTawkScript = useCallback(() => {
    // Prevent loading the script more than once
    if (isScriptLoaded.current) {
      return;
    }
    isScriptLoaded.current = true;

    setIsChatLoading(true);
    setChatError(null);

    const script = document.createElement('script');
    script.async = true;
    script.src = `${tawkToConfig.embedUrl}/${tawkToConfig.propertyId}/${tawkToConfig.widgetId}`;
    script.charset = 'UTF-8';
    script.crossOrigin = 'anonymous'; // You already had this, which is correct!

    script.onload = () => {
      initializeTawk()
        .then(() => setIsChatLoading(false))
        .catch(error => {
          console.error('Tawk initialization failed:', error);
          setChatError(error);
          setIsChatLoading(false);
        });
    };

    script.onerror = (error) => {
      console.error('Tawk script failed to load:', error);
      const err = new Error('Failed to load Tawk.to script');
      setChatError(err);
      setIsChatLoading(false);
    };

    document.body.appendChild(script);
  }, [tawkToConfig.embedUrl, tawkToConfig.propertyId, tawkToConfig.widgetId, initializeTawk]);

  useEffect(() => {
    // If Tawk_API is already available (e.g., from a previous hot-reload), just initialize it
    if (window.Tawk_API) {
      initializeTawk()
        .catch(error => {
          console.error('Tawk initialization on re-render failed:', error);
          setChatError(error);
        });
      return;
    }

    // Otherwise, load the script
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
          }, function(error) {
              if(error) {
                  console.error('Tawk setAttributes error:', error);
              }
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