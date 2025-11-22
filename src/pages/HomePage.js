import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaBookOpen, FaUsers, FaChartLine, FaQuoteLeft, FaQuoteRight, FaPlayCircle, FaFileVideo, FaExclamationTriangle, FaPauseCircle, FaAward, FaUserGraduate, FaClock } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/Homepage.css';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [animatedElements, setAnimatedElements] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = useRef(null);

  // Updated content object with information from the school document
  const pageContent = {
    hero: {
      title: "Welcome To Literacy Tree School",
      subtitle: "Providing the highest quality of childcare, early and primary education at affordable fees for over 10 years.",
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
    // Added stats section
    stats: {
      title: "Our Achievements",
      subtitle: "Numbers that speak for our commitment to excellence",
      items: [
        {
          number: "200+",
          label: "Total Students",
          icon: "users",
          description: "From nursery to primary education"
        },
        {
          number: "100%",
          label: "Pass Rate",
          icon: "chart",
          description: "Consistently high academic performance"
        },
        {
          number: "15+",
          label: "Years of Experience",
          icon: "clock",
          description: "Dedicated to quality education"
        },
        {
          number: "50+",
          label: "Qualified Teachers",
          icon: "graduation",
          description: "Passionate educators committed to excellence"
        }
      ]
    },
    about: {
      title: "About Our School",
      description: "Pickey Ponkey – Literacy Tree School has been a great human conduit for over 10 years. We receive children from early years of Nursery, through Reception to Primary education. Our learners continue to receive unmatched quality teaching each academic year. We are greatly committed to the quality of education received by our individual learners. We value high and low achieving learners and accord multi-ability to individuals as well as groups, learning opportunities equitably; in our whole-embracing school climate and culture. We believe that each child is an individual with his/her own unique temperament, needs, interests and abilities; we try to be aware of the uniqueness of each child in encouraging their interest, fostering their abilities and in meeting their needs for integral growth.",
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
          description: "Play-based learning from 18 months - 5 years focusing on foundational skills and early development",
          icon: "👶",
          image: "/classroom-2.jpg"
        },
        {
          title: "Lower Primary Section",
          description: "Comprehensive curriculum for Grades 1-4 with emphasis on literacy and numeracy",
          icon: "✏️",
          image: "/pre-school.jpg"
        },
        {
          title: "Upper Primary Section",
          description: "Advanced learning for Grades 5-7 preparing students for secondary education",
          icon: "🎓",
          image: "/classroom.jpg"
        }
      ]
    },
    // Updated video section with enhanced design
    howToApply: {
      title: "How to Apply",
      subtitle: "Follow our simple application process to join our school community",
      video: {
        // Use Cloudinary video thumbnail URL
        thumbnail: "/admission-video-thumbnail.png",
        // Using Cloudinary video URL
        videoUrl: "https://res.cloudinary.com/dc8majybh/video/upload/v1763770155/How_to_apply_vids_srsis4.mp4",
        videoType: "external", // "youtube", "local", or "external" for other URLs
        title: "Step-by-Step Application Guide",
        description: "This comprehensive video walks you through our entire application process, from initial inquiry to enrollment. Learn about required documents, important dates, and what to expect during the assessment process."
      },
      // Updated steps based on user requirements with enrollment fee
      steps: [
        {
          title: "Initial Inquiry",
          description: "Contact our admissions office or fill out the online inquiry form to begin the application process"
        },
        {
          title: "Assessment",
          description: "Your child will be given a test to write. This assessment is conducted at a fee to determine appropriate placement"
        },
        {
          title: "Assessment Number",
          description: "After assessment, you'll receive an assessment number. Enter this number on the enroll now page to access the enrollment form"
        },
        {
          title: "Enrollment Fee",
          description: "Pay the required enrollment fee to proceed with the enrollment process. Payment must be completed successfully before accessing the form"
        },
        {
          title: "Enrollment Form",
          description: "Complete the enrollment form with all required information to finalize your child's admission"
        }
      ]
    },
    testimonials: {
      title: "What Parents Say",
      subtitle: "Hear from our school community",
      items: [
        {
          quote: "Literacy Tree has transformed my child's learning experience. The teachers are exceptional and truly care about each student's development.",
          author: "Mrs. Banda, Parent",
          role: "Grade 3 Parent"
        },
        {
          quote: "The holistic approach to education here is exactly what we were looking for. My child has flourished both academically and socially.",
          author: "Mr. Mwila, Parent",
          role: "Grade 7 Parent"
        },
        {
          quote: "The quality of education at Literacy Tree is unmatched. The school's commitment to nurturing individual potential is remarkable.",
          author: "Dr. Ngoma, Parent",
          role: "Grade 5 Parent"
        }
      ]
    }
  };

  // Mouse position tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / scrollHeight) * 100;
      setScrollProgress(progress);
      
      // Section highlighting
      const sections = ['hero', 'stats', 'about', 'programs', 'howToApply', 'testimonials'];
      const scrollPos = window.scrollY + 150;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPos >= element.offsetTop) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimatedElements(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      observer.observe(section);
    });

    // Observe grid containers
    const gridContainers = document.querySelectorAll('.stats-grid, .programs-grid, .testimonials-grid, .steps-grid');
    gridContainers.forEach(container => {
      observer.observe(container);
    });

    // Observe section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      observer.observe(header);
    });

    return () => {
      sections.forEach(section => {
        observer.unobserve(section);
      });
      gridContainers.forEach(container => {
        observer.unobserve(container);
      });
      sectionHeaders.forEach(header => {
        observer.unobserve(header);
      });
    };
  }, []);

  // Function to get the appropriate icon component
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'graduation': return <FaGraduationCap />;
      case 'book': return <FaBookOpen />;
      case 'users': return <FaUsers />;
      case 'chart': return <FaChartLine />;
      case 'arrow': return <FaArrowRight />;
      case 'clock': return <FaClock />;
      case 'award': return <FaAward />;
      case 'user-graduation': return <FaUserGraduate />;
      default: return null;
    }
  };

  // Toggle video play/pause
  const toggleVideoPlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
        setVideoPlaying(false);
      } else {
        setVideoLoading(true);
        setVideoError(false);
        
        // Ensure video is loaded before playing
        const video = videoRef.current;
        
        // Set up event listeners for video loading
        const handleCanPlay = () => {
          setVideoLoading(false);
          video.play().then(() => {
            setVideoPlaying(true);
          }).catch(error => {
            console.error('Error playing video:', error);
            setVideoLoading(false);
            setVideoError(true);
          });
        };
        
        // Add event listener if not already added
        video.addEventListener('canplay', handleCanPlay, { once: true });
        
        // Load and play the video
        video.load();
      }
    }
  };

  // Handle image error for video thumbnail
  const handleThumbnailError = (e) => {
    console.warn(`Video thumbnail failed to load: ${e.target.src}`);
    // Use a placeholder image
    e.target.src = '/placeholder.webp';
  };

  // Handle video error
  const handleVideoError = (e) => {
    console.error('Video loading failed:', {
      src: e.target.src,
      error: e.target.error,
      networkState: e.target.networkState,
      readyState: e.target.readyState
    });
    setVideoLoading(false);
    setVideoError(true);
  };

  // Handle video load success
  const handleVideoLoad = () => {
    setVideoLoading(false);
    setVideoError(false);
  };

  // Handle video can play
  const handleVideoCanPlay = () => {
    setVideoLoading(false);
  };

  // Handle thumbnail load success
  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  // Handle video ended
  const handleVideoEnded = () => {
    setVideoPlaying(false);
  };

  // Create mouse trail effect
  useEffect(() => {
    if (!mousePosition.x || !mousePosition.y) return;
    
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.left = `${mousePosition.x}px`;
    trail.style.top = `${mousePosition.y}px`;
    document.body.appendChild(trail);
    
    const timeout = setTimeout(() => {
      trail.remove();
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [mousePosition]);

  return (
    <div className="homepage">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
      
      {/* Interactive Background */}
      <div 
        className="interactive-bg" 
        style={{ 
          '--mouse-x': `${mousePosition.x}px`, 
          '--mouse-y': `${mousePosition.y}px` 
        }}
      ></div>

      {/* Navigation Dots - Updated to include stats */}
      <div className="navigation-dots">
        {['hero', 'stats', 'about', 'programs', 'howToApply', 'testimonials'].map((section) => (
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
        <div className="particles-container" id="particles-js">
          {/* Animated particles */}
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 15}s`
              }}
            />
          ))}
        </div>

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
                onError={(e) => {
                  console.warn(`Image failed to load: ${image.src}`);
                  e.target.src = '/placeholder.webp';
                }}
              />
            </div>
          ))}
        </Carousel>

        <div className="homepage-hero-content">
          <h1 className="homepage-hero-title glitch">{pageContent.hero.title}</h1>
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

      {/* Stats Section - New Section */}
      <section id="stats" className={`stats-section ${animatedElements['stats'] ? 'animated' : ''}`}>
        <div className={`section-header ${animatedElements['stats'] ? 'animated' : ''}`}>
          <h2 className="home-section-title-stats">{pageContent.stats.title}</h2>
          <p className="section-subtitle">{pageContent.stats.subtitle}</p>
        </div>

        <div className={`stats-grid ${animatedElements['stats'] ? 'animated' : ''}`}>
          {pageContent.stats.items.map((stat, index) => (
            <div 
              key={index} 
              className={`stat-card ${animatedElements['stats'] ? 'animated' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="stat-icon">
                {getIcon(stat.icon)}
              </div>
              <div 
                className="stat-number" 
                data-number={stat.number}
              >
                {stat.number}
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-description">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider"></div>

      {/* About Section - Updated with information from document */}
      <section id="about" className="about-section">
        <div className="about-content">
          <div className={`about-media ${animatedElements['about'] ? 'animated' : ''}`}>
            <div className="image-container">
              <img
                src={pageContent.about.image}
                alt="Literacy Tree School Campus"
                className="about-image"
                onError={(e) => {
                  console.warn(`About image failed to load: ${pageContent.about.image}`);
                  e.target.src = '/placeholder.webp';
                }}
              />
              <div className="image-overlay"></div>
            </div>
          </div>
          <div className={`about-text ${animatedElements['about'] ? 'animated' : ''}`}>
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
      <section id="programs" className={`programs-section ${animatedElements['programs'] ? 'animated' : ''}`}>
        <div className={`section-header ${animatedElements['programs'] ? 'animated' : ''}`}>
          <h2 className="home-section-title">{pageContent.programs.title}</h2>
          <p className="section-subtitle">{pageContent.programs.subtitle}</p>
        </div>

        <div className={`programs-grid ${animatedElements['programs'] ? 'animated' : ''}`}>
          {pageContent.programs.items.map((program, index) => (
            <div 
              key={index} 
              className={`program-card ${animatedElements['programs'] ? 'animated' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="program-image-container">
                <img
                  src={program.image}
                  alt={program.title}
                  className="program-image"
                  onError={(e) => {
                    console.warn(`Program image failed to load: ${program.image}`);
                    e.target.src = '/placeholder.webp';
                  }}
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

      {/* Wave Divider */}
      <div className="wave-divider"></div>

      {/* How to Apply Section - Enhanced with Outstanding Design */}
      <section id="howToApply" className={`how-to-apply-section ${animatedElements['howToApply'] ? 'animated' : ''}`}>
        <div className={`section-header ${animatedElements['howToApply'] ? 'animated' : ''}`}>
          <h2 className="home-section-title">{pageContent.howToApply.title}</h2>
          <p className="section-subtitle">{pageContent.howToApply.subtitle}</p>
        </div>

        <div className="apply-content">
          {/* Video Container - Enhanced Design */}
          <div className={`video-container ${animatedElements['howToApply'] ? 'animated' : ''}`}>
            <div className="video-player-wrapper">
              {/* Always render the video element but control visibility */}
              <video
                ref={videoRef}
                src={pageContent.howToApply.video.videoUrl}
                playsInline
                title={pageContent.howToApply.video.title}
                onError={handleVideoError}
                onLoad={handleVideoLoad}
                onCanPlay={handleVideoCanPlay}
                onEnded={handleVideoEnded}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                style={{
                  width: '100%',
                  height: '100%',
                  display: videoPlaying ? 'block' : 'none',
                  objectFit: 'contain',
                  backgroundColor: '#000',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1
                }}
              >
                <source src={pageContent.howToApply.video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {!videoPlaying ? (
                // Thumbnail view when video is not playing
                <div className="video-thumbnail" onClick={toggleVideoPlay}>
                  {!thumbnailLoaded && (
                    <div className="video-loading">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  <img
                    src={pageContent.howToApply.video.thumbnail}
                    alt={pageContent.howToApply.video.title}
                    className="video-thumbnail-img"
                    onError={handleThumbnailError}
                    onLoad={handleThumbnailLoad}
                    style={{ display: thumbnailLoaded ? 'block' : 'none' }}
                  />
                  <div className="play-button" onClick={toggleVideoPlay}>
                    <FaPlayCircle />
                  </div>
                </div>
              ) : (
                // Video controls overlay when playing
                <div className="video-controls-overlay">
                  {videoLoading && (
                    <div className="video-loading-overlay">
                      <div className="loading-spinner-large"></div>
                      <p>Loading video...</p>
                    </div>
                  )}

                  {videoError && (
                    <div className="video-error-message">
                      <div className="video-error-content">
                        <FaFileVideo className="error-icon" />
                        <h4>Video Temporarily Unavailable</h4>
                        <p>We're unable to load the video at this moment. This could be due to:</p>
                        <ul>
                          <li>Network connectivity issues</li>
                          <li>Video file processing</li>
                          <li>Browser compatibility</li>
                        </ul>
                        <div className="error-actions">
                          <button onClick={() => {
                            setVideoError(false);
                            setVideoLoading(true);
                            videoRef.current.load();
                          }} className="btn btn-primary">Try Again</button>
                          <a href="/contact" className="btn btn-secondary">Contact Admissions</a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <h3 className="video-title">{pageContent.howToApply.video.title}</h3>
            <p className="video-description">{pageContent.howToApply.video.description}</p>
          </div>

          {/* Steps Container - Enhanced Design */}
          <div className={`steps-container ${animatedElements['howToApply'] ? 'animated' : ''}`}>
            <h3 className="steps-title">Application Process</h3>
            <div className={`steps-grid ${animatedElements['howToApply'] ? 'animated' : ''}`}>
              {pageContent.howToApply.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`step-card ${animatedElements['howToApply'] ? 'animated' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="step-number">{index + 1}</div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-description">{step.description}</p>
                </div>
              ))}
            </div>
            <Link to="/admission" className="btn btn-primary apply-now-btn">
              Start Application <FaArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="wave-divider"></div>

      {/* Testimonials */}
      <section id="testimonials" className={`testimonials-section ${animatedElements['testimonials'] ? 'animated' : ''}`}>
        <div className={`section-header ${animatedElements['testimonials'] ? 'animated' : ''}`}>
          <h2 className="home-section-title">{pageContent.testimonials.title}</h2>
          <p className="section-subtitle">{pageContent.testimonials.subtitle}</p>
        </div>

        <div className={`testimonials-grid ${animatedElements['testimonials'] ? 'animated' : ''}`}>
          {pageContent.testimonials.items.map((testimonial, index) => (
            <div 
              key={index} 
              className={`testimonial-card ${animatedElements['testimonials'] ? 'animated' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
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
    </div>
  );
};

export default HomePage;