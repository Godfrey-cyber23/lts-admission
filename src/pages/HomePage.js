import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaBookOpen, FaUsers, FaChartLine, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/Homepage.css';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [animatedStats, setAnimatedStats] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    // Scroll event listener for section highlighting
    const handleScroll = () => {
      const sections = ['hero', 'stats', 'about', 'programs', 'testimonials', 'cta'];
      const scrollPosition = window.scrollY + 150;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Intersection Observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimatedStats(true);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    const statsSection = document.getElementById('stats');
    if (statsSection) observer.observe(statsSection);
    
    return () => {
      if (statsSection) observer.unobserve(statsSection);
    };
  }, []);
  
  const carouselImages = [
    { src: "/school-building.jpg", alt: "School campus with modern facilities" },
    { src: "/classroom.jpg", alt: "Students engaged in classroom learning" },
    { src: "/pre-school.jpg", alt: "Children playing in school playground" },
    { src: "/graduation.jpg", alt: "Graduation ceremony at our school" }
  ];

  return (
    <div className="homepage">
      {/* Navigation Dots - Hidden on mobile */}
      {!isMobile && (
        <div className="navigation-dots">
          {['hero', 'stats', 'about', 'programs', 'testimonials', 'cta'].map((section) => (
            <a 
              key={section}
              href={`#${section}`}
              className={`dot ${activeSection === section ? 'active' : ''}`}
              aria-label={`Jump to ${section} section`}
            />
          ))}
        </div>
      )}
      
      {/* Hero Section */}
      <section id="hero" className="homepage-hero-section">
        <div className="hero-overlay"></div>
        <div className="particles-container" id="particles-js"></div>
        
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          className="hero-carousel"
        >
          {carouselImages.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img
                src={image.src}
                alt={image.alt}
                className="carousel-image"
              />
            </div>
          ))}
        </Carousel>

        <div className="homepage-hero-content">
          <h1 className="homepage-hero-title">Welcome to literacy tree School</h1>
          <p className="homepage-hero-subtitle">
            Nurturing young minds for a brighter future through quality education and holistic development.
          </p>
          <div className="homepage-hero-buttons">
            <Link
              to="/admission"
              className="btn btn-primary pulse"
              aria-label="Apply for admission"
            >
              Apply Now <FaArrowRight className="btn-icon" />
            </Link>
            <Link
              to="/programs"
              className="btn btn-secondary"
              aria-label="View our programs"
            >
              Our Programs <FaGraduationCap className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section id="stats" className="stats-section">
        <div className="stats-grid">
          <div className={`stat-card ${animatedStats ? 'animate' : ''}`}>
            <div className="stat-icon-wrapper">
              <FaGraduationCap className="stat-icon" />
            </div>
            <h3 className="stat-number">
              <span className="count-up" data-target="15">0</span>+
            </h3>
            <p className="stat-label">Years Experience</p>
          </div>
          <div className={`stat-card ${animatedStats ? 'animate' : ''}`}>
            <div className="stat-icon-wrapper">
              <FaBookOpen className="stat-icon" />
            </div>
            <h3 className="stat-number">
              <span className="count-up" data-target="8">0</span>
            </h3>
            <p className="stat-label">Academic Programs</p>
          </div>
          <div className={`stat-card ${animatedStats ? 'animate' : ''}`}>
            <div className="stat-icon-wrapper">
              <FaUsers className="stat-icon" />
            </div>
            <h3 className="stat-number">
              <span className="count-up" data-target="200">0</span>+
            </h3>
            <p className="stat-label">Students Enrolled</p>
          </div>
          <div className={`stat-card ${animatedStats ? 'animate' : ''}`}>
            <div className="stat-icon-wrapper">
              <FaChartLine className="stat-icon" />
            </div>
            <h3 className="stat-number">
              <span className="count-up" data-target="100">0</span>%
            </h3>
            <p className="stat-label">University Placement</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <div className="about-media">
            <div className="image-container">
              <img
                src="/school-building.jpg"
                alt="Literacy Tree School Campus"
                className="about-image"
              />
              <div className="image-overlay"></div>
            </div>
          </div>
          <div className="about-text">
            <h2 className="home-section-title">About Our School</h2>
            <p className="about-description">
              Literacy Tree School is a premier educational institution located in Lusaka, Zambia,
              offering quality education from early childhood through secondary levels.
            </p>
            <p className="about-description">
              Our mission is to provide a nurturing environment that fosters academic excellence,
              character development, and lifelong learning skills.
            </p>
            <Link
              to="/about"
              className="about-link"
              aria-label="Learn more about our school"
            >
              Learn more about us <FaArrowRight className="link-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Highlights */}
      <section id="programs" className="programs-section">
        <div className="section-header">
          <h2 className="home-section-title">Our Academic Programs</h2>
          <p className="section-subtitle">Tailored education for every stage of development</p>
        </div>
        
        <div className="programs-grid">
          {[
            {
              title: "Nursery Section",
              description: "Play-based learning for ages 3-6 focusing on foundational skills",
              icon: "👶",
              image: "/classroom-2.jpg"
            },
            {
              title: "Lower Primary Section",
              description: "Comprehensive curriculum for Grades 1-7 with STEM emphasis",
              icon: "✏️",
              image: "/pre-school.jpg"
            },
            {
              title: "Upper Primary Section",
              description: "Preparation for international examinations and university",
              icon: "🎓",
              image: "/classroom.jpg"
            }
          ].map((program, index) => (
            <div key={index} className="program-card">
              <div className="program-image-container">
                <img
                  src={program.image}
                  alt={program.title}
                  className="program-image"
                />
                <div className="program-icon">{program.icon}</div>
              </div>
              <div className="program-content">
                <h3 className="program-title">{program.title}</h3>
                <p className="program-description">{program.description}</p>
                <Link
                  to="/programs"
                  className="btn btn-outline"
                  aria-label={`View details about ${program.title}`}
                >
                  View details <FaArrowRight className="btn-icon" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <h2 className="home-section-title">What Parents Say</h2>
          <p className="section-subtitle">Hear from our school community</p>
        </div>
        
        <div className="testimonials-grid">
          {[
            {
              quote: "Literacy Tree has transformed my child's learning experience. The teachers are exceptional.",
              author: "Mrs. Banda, Parent",
              role: "Grade 3 Parent"
            },
            {
              quote: "The holistic approach to education here is exactly what we were looking for.",
              author: "Mr. Mwila, Parent",
              role: "Grade 7 Parent"
            },
            {
              quote: "My daughter has flourished both academically and socially since joining.",
              author: "Dr. Ngoma, Parent",
              role: "Form 2 Parent"
            }
          ].map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="quote-icon">
                <FaQuoteLeft className="quote-left" />
                <FaQuoteRight className="quote-right" />
              </div>
              <blockquote className="testimonial-quote">
                {testimonial.quote}
              </blockquote>
              <div className="testimonial-author">
                <p className="author-name">{testimonial.author}</p>
                <p className="author-role">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="cta-section">
        <div className="cta-content">
          <h2 className="home-section-title">Ready to Join Our Community?</h2>
          <p className="cta-subtitle">Applications for the 2025-2026 academic year are now open. Limited spaces available.</p>
          <div className="cta-buttons">
            <Link
              to="/admission"
              className="btn btn-primary"
              aria-label="Start application process"
            >
              Start Application
            </Link>
            <Link
              to="/contact"
              className="btn btn-secondary"
              aria-label="Contact admissions office"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;