import { Link } from 'react-router-dom';
import { FaArrowRight, FaGraduationCap, FaBookOpen, FaUsers, FaChartLine } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/Homepage.css';

const HomePage = () => {
  const carouselImages = [
    { src: "/school-building.jpg", alt: "School campus with modern facilities" },
    { src: "/classroom.jpg", alt: "Students engaged in classroom learning" },
    { src: "/pre-school.jpg", alt: "Children playing in school playground" },
    { src: "/graduation.jpg", alt: "Graduation ceremony at our school" }
  ];

  return (
    <div className="homepage">
      {/* Hero Section with Carousel */}
      <section className="hero-section relative">
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
              <div className="carousel-overlay"></div>
            </div>
          ))}
        </Carousel>

        <div className="home-hero-content container mx-auto px-4 text-center relative z-10">
          <h1 className="hero-title">Welcome to Literacy Tree School</h1>
          <p className="hero-subtitle">
            Nurturing young minds for a brighter future through quality education and holistic development.
          </p>
          <div className="hero-buttons">
            <Link
              to="/admission"
              className="btn btn-primary"
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
      <section className="stats-section">
        <div className="container mx-auto px-4">
          <div className="stats-grid">
            <div className="stat-card">
              <FaGraduationCap className="stat-icon" />
              <h3 className="stat-number">15+</h3>
              <p className="stat-label">Years Experience</p>
            </div>
            <div className="stat-card">
              <FaBookOpen className="stat-icon" />
              <h3 className="stat-number">8</h3>
              <p className="stat-label">Academic Programs</p>
            </div>
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <h3 className="stat-number">200+</h3>
              <p className="stat-label">Students Enrolled</p>
            </div>
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <h3 className="stat-number">100%</h3>
              <p className="stat-label">University Placement</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container mx-auto px-4">
          <div className="about-content">
            <div className="about-media">
              <img
                src="/school-building.jpg"
                alt="Literacy Tree School Campus"
                className="about-image"
              />
            </div>
            <div className="about-text">
              <h2 className="section-title">About Our School</h2>
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
        </div>
      </section>

      {/* Programs Highlights */}
      <section className="programs-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Our Academic Programs</h2>
          <div className="programs-grid">
            {[
              {
                title: "Nessary Section",
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
                </div>
                <div className="program-content">
                  <span className="program-icon">{program.icon}</span>
                  <h3 className="program-title">{program.title}</h3>
                  <p className="program-description">{program.description}</p>
                  <Link
                    to="/programs"
                    className="btn btn-outline program-btn"
                    aria-label={`View details about ${program.title}`}
                  >
                    View details <FaArrowRight className="btn-icon" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="testimonials-section">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">What Parents Say</h2>
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={6000}
            className="testimonials-carousel"
          >
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
              <div key={index} className="testimonial-slide">
                <blockquote className="testimonial-quote">
                  "{testimonial.quote}"
                </blockquote>
                <div className="testimonial-author">
                  <p className="author-name">{testimonial.author}</p>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container mx-auto px-4 text-center">
          <h2 className="section-title">Ready to Join Our Community?</h2>
          <p className="cta-subtitle">
            Applications for the 2025-2026 academic year are now open. Limited spaces available.
          </p>
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