import { FaHome, FaCalendarAlt, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCopyright, FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaYoutube, FaArrowRight } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="app-footer">
            <div className="container">
                <div className="grid">
                    {/* Quick Links Section */}
                    <div className="footer-section">
                        <h3>
                            <IoMdSchool className="mr-2" /> Quick Links
                        </h3>
                        <ul>
                            <li>
                                <a href="/">
                                    <FaHome /> Home
                                </a>
                            </li>
                            <li>
                                <a href="/faq">
                                    <IoMdSchool /> FAQs
                                </a>
                            </li>
                            <li>
                                <a href="/calendar">
                                    <FaCalendarAlt /> Academic Calendar
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="footer-section">
                        <h3>Contact Information</h3>
                        <ul className="contact-info">
                            <li>
                                <FaMapMarkerAlt className="icon" />
                                <span>St. Bonaventure University, Makeni Area, Lusaka, Zambia</span>
                            </li>
                            <li>
                                <FaEnvelope className="icon" />
                                <a href="mailto:info@literacytree.edu">
                                    info@literacytree.edu
                                </a>
                            </li>
                            <li>
                                <FaPhone className="icon" />
                                <div>
                                    <p>+260 977-845317</p>
                                    <p>+260 966-845317</p>
                                    <p>+260 971-935653</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Academics Section */}
                    <div className="footer-section">
                        <h3>Academics</h3>
                        <ul>
                            <li>
                                <a href="/programs">
                                    <IoMdSchool /> Programs
                                </a>
                            </li>
                            <li>
                                <a href="/faculty">
                                    <IoMdSchool /> Faculty
                                </a>
                            </li>
                            <li>
                                <a href="/resources">
                                    <IoMdSchool /> Resources
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Section */}
                    <div className="footer-section">
                        <h3>Connect With Us</h3>
                        <div className="social-links">
                            <a href="https://facebook.com" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="https://tiktok.com" aria-label="TikTok">
                                <FaTiktok />
                            </a>
                            <a href="https://instagram.com" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="https://youtube.com" aria-label="Youtube">
                                < FaYoutube />
                            </a>
                        </div>

                        {/* Newsletter Subscription */}
                        <div className="newsletter-container">
                            <h4>Stay Updated</h4>
                            <div className="newsletter-form">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="newsletter-input"
                                    aria-label="Email for newsletter subscription"
                                />
                                <button className="newsletter-btn">
                                    Subscribe <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <p>
                        <FaCopyright />{currentYear} Literacy Tree School. All rights reserved.
                    </p>
                    <div className="footer-links">
                        <a href="/privacy" className="footer-link">Privacy Policy</a>
                        <a href="/terms" className="footer-link">Terms of Service</a>
                        <a href="/sitemap" className="footer-link">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;