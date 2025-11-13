// src/hooks/useTawkTo.js
import { useState, useCallback, useMemo } from 'react';

const useTawkTo = () => {
  const [isChatReady, setIsChatReady] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  return {
    isChatReady,
    isChatLoading,
    chatError,
    isChatOpen,
    toggleChat,
    closeChat
  };
};

export default useTawkTo;