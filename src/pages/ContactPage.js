import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../styles/ContactUs.css';

const ContactPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div className="hero-contact-page">
      {/* Animated Hero Section with Sliding Background */}
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Connect With Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isMounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
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
            <motion.div 
              whileHover={{ y: -5 }}
              className="contact-card"
            >
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="contact-details">
                <h3>Our Location</h3>
                <p>St. Bonaventure University Campus</p>
                <p>Makeni Area, Lusaka, Zambia</p>
              </div>
            </motion.div>

            {/* Phone Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="contact-card"
            >
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
            <motion.div 
              whileHover={{ y: -5 }}
              className="contact-card"
            >
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div className="contact-details">
                <h3>Email Us</h3>
                <p>General: info@literacytree.edu</p>
                <p>Admissions: admissions@literacytree.edu</p>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="contact-card"
            >
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

          {/* Social Media */}
          <div className="social-media-section">
            <h3>Follow Our Journey</h3>
            <div className="social-icons">
              <motion.a 
                href="https://facebook.com" 
                whileHover={{ scale: 1.1 }}
                className="social-icon facebook"
              >
                <FaFacebook />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                whileHover={{ scale: 1.1 }}
                className="social-icon twitter"
              >
                <FaTwitter />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                whileHover={{ scale: 1.1 }}
                className="social-icon instagram"
              >
                <FaInstagram />
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
          
          <form className="enquiry-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Full Name" 
                className="form-input"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="your@email.com" 
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  placeholder="(+260) XXX-XXXXXX" 
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select id="subject" className="form-input">
                <option>Admissions Inquiry</option>
                <option>General Question</option>
                <option>School Visit</option>
                <option>Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea 
                id="message" 
                rows="5" 
                placeholder="How can we help you?" 
                className="form-input"
              ></textarea>
            </div>
            
            <motion.button 
              type="submit" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="submit-btn"
            >
              <FaPaperPlane /> Send Message
            </motion.button>
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
            <p>St. Bonaventure University Campus, Makeni Area, Lusaka, Zambia</p>
            <button type="button" className="directions-btn">Get Directions</button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;