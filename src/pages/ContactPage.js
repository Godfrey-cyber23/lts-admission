import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaPaperPlane, FaTiktok, FaYoutube, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  createChatSession,
  sendMessage,
  listenToSessionMessages,
  listenToSessionStatus,
  updateSessionStatus
} from '../components/firebaseService';
import '../styles/ContactUs.css';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_tmzavcc';
const EMAILJS_TEMPLATE_ID = 'template_49p77bi';
const EMAILJS_PUBLIC_KEY = 'KBr4yJBL_daNLGEYG';

console.log('EmailJS Configuration:', {
  serviceId: EMAILJS_SERVICE_ID,
  templateId: EMAILJS_TEMPLATE_ID,
  publicKey: EMAILJS_PUBLIC_KEY ? '***' + EMAILJS_PUBLIC_KEY.slice(-4) : 'undefined'
});

const ContactPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Admissions Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [chatSessionId, setChatSessionId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [emailjsInitialized, setEmailjsInitialized] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    initializeChatSession();

    // Initialize EmailJS - FIXED VERSION
    try {
      // EmailJS init doesn't always return a promise in newer versions
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log('EmailJS initialized successfully');
      setEmailjsInitialized(true);
    } catch (error) {
      console.error('EmailJS initialization failed:', error);
      setEmailjsInitialized(false);
    }

    return () => {
      setIsMounted(false);
    };
  }, []);

  // Initialize chat session
  const initializeChatSession = async () => {
    try {
      const sessionId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await createChatSession(sessionId);
      setChatSessionId(sessionId);

      await updateSessionStatus(sessionId, { userOnline: true });

      const unsubscribeMessages = listenToSessionMessages(sessionId, (messages) => {
        setChatMessages(messages);
      });

      const unsubscribeStatus = listenToSessionStatus(sessionId, (status) => {
        setSessionStatus(status);
      });

      return () => {
        unsubscribeMessages();
        unsubscribeStatus();
      };
    } catch (error) {
      console.error('Error initializing chat session:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error('Please fill in all required fields');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        to_email: 'kasandwe69@yahoo.co.uk', // Fixed typo
        reply_to: formData.email,
        timestamp: new Date().toLocaleString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href
      };

      console.log('Sending email with params:', templateParams);

      // Send email via EmailJS
      const emailResult = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('EmailJS response:', emailResult);

      if (emailResult.status === 200) {
        // Send message to Firebase chat
        if (chatSessionId) {
          await sendMessage(
            chatSessionId,
            `New contact form submission:\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nSubject: ${formData.subject}\nMessage: ${formData.message}`,
            'user',
            formData.name
          );

          await updateSessionStatus(chatSessionId, {
            formData: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              subject: formData.subject
            },
            emailSent: true,
            emailTimestamp: new Date().toISOString()
          });
        }

        setSubmitStatus('success');
        setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Admissions Inquiry',
          message: ''
        });

      } else {
        throw new Error('Failed to send email');
      }

    } catch (error) {
      console.error('Error submitting form:', error);

      // Handle specific errors safely
      let errorMessage = 'There was an error sending your message. Please try again.';
      const errorMessageStr = error?.message || error?.toString() || '';

      if (errorMessageStr.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessageStr.includes('Failed to send email')) {
        errorMessage = 'Email service temporarily unavailable. Please try again later.';
      } else if (errorMessageStr.includes('service ID is required')) {
        errorMessage = 'Email service configuration error. Please contact us directly at kasandwe69@yahoo.co.uk';
      } else if (errorMessageStr.includes('fill in all required')) {
        errorMessage = errorMessageStr;
      } else if (errorMessageStr.includes('valid email address')) {
        errorMessage = errorMessageStr;
      }

      setSubmitStatus('error');
      setSubmitMessage(errorMessage);

      // Log to Firebase if available
      if (chatSessionId) {
        await sendMessage(
          chatSessionId,
          `Form submission failed: ${errorMessageStr}`,
          'system',
          'System'
        );
      }
    } finally {
      setIsSubmitting(false);

      // Auto-hide messages after 8 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 8000);
    }
  };

  const handleGetDirections = () => {
    const destination = "St. Bonaventure University College, Makeni Area, Lusaka, Zambia";
    const encodedDestination = encodeURIComponent(destination);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`, '_blank');
  };

  const sendQuickReply = async (quickMessage) => {
    if (chatSessionId) {
      try {
        await sendMessage(chatSessionId, quickMessage, 'user', 'User');

        // Send email for quick replies
        const templateParams = {
          from_name: 'Website Visitor',
          from_email: 'quick-reply@literacytree.edu',
          subject: 'Quick Inquiry',
          message: quickMessage,
          to_email: 'kasandwe69@yahoo.co.uk', // Fixed typo
          timestamp: new Date().toLocaleString(),
          inquiry_type: 'quick_action'
        };

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        setSubmitStatus('success');
        setSubmitMessage('Your quick inquiry has been sent! We\'ll respond shortly.');

        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage('');
        }, 5000);
      } catch (error) {
        console.error('Error sending quick reply:', error);
        setSubmitStatus('error');
        setSubmitMessage('Failed to send quick inquiry. Please use the contact form.');

        setTimeout(() => {
          setSubmitStatus(null);
          setSubmitMessage('');
        }, 5000);
      }
    }
  };

  return (
    <div className="hero-contact-page">
      {/* Animated Hero Section with Sliding Background */}
      <section className="contact-hero" style={{
        position: 'relative',
        height: '70vh',
        minHeight: '500px',
        background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("/classroom-1.jpg") center/cover no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'var(--color-white)',
        overflow: 'hidden',
        animation: 'backgroundPan 30s linear infinite'
      }}>
        {/* Hero content positioned directly on image - NO OVERLAY */}
        <div className="hero-content" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '900px', // Increased max width
          width: '100%', // Full width for small devices
          zIndex: 10,
          padding: '2.5rem 2rem',
          background: 'rgba(44, 94, 58, 0.4)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="hero-title"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 700,
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.2',
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
              color: '#ffffff',
              opacity: 1,
              display: 'block',
              width: '100%',
              textAlign: 'center'
            }}
          >
            Connect With Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
            style={{
              fontSize: 'clamp(0.85rem, 2.5vw, 1.5rem)', // Improved responsive font size
              maxWidth: '800px', // Increased max width
              margin: '0 auto',
              lineHeight: '1.6',
              textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
              color: '#ffffff',
              opacity: 1,
              display: 'block',
              width: '100%',
              textAlign: 'center',
              alignSelf: 'center',
              wordWrap: 'break-word', // Added word-wrap for small devices
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            We're here to answer your questions and welcome you to our community
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="contact-container">
        {/* Contact Info Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={isMounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="contact-info-section"
        >
          <h2 className="section-title">
            <span>Our Contact Information</span>
          </h2>

          <div className="contact-grid">
            {/* Address Card */}
            <motion.div whileHover={{ y: -5 }} className="contact-card">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="contact-details">
                <h3>Our Location</h3>
                <p>St. Bonaventure University College</p>
                <p>Makeni Area, Lusaka, Zambia</p>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div whileHover={{ y: -5 }} className="contact-card">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <div className="contact-details">
                <h3>Call Us</h3>
                <p>Admissions: (+260) 977-845317</p>
                <p>Main Office: (+260) 971-935653</p>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div whileHover={{ y: -5 }} className="contact-card">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div className="contact-details">
                <h3>Email Us</h3>
                <p>General: kasandwe69@yahoo.co.uk</p>
                <p>Admissions: admissions@literacytree.edu</p>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div whileHover={{ y: -5 }} className="contact-card">
              <div className="contact-icon">
                <FaClock />
              </div>
              <div className="contact-details">
                <h3>Office Hours</h3>
                <p>Monday-Friday: 7:30 AM - 4:30 PM</p>
                <p>Saturday: 9:00 AM - 12:00 PM</p>
              </div>
            </motion.div>
          </div>

          {/* Quick Action Buttons */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="quick-actions-buttons">
              <button
                onClick={() => sendQuickReply("I'm interested in admissions information and would like to learn more about the application process.")}
                className="quick-action-btn"
              >
                📚 Admissions Info
              </button>
              <button
                onClick={() => sendQuickReply("I'd like to schedule a school visit to tour the campus and learn more about your facilities.")}
                className="quick-action-btn"
              >
                🏫 Schedule Visit
              </button>
              <button
                onClick={() => sendQuickReply("I have a general question about school programs, fees, or enrollment process.")}
                className="quick-action-btn"
              >
                ❓ General Question
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div className="social-media-section">
            <h3>Follow Our Journey</h3>
            <div className="social-icons">
              <motion.a
                href="https://web.facebook.com/profile.php?id=100054527196325"
                whileHover={{ scale: 1.1 }}
                className="social-icon facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </motion.a>

              <motion.a
                href="https://www.tiktok.com/@literacy.tree.scho?lang=en"
                whileHover={{ scale: 1.1 }}
                className="social-icon tiktok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </motion.a>

              <motion.a
                href="https://www.instagram.com/literacytreeschool/"
                whileHover={{ scale: 1.1 }}
                className="social-icon instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </motion.a>

              <motion.a
                href="https://www.youtube.com/@LiteracyTreeSchool"
                whileHover={{ scale: 1.1 }}
                className="social-icon youtube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </motion.a>
            </div>
          </div>
        </motion.section>

        {/* Contact Form Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={isMounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="contact-form-section"
        >
          <h2 className="section-title">
            <span>Send Us a Message</span>
          </h2>

          {submitStatus === 'success' && (
            <div className="success-message">
              {submitMessage}
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="error-message">
              {submitMessage}
            </div>
          )}

          <form className="enquiry-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="form-input"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="form-input"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(+260) XXX-XXXXXX"
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-input"
                disabled={isSubmitting}
              >
                <option>Admissions Inquiry</option>
                <option>General Question</option>
                <option>School Visit</option> {/* Fixed typo */}
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                placeholder="How can we help you? Please include any specific questions or information you'd like to know."
                className="form-input"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <FaPaperPlane /> Send Message
                </>
              )}
            </motion.button>

            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-light)',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              * Required fields
            </p>
          </form>
        </motion.section>

        {/* Map Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={isMounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="map-section"
        >
          <h2 className="section-title">
            <span>Find Our Campus</span>
          </h2>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2384.123456789012!2d28.12345678901234!3d-15.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDA3JzI0LjQiUyAyOMKwMDcnMjQuNCJF!5e0!3m2!1sen!2szm!4v1234567890123!5m2!1sen!2szm"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Literacy Tree Location Map"
              className="map-iframe"
            ></iframe>
          </div>

          <div className="map-footer">
            <p>St. Bonaventure University College, Makeni Area, Lusaka, Zambia</p>
            <button
              type="button"
              className="directions-btn"
              onClick={handleGetDirections}
            >
              Get Directions
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;