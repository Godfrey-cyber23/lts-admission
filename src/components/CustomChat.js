// CustomChat.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaTimes, FaPaperPlane, FaSmile } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import { 
  createChatSession, 
  sendMessage, 
  listenToSessionMessages, 
  listenToSessionStatus, 
  updateSessionStatus 
} from './firebaseService';
import '../styles/CustomChat.css';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_tmzavcc';
const EMAILJS_TEMPLATE_ID = 'template_49p77bi';
const EMAILJS_PUBLIC_KEY = 'KBr4yJBL_daNLGEYG';

// Initialize EmailJS once
if (typeof emailjs !== 'undefined') {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized');
  } catch (error) {
    console.error('EmailJS initialization error:', error);
  }
}

const CustomChat = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 'initial',
      text: "Hello! Welcome to Literacy Tree School. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
      reactions: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isAgentOnline, setIsAgentOnline] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);
  const connectionTimeoutRef = useRef(null);

  // Emoji options
  const emojis = ["😀", "😊", "😎", "👍", "❤️", "🎉", "🤔", "😂", "👏", "🙏"];

  // Initialize session and Firebase listeners
  useEffect(() => {
    if (!isOpen) return;

    // Generate or retrieve session ID
    let currentSessionId = sessionStorage.getItem('chatSessionId');
    if (!currentSessionId) {
      currentSessionId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('chatSessionId', currentSessionId);
    }
    setSessionId(currentSessionId);

    // Create or update session
    const initializeSession = async () => {
      try {
        await createChatSession(currentSessionId);
        setConnectionStatus('connected');
        console.log('Session initialized successfully');
      } catch (error) {
        console.error('Error initializing session:', error);
        setConnectionStatus('disconnected');
      }
    };

    initializeSession();

    // Set up listeners for messages
    const unsubscribeMessages = listenToSessionMessages(currentSessionId, (messageList) => {
      setMessages(messageList);
    });

    // Set up listeners for status
    const unsubscribeStatus = listenToSessionStatus(currentSessionId, (status) => {
      setIsAgentOnline(status.agentOnline || false);
      setAgentTyping(status.agentTyping || false);
    });

    // Clean up listeners when component unmounts
    return () => {
      unsubscribeMessages();
      unsubscribeStatus();
      
      // Set user as offline
      updateSessionStatus(currentSessionId, { userOnline: false });
    };
  }, [isOpen]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendEmailNotification = useCallback(async (messageData) => {
    try {
      const templateParams = {
        message: messageData.text,
        time: new Date(messageData.timestamp).toLocaleString(),
        session_id: sessionId,
        current_page: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        to_email: 'godfreyb998@gmail.com'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_TEMPLATE_ID, 
        templateParams
      );

      console.log('Email sent successfully:', response);
      return response;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw new Error('Failed to send notification');
    }
  }, [sessionId]);

  const handleSendMessage = useCallback(async () => {
    if (inputMessage.trim() === "" || isSending || connectionStatus !== 'connected') {
      return;
    }

    setIsSending(true);
    const messageText = inputMessage;
    setInputMessage("");

    try {
      await sendMessage(sessionId, messageText, "user");
      
      // If no agent is online, send email notification
      if (!isAgentOnline) {
        try {
          await sendEmailNotification({
            text: messageText,
            timestamp: new Date().toISOString()
          });
          
          // Add system message
          await sendMessage(
            sessionId, 
            "Thank you for your message! Our support team has been notified and will respond shortly.", 
            "bot"
          );
        } catch (error) {
          console.error('Failed to send email notification:', error);
          // Add error message
          await sendMessage(
            sessionId, 
            "There was an issue notifying our support team, but your message was sent. They will see it when they come online.", 
            "bot"
          );
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to local state only
      const errorMessage = {
        id: 'error-' + Date.now(),
        text: "Sorry, there was an issue sending your message. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        reactions: []
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  }, [inputMessage, isSending, connectionStatus, sessionId, isAgentOnline, sendEmailNotification]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInputMessage(inputMessage + emoji);
    setShowEmojis(false);
  };

  const handleReaction = async (messageId, emoji) => {
    // This would need to be implemented in the firebase service
    // For now, we'll just update local state
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            // Remove reaction if it already exists
            return {
              ...msg,
              reactions: msg.reactions?.filter(r => r.emoji !== emoji) || []
            };
          } else {
            // Add new reaction
            return {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, count: 1 }]
            };
          }
        }
        return msg;
      })
    );
    
    setCurrentMessageId(null);
  };

  const formatTime = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Add a manual reconnection button
  const handleReconnect = () => {
    setConnectionStatus('connecting');
    setRetryCount(0);
    
    // Force reconnection by refreshing the page
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="custom-chat-container">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">
            <img src="/school-logo.jpg" alt="Literacy Tree School" />
          </div>
          <div className="chat-title">
            <h3>Literacy Tree School</h3>
            <div className="status-container">
              <span className={`online-indicator ${isAgentOnline ? 'online' : 'offline'}`}>
                {isAgentOnline ? 'Online' : 'Offline'}
              </span>
              <span className={`connection-indicator ${connectionStatus}`}>
                {connectionStatus === 'connecting' && 'Connecting...'}
                {connectionStatus === 'connected' && 'Connected'}
                {connectionStatus === 'disconnected' && (
                  <button 
                    className="reconnect-btn" 
                    onClick={handleReconnect}
                    title="Reconnect"
                  >
                    Reconnect
                  </button>
                )}
              </span>
            </div>
            {agentTyping && <span className="typing-indicator">Agent is typing...</span>}
          </div>
        </div>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === "user" ? "user-message" : "bot-message"}`}
          >
            <div className="message-content">
              {message.text}
            </div>
            <div className="message-info">
              <span className="message-time">{formatTime(message.timestamp)}</span>
              <div className="message-reactions">
                {message.reactions && message.reactions.map((reaction, index) => (
                  <span key={index} className="reaction">
                    {reaction.emoji}
                  </span>
                ))}
                <button
                  className="add-reaction-btn"
                  onClick={() => setCurrentMessageId(
                    currentMessageId === message.id ? null : message.id
                  )}
                >
                  <FaSmile />
                </button>
              </div>
            </div>
            
            {currentMessageId === message.id && (
              <div className="emoji-picker">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="emoji-option"
                    onClick={() => handleReaction(message.id, emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="emoji-toggle">
          <button
            className="emoji-button"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <FaSmile />
          </button>
          {showEmojis && (
            <div className="emoji-picker-input">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  className="emoji-option"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          className="chat-input"
          placeholder={
            connectionStatus === 'connecting' ? 'Connecting...' :
            connectionStatus === 'disconnected' ? 'Disconnected. Click Reconnect to try again.' :
            isSending ? "Sending..." : "Type your message..."
          }
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSending || connectionStatus !== 'connected'}
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={inputMessage.trim() === "" || isSending || connectionStatus !== 'connected'}
        >
          {isSending ? (
            <div className="sending-spinner"></div>
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomChat;