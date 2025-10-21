import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap, FaCalendarAlt, FaLifeRing } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import { Link } from 'react-router-dom';
import '../styles/Sitemap.css';

const Sitemap = () => {
    const navigationSections = [
        {
            title: "Main Pages",
            icon: FaHome,
            links: [
                { path: "/", label: "Home" },
                { path: "/about", label: "About Us" },
                { path: "/mission", label: "Mission & Values" },
                { path: "/faculty", label: "Our Faculty" },
                { path: "/contact", label: "Contact Us" }
            ]
        },
        {
            title: "Academics",
            icon: IoMdSchool,
            links: [
                { path: "/programs", label: "Academic Programs" },
                { path: "/early-childhood", label: "Early Childhood" },
                { path: "/primary", label: "Primary School" },
                { path: "/special-programs", label: "Special Programs" },
                { path: "/curriculum", label: "Curriculum" },
                { path: "/resources", label: "Learning Resources" }
            ]
        },
        {
            title: "Admissions",
            icon: FaGraduationCap,
            links: [
                { path: "/admissions", label: "Admissions Process" },
                { path: "/requirements", label: "Requirements" },
                { path: "/tuition", label: "Tuition & Fees" },
                { path: "/scholarships", label: "Scholarships" },
                { path: "/faq", label: "FAQs" }
            ]
        },
        {
            title: "School Life",
            icon: FaCalendarAlt,
            links: [
                { path: "/calendar", label: "Academic Calendar" },
                { path: "/events", label: "Events" },
                { path: "/gallery", label: "Photo Gallery" },
                { path: "/news", label: "News & Announcements" },
                { path: "/clubs", label: "Clubs & Activities" }
            ]
        },
        {
            title: "Resources",
            icon: FaLifeRing,
            links: [
                { path: "/parent-portal", label: "Parent Portal" },
                { path: "/handbooks", label: "School Handbooks" },
                { path: "/forms", label: "Downloadable Forms" },
                { path: "/uniform", label: "Uniform Policy" },
                { path: "/transportation", label: "Transportation" }
            ]
        }
    ];

    const contactInfo = {
        address: "St. Bonaventure University, Makeni Area, Lusaka, Zambia",
        email: "info@literacytree.edu",
        phones: ["+260 977-845317", "+260 966-845317", "+260 971-935653"]
    };

    return (
        <div className="sitemap-container">
            <header className="sitemap-header" role="banner">
                <h1>Literacy Tree School Sitemap</h1>
                <p className="sitemap-subtitle">
                    Navigate our website with ease using this comprehensive sitemap
                </p>
            </header>

            <main className="sitemap-main" role="main">
                <div className="sitemap-grid">
                    {/* Navigation Sections */}
                    {navigationSections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                            <section key={index} className="sitemap-section" aria-labelledby={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                <h2 id={`section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                                    <IconComponent className="sitemap-icon" aria-hidden="true" />
                                    {section.title}
                                </h2>
                                <nav aria-label={`${section.title} navigation`}>
                                    <ul className="sitemap-links">
                                        {section.links.map((link, linkIndex) => (
                                            <li key={linkIndex}>
                                                <Link 
                                                    to={link.path} 
                                                    className="sitemap-link"
                                                    aria-label={`Navigate to ${link.label}`}
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </section>
                        );
                    })}

                    {/* Contact Information Section */}
                    <section className="sitemap-section" aria-labelledby="section-contact">
                        <h2 id="section-contact">
                            <FaPhone className="sitemap-icon" aria-hidden="true" />
                            Contact Information
                        </h2>
                        <div className="contact-info">
                            <div className="contact-item">
                                <FaMapMarkerAlt className="contact-icon" aria-hidden="true" />
                                <address className="contact-text">
                                    {contactInfo.address}
                                </address>
                            </div>
                            <div className="contact-item">
                                <FaEnvelope className="contact-icon" aria-hidden="true" />
                                <a 
                                    href={`mailto:${contactInfo.email}`}
                                    className="contact-link"
                                    aria-label="Send email to Literacy Tree School"
                                >
                                    {contactInfo.email}
                                </a>
                            </div>
                            <div className="contact-item">
                                <FaPhone className="contact-icon" aria-hidden="true" />
                                <div className="phone-numbers">
                                    {contactInfo.phones.map((phone, index) => (
                                        <p key={index} className="phone-number">
                                            <a 
                                                href={`tel:${phone.replace(/\s+/g, '')}`}
                                                aria-label={`Call ${phone}`}
                                            >
                                                {phone}
                                            </a>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="sitemap-footer" role="contentinfo">
                <p>
                    Can't find what you're looking for?{" "}
                    <Link to="/contact" className="footer-link" aria-label="Contact us for assistance">
                        Contact us
                    </Link>{" "}
                    for assistance.
                </p>
            </footer>
        </div>
    );
};

export default Sitemap;