import { FaSchool, FaChalkboardTeacher, FaHistory, FaAward, FaSeedling, FaHandsHelping, FaLightbulb } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/AboutPage.css';

const heroImages = [
    { src: "/graduation.jpg", alt: "Graduation ceremony at Literacy Tree School" },
    { src: "/school-building.jpg", alt: "Literacy Tree School campus" },
    { src: "/classroom.jpg", alt: "Students learning in classroom" },
    { src: "/library.jpeg", alt: "School library" }
  ];

const AboutPage = () => {
  const historyImages = [
    { src: "/school-early-days.jpg", alt: "Literacy Tree School in early days" },
    { src: "/school-building.jpg", alt: "Current school campus" },
    { src: "/graduation-ceremony.jpg", alt: "Annual graduation ceremony" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section with Full-width Image */}
      <section className="about-hero">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          stopOnHover={false}
          transitionTime={800}
          className="hero-carousel"
        >
          {heroImages.map((image, index) => (
            <div key={index} className="hero-slide">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="hero-image"
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="hero-overlay"></div>
            </div>
          ))}
        </Carousel>
        
        <div className="about-hero-content container mx-auto px-4 text-center">
          <h1 className="hero-title">About Literacy Tree School</h1>
          <p className="hero-subtitle">
            Nurturing young minds since 2010 with a commitment to academic excellence and character development.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="story-section py-16">
        <div className="container mx-auto px-4">
          <div className="story-content">
            <div className="story-text">
              <h2 className="section-title">
                <FaSchool className="title-icon" /> Our Story
              </h2>
              <p className="story-paragraph">
                Founded in 2010, Literacy Tree School began as a small educational initiative with just 30 students. 
                Today, we proudly serve over 500 students from diverse backgrounds.
              </p>
              <p className="story-paragraph">
                Our name "Literacy Tree" symbolizes our belief that education is the root of all growth and development, 
                with each branch representing different aspects of learning that help children reach their full potential.
              </p>
              
              {/* History Timeline Carousel */}
              <div className="history-carousel mt-8">
                <h3 className="carousel-title">Our Journey Through Time</h3>
                <Carousel 
                  showThumbs={false} 
                  showStatus={false} 
                  infiniteLoop 
                  autoPlay 
                  interval={6000}
                  className="timeline-carousel"
                >
                  {historyImages.map((image, index) => (
                    <div key={index} className="history-slide">
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="history-image"
                      />
                      <p className="history-caption">{image.alt}</p>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
            
            <div className="story-image-container">
              <img 
                src="/founder-story.jpg" 
                alt="Our founder with first students" 
                className="story-image"
              />
              <div className="image-caption">
                Our founder with the first class of students, 2010
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Facts Section */}
      <section className="facts-section py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center mb-12">Key Facts About Our School</h2>
          
          <div className="facts-grid">
            <div className="fact-card">
              <div className="fact-icon-container">
                <FaChalkboardTeacher className="fact-icon" />
              </div>
              <h3 className="fact-title">Our Faculty</h3>
              <p className="fact-description">
                30+ certified teachers with an average of 10 years experience. Our student-teacher ratio is 15:1.
              </p>
              <div className="fact-highlight">
                <span className="highlight-number">15:1</span>
                <span className="highlight-text">Student-Teacher Ratio</span>
              </div>
            </div>
            
            <div className="fact-card">
              <div className="fact-icon-container">
                <FaHistory className="fact-icon" />
              </div>
              <h3 className="fact-title">Our History</h3>
              <p className="fact-description">
                Established in 2010, we've grown from a single classroom to a full K-12 institution serving Lusaka.
              </p>
              <div className="fact-highlight">
                <span className="highlight-number">13+</span>
                <span className="highlight-text">Years of Excellence</span>
              </div>
            </div>
            
            <div className="fact-card">
              <div className="fact-icon-container">
                <FaAward className="fact-icon" />
              </div>
              <h3 className="fact-title">Accreditation</h3>
              <p className="fact-description">
                Fully accredited by the Zambian Ministry of Education with distinction in STEM programs.
              </p>
              <div className="fact-highlight">
                <span className="highlight-number">100%</span>
                <span className="highlight-text">Pass Rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Values Section */}
      <section className="mission-section py-16">
        <div className="container mx-auto px-4">
          <div className="mission-content">
            <div className="mission-statement">
              <h2 className="section-title">Our Mission</h2>
              <blockquote className="mission-quote">
                "To provide a nurturing environment that fosters academic excellence, critical thinking, and moral character, 
                preparing students to become responsible global citizens."
              </blockquote>
              <div className="founder-signature">
                <img src="/signature.png" alt="Founder's Signature" />
                <p>Edith Bwalya Kasandwe, Founder</p>
              </div>
            </div>
            
            <div className="values-container">
              <h3 className="values-title">Our Core Values</h3>
              <div className="values-grid">
                {[
                  { icon: <FaSeedling />, title: "Growth", description: "Continuous personal and academic development" },
                  { icon: <FaHandsHelping />, title: "Integrity", description: "Honesty and ethical behavior in all we do" },
                  { icon: <FaSchool />, title: "Respect", description: "For ourselves, others, and our environment" },
                  { icon: <FaLightbulb />, title: "Innovation", description: "Creative thinking and problem solving" }
                ].map((value, index) => (
                  <div key={index} className="value-card">
                    <div className="value-icon">{value.icon}</div>
                    <h4 className="value-name">{value.title}</h4>
                    <p className="value-description">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title">Join Our Growing Community</h2>
          <p className="community-subtitle">
            Become part of a school that values each student's unique potential and prepares them for success in life.
          </p>
          <div className="community-buttons">
            <a href="/admission" className="btn btn-light">
              Apply Now
            </a>
            <a href="/contact" className="btn btn-outline-light">
              Schedule a Tour
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;