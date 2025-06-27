// src/hooks/useTawkTo.js
import { useState, useEffect, useCallback, useMemo } from 'react';

const useTawkTo = () => {
  // Tawk.to Configuration - Replace these with your actual values
  const tawkToConfig = useMemo(() => ({
    propertyId: '68538bdc562852190e9a0ebb', // Your property ID
    widgetId: '1iu35klut',                 // Your widget ID
    embedUrl: 'https://embed.tawk.to',     // Tawk.to embed URL
    apiUrl: 'https://api.tawk.to',         // Tawk.to API URL
    sessionUrl: 'https://va.tawk.to'       // Tawk.to session URL
  }), []);


  const [isChatReady, setIsChatReady] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

const showFallbackChat = useCallback(() => {
    if (document.getElementById('tawk-fallback') || !chatError) return;
    
    const fallbackChat = document.createElement('div');
    fallbackChat.id = 'tawk-fallback';
    fallbackChat.innerHTML = `
      <style>
        #tawk-fallback {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #2c5e3a;
          color: white;
          padding: 12px 18px;
          border-radius: 30px;
          cursor: pointer;
          z-index: 9999;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Open Sans', sans-serif;
        }
        #tawk-fallback:hover {
          background: #1F452B;
          transform: translateY(-2px);
        }
      </style>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Need help?
    `;
    
    fallbackChat.addEventListener('click', () => {
      window.location.href = 'mailto:admissions@literacytree.edu?subject=Admission%20Help';
    });
    
    document.body.appendChild(fallbackChat);
  }, [chatError]);

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
          showFallbackChat();
        });
    };
    
    script.onerror = () => {
      const error = new Error('Failed to load Tawk.to script');
      setChatError(error);
      setIsChatLoading(false);
      showFallbackChat();
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [tawkToConfig.embedUrl, tawkToConfig.propertyId, tawkToConfig.widgetId, initializeTawk, showFallbackChat]);

  useEffect(() => {
    if (window.Tawk_API) {
      initializeTawk()
        .catch(error => {
          setChatError(error);
          showFallbackChat();
        });
      return;
    }

    loadTawkScript();
  }, [initializeTawk, loadTawkScript, showFallbackChat]);

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
      showFallbackChat();
    }
  }, [showFallbackChat]);

  return { 
    isChatReady, 
    isChatLoading, 
    chatError, 
    toggleChat 
  };
};

export default useTawkTo;