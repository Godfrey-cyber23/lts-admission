import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaBookOpen, FaUsers, FaChartLine, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/Homepage.css';
import api from '../api/api';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [animatedStats, setAnimatedStats] = useState(false);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
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

  // Fetch home page content from API
  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        setLoading(true);
        const response = await api.get('/pages/home');
        const pageData = response.data.data || response.data;
        
        // Parse the content if it's stored as JSON
        let parsedContent = pageData.content;
        if (typeof pageData.content === 'string') {
          try {
            parsedContent = JSON.parse(pageData.content);
          } catch (e) {
            console.error('Error parsing home page content:', e);
            // Fallback to default content if parsing fails
            parsedContent = getDefaultContent();
          }
        }
        
        setPageContent(parsedContent);
      } catch (error) {
        console.error('Error fetching home page content:', error);
        // Set fallback content if API call fails
        setPageContent(getDefaultContent());
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomePageContent();
  }, []);

  // Default content function
  const getDefaultContent = () => ({
    hero: {
      title: "Welcome To Literacy Tree School",
      subtitle: "Nurturing young minds for a brighter future through quality education and holistic development.",
      images: [
        { src: "/school-building.jpg", alt: "School campus with modern facilities" },
        { src: "/classroom.jpg", alt: "Students engaged in classroom learning" },
        { src: "/pre-school.jpg", alt: "Children playing in school playground" },
        { src: "/graduation.jpg", alt: "Graduation ceremony at our school" }
      ],
      buttons: [
        { text: "Apply Now", link: "/admission", icon: "arrow" },
        { text: "Our Programs", link: "/programs", icon: "graduation" }
      ]
    },
    stats: [
      { number: "15", label: "Years Experience", icon: "graduation" },
      { number: "7", label: "Grades Offered", icon: "book" },
      { number: "200", label: "Pupils Enrolled", icon: "users" },
      { number: "100", label: "School Placement", icon: "chart", suffix: "%" }
    ],
    about: {
      title: "About Our School",
      description: "Literacy Tree School is a premier educational institution located in Lusaka, Zambia, offering quality education from early childhood through upper primary levels. We believe that each child is an individual with his/her own unique temperament, needs, interests and abilities. We try to be aware of the uniqueness of each child in encouraging their interests, fostering their abilities and in meeting their needs for integral growth.",
      image: "/school-building.jpg",
      linkText: "Learn more about us",
      link: "/about"
    },
    programs: {
      title: "Our Academic Programs",
      subtitle: "Tailored education for every stage of development",
      items: [
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
      ]
    },
    testimonials: {
      title: "What Parents Say",
      subtitle: "Hear from our school community",
      items: [
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
      ]
    },
    cta: {
      title: "Ready to Join Our Community?",
      subtitle: "Applications for the 2025-2026 academic year are now open. Limited spaces available.",
      buttons: [
        { text: "Start Application", link: "/admission" },
        { text: "Contact Admissions", link: "/contact" }
      ]
    }
  });

  // Function to get the appropriate icon component
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'graduation': return <FaGraduationCap />;
      case 'book': return <FaBookOpen />;
      case 'users': return <FaUsers />;
      case 'chart': return <FaChartLine />;
      case 'arrow': return <FaArrowRight />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading content...</p>
      </div>
    );
  }

  if (!pageContent) {
    return (
      <div className="error-container">
        <p>Failed to load page content. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Navigation Dots */}
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
      
      {/* Hero Section */}
      <section id="hero" className="homepage-hero-section">
        <div className="particles-container" id="particles-js"></div>
        
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          className="hero-carousel"
        >
          {pageContent.hero.images.map((image, index) => (
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
          <h1 className="homepage-hero-title">{pageContent.hero.title}</h1>
          <p className="homepage-hero-subtitle">
            {pageContent.hero.subtitle}
          </p>
          <div className="homepage-hero-buttons">
            {pageContent.hero.buttons.map((button, index) => (
              <Link
                key={index}
                to={button.link}
                className={`btn ${index === 0 ? 'btn-primary pulse' : 'btn-secondary'}`}
                aria-label={button.text}
              >
                {button.text} {getIcon(button.icon) && <span className="btn-icon">{getIcon(button.icon)}</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section id="stats" className="stats-section">
        <div className="stats-grid">
          {pageContent.stats.map((stat, index) => (
            <div key={index} className={`stat-card ${animatedStats ? 'animate' : ''}`}>
              <div className="stat-icon-wrapper">
                {getIcon(stat.icon)}
              </div>
              <h3 className="stat-number">
                <span className="count-up" data-target={stat.number}>{stat.number}</span>
                {stat.suffix && <span>{stat.suffix}</span>}
              </h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <div className="about-media">
            <div className="image-container">
              <img
                src={pageContent.about.image}
                alt="Literacy Tree School Campus"
                className="about-image"
              />
              <div className="image-overlay"></div>
            </div>
          </div>
          <div className="about-text">
            <h2 className="home-section-title">{pageContent.about.title}</h2>
            <p className="about-description">
              {pageContent.about.description}
            </p>
            <Link
              to={pageContent.about.link}
              className="about-link"
              aria-label={pageContent.about.linkText}
            >
              {pageContent.about.linkText} <FaArrowRight className="link-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Programs Highlights */}
      <section id="programs" className="programs-section">
        <div className="section-header">
          <h2 className="home-section-title">{pageContent.programs.title}</h2>
          <p className="section-subtitle">{pageContent.programs.subtitle}</p>
        </div>
        
        <div className="programs-grid">
          {pageContent.programs.items.map((program, index) => (
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
          <h2 className="home-section-title">{pageContent.testimonials.title}</h2>
          <p className="section-subtitle">{pageContent.testimonials.subtitle}</p>
        </div>
        
        <div className="testimonials-grid">
          {pageContent.testimonials.items.map((testimonial, index) => (
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
          <h2 className="home-section-title">{pageContent.cta.title}</h2>
          <p className="cta-subtitle">{pageContent.cta.subtitle}</p>
          <div className="cta-buttons">
            {pageContent.cta.buttons.map((button, index) => (
              <Link
                key={index}
                to={button.link}
                className={`btn ${index === 0 ? 'btn-primary' : 'btn-secondary'}`}
                aria-label={button.text}
              >
                {button.text}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;