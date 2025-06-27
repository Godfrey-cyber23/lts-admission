import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import { Link } from 'react-router-dom';
import '../styles/Sitemap.css';

const Sitemap = () => {
    return (
        <div className="sitemap-container">
            <div className="sitemap-header">
                <h1>Literacy Tree School Sitemap</h1>
                <p>Navigate our website with ease using this comprehensive sitemap</p>
            </div>

            <div className="sitemap-grid">
                {/* Main Pages Section */}
                <div className="sitemap-section">
                    <h2><FaHome className="icon" /> Main Pages</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/mission">Mission & Values</Link></li>
                        <li><Link to="/faculty">Our Faculty</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Academics Section */}
                <div className="sitemap-section">
                    <h2><IoMdSchool className="icon" /> Academics</h2>
                    <ul>
                        <li><Link to="/programs">Academic Programs</Link></li>
                        <li><Link to="/early-childhood">Early Childhood</Link></li>
                        <li><Link to="/primary">Primary School</Link></li>
                        <li><Link to="/special-programs">Special Programs</Link></li>
                        <li><Link to="/curriculum">Curriculum</Link></li>
                        <li><Link to="/resources">Learning Resources</Link></li>
                    </ul>
                </div>

                {/* Admissions Section */}
                <div className="sitemap-section">
                    <h2><IoMdSchool className="icon" /> Admissions</h2>
                    <ul>
                        <li><Link to="/admissions">Admissions Process</Link></li>
                        <li><Link to="/requirements">Requirements</Link></li>
                        <li><Link to="/tuition">Tuition & Fees</Link></li>
                        <li><Link to="/scholarships">Scholarships</Link></li>
                        <li><Link to="/faq">FAQs</Link></li>
                    </ul>
                </div>

                {/* School Life Section */}
                <div className="sitemap-section">
                    <h2><IoMdSchool className="icon" /> School Life</h2>
                    <ul>
                        <li><Link to="/calendar">Academic Calendar</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        <li><Link to="/gallery">Photo Gallery</Link></li>
                        <li><Link to="/news">News & Announcements</Link></li>
                        <li><Link to="/clubs">Clubs & Activities</Link></li>
                    </ul>
                </div>

                {/* Resources Section */}
                <div className="sitemap-section">
                    <h2><IoMdSchool className="icon" /> Resources</h2>
                    <ul>
                        <li><Link to="/parent-portal">Parent Portal</Link></li>
                        <li><Link to="/handbooks">School Handbooks</Link></li>
                        <li><Link to="/forms">Downloadable Forms</Link></li>
                        <li><Link to="/uniform">Uniform Policy</Link></li>
                        <li><Link to="/transportation">Transportation</Link></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="sitemap-section">
                    <h2><FaPhone className="icon" /> Contact</h2>
                    <ul className="contact-info">
                        <li>
                            <FaMapMarkerAlt className="icon" />
                            <span>St. Bonaventure University, Makeni Area, Lusaka, Zambia</span>
                        </li>
                        <li>
                            <FaEnvelope className="icon" />
                            <a href="mailto:info@literacytree.edu">info@literacytree.edu</a>
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
            </div>

            <div className="sitemap-footer">
                <p>Can't find what you're looking for? <Link to="/contact">Contact us</Link> for assistance.</p>
            </div>
        </div>
    );
};

export default Sitemap;