import React from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaUserGraduate, FaMoneyBillWave, FaBus, FaClock, FaShieldAlt, FaChalkboardTeacher, FaRunning, FaMusic, FaBook, FaGraduationCap, FaBirthdayCake, FaHandshake } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/FAQPage.css';

const FAQPage = () => {
  // Static content data based on provided school information
  const pageContent = {
    hero: {
      title: "Admission FAQs",
      subtitle: "Answers to common questions about joining Pickey Ponkey - Literacy Tree School community",
      images: [
        { src: "/classroom-1.jpg", alt: "Students engaged in classroom activities" },
        { src: "/library.jpeg", alt: "School library with students reading" },
        { src: "/resources-bg.webp", alt: "Students conducting science experiments" },
        { src: "/graduation-ceremony.jpg", alt: "Students at graduation ceremony" }
      ]
    },
    faqs: {
      items: [
        {
          question: "What are the admission requirements?",
          answer: "We require a completed application form and an assessment for grade placement. For kindergarten, we conduct developmental screenings. Assessment is based on ability rather than age - we evaluate each child's capacity to write, identify letters and numbers, and demonstrate understanding.",
          icon: "user-graduate"
        },
        {
          question: "What is the tuition fee structure?",
          answer: "At Literacy Tree School, we provide quality education at affordable fees. Fees are to be paid on or before the 1st day of every term, or during the first week of the school term. Late pickups after 15:00hrs for primary will be charged K50.00 for every 30 minutes.",
          icon: "money-bill"
        },
        {
          question: "What are the school hours?",
          answer: "School hours are from 07:00hrs - 12:00hrs for nursery and 15:00hrs for primary. Please avoid honking when dropping off children as it distracts the learning atmosphere.",
          icon: "clock"
        },
        {
          question: "What is your approach to discipline?",
          answer: "We maintain firm discipline while discouraging fighting and bad language. Our policy is to talk through problems and help children understand right from wrong. We have zero tolerance for bullying or discrimination in any form.",
          icon: "shield"
        },
        {
          question: "What extra-curricular activities do you offer?",
          answer: "We offer a range of activities including ball games, floor games, swimming, educational trips, music, and computer classes. We also have special clubs including Jets Club, Debate Club, Agriculture Club, and Music Clubs.",
          icon: "running"
        },
        {
          question: "How do you assess student progress?",
          answer: "Assessment is not based on age but on ability to write, identify letters and numbers, and formulate sounds. For example, if a 6-year-old cannot write or read, they may remain in a lower class, while a 5-year-old with excellent performance can move to a higher level.",
          icon: "chalkboard"
        }
      ]
    },
    cta: {
      title: "Still have questions?",
      subtitle: "Our team led by Edith B Kasandwe is happy to help with any additional questions you may have about joining our school family.",
      buttonText: "Contact Us",
      buttonLink: "/contact",
      image: "/_MG_4091.jpg",
      imageAlt: "Literacy Tree School Staff"
    }
  };

  // Safe data access helper functions
  const safeMap = (array, callback) => {
    if (!array || !Array.isArray(array)) return [];
    return array.map(callback);
  };

  const safeGet = (obj, path, defaultValue = '') => {
    if (!obj) return defaultValue;
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result === null || result === undefined) return defaultValue;
      result = result[key];
    }
    return result === undefined ? defaultValue : result;
  };

  // Function to get the appropriate icon component
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'user-graduate': return <FaUserGraduate className="text-accent text-xl" />;
      case 'money-bill': return <FaMoneyBillWave className="text-accent text-xl" />;
      case 'bus': return <FaBus className="text-accent text-xl" />;
      case 'clock': return <FaClock className="text-accent text-xl" />;
      case 'shield': return <FaShieldAlt className="text-accent text-xl" />;
      case 'chalkboard': return <FaChalkboardTeacher className="text-accent text-xl" />;
      case 'running': return <FaRunning className="text-accent text-xl" />;
      case 'question':
      default: return <FaQuestionCircle className="text-accent text-xl" />;
    }
  };

  // Use safe data access methods
  const heroImages = safeGet(pageContent, 'hero.images', []);
  const faqItems = safeGet(pageContent, 'faqs.items', []);
  const testimonialItems = safeGet(pageContent, 'testimonials.items', []);

  return (
    <div className="faq-page-container">
      {/* Hero Section with Sliding Images */}
      <section className="hero-slider" style={{ position: 'relative', height: '70vh', minHeight: '500px', overflow: 'hidden', zIndex: 1 }}>
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          stopOnHover={false}
          transitionTime={800}
          style={{ height: '100%' }}
        >
          {safeMap(heroImages, (image, index) => (
            <div key={index} className="hero-slide" style={{ position: 'relative', height: '100%' }}>
              <img
                src={safeGet(image, 'src', '')}
                alt={safeGet(image, 'alt', 'School image')}
                onError={(e) => {
                  console.warn(`Hero image failed to load: ${safeGet(image, 'src')}`);
                  e.target.src = '/placeholder.webp';
                }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 1 }}
              />
              {/* Hero content positioned directly on image - NO OVERLAY */}
              <div className="hero-content" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '800px',
                width: '90%',
                textAlign: 'center',
                zIndex: 10,
                padding: '2rem',
                background: 'rgba(44, 94, 58, 0.4)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)'
              }}>
                <h1 style={{
                  fontSize: '3rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '1.5rem',
                  fontFamily: "'Montserrat', sans-serif",
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
                  opacity: 1,
                  display: 'block',
                  lineHeight: '1.2'
                }}>
                  {safeGet(pageContent, 'hero.title', 'Admission FAQs')}
                </h1>
                <p style={{
                  fontSize: '1.5rem',
                  marginBottom: '2rem',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
                  color: '#ffffff',
                  opacity: 1,
                  display: 'block',
                  lineHeight: '1.4',
                  fontWeight: 500
                }}>
                  {safeGet(pageContent, 'hero.subtitle', 'Answers to common questions')}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* School Introduction */}
      <section className="school-intro">
        <div className="container">
          <div className="intro-content">
            <h2>About Pickey Ponkey - Literacy Tree School</h2>
            <p>
              Privately run for over 10 years, Literacy Tree School provides the highest quality
              of childcare, early and primary education at affordable fees. We value both high and low achieving
              learners and provide multi-ability learning opportunities equitably in our whole-embracing school climate.
            </p>
            <p>
              Our aim is to create an environment of excellence where each child can develop and realize their
              full potential in a safe and nurturing environment.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="faq-content">
        <div className="container">
          <div className="faq-grid">
            {safeMap(faqItems, (item, index) => (
              <div key={index} className="faq-card faq-card-top-icon">
                <div className="faq-icon">
                  {getIcon(safeGet(item, 'icon', 'question'))}
                </div>
                <div className="faq-text">
                  <h3>{safeGet(item, 'question', 'Question')}</h3>
                  <p>{safeGet(item, 'answer', 'Answer')}</p>
                </div>
              </div>
            ))}
          </div>


          {/* Special Events Section */}
          <div className="special-events" style={{ marginTop: '4rem' }}>
            <h2 className="testimonial-heading">Annual School Events</h2>
            <div className="events-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              <div className="event-card" style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <FaGraduationCap style={{ fontSize: '2rem', color: '#2C5E3A' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#2C5E3A' }}>Graduation Ceremony</h3>
                <p>Held in December for Pre-school and Grade 7 students with gowns, hats and certificates.</p>
              </div>

              <div className="event-card" style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <FaMusic style={{ fontSize: '2rem', color: '#2C5E3A' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#2C5E3A' }}>School Concert</h3>
                <p>Annual celebration in December where all children participate. A special day for the entire family.</p>
              </div>

              <div className="event-card" style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <FaBus style={{ fontSize: '2rem', color: '#2C5E3A' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#2C5E3A' }}>Field Trips</h3>
                <p>Educational trips every two years to help children relate classroom learning to reality.</p>
              </div>

              <div className="event-card" style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <FaHandshake style={{ fontSize: '2rem', color: '#2C5E3A' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#2C5E3A' }}>Parent Interactive Day</h3>
                <p>Opportunities for parents to share ideas on improving the school and build community.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <div className="cta-content">
              <h2 className='testimonial-heading'>
                {safeGet(pageContent, 'cta.title', 'Still have questions?')}
              </h2>
              <p>{safeGet(pageContent, 'cta.subtitle', 'Our admissions team is happy to help')}</p>
              <Link
                to={safeGet(pageContent, 'cta.buttonLink', '/contact')}
                className="cta-button"
              >
                {safeGet(pageContent, 'cta.buttonText', 'Contact Admissions')}
              </Link>
            </div>
            <div className="cta-image">
              <img
                src={safeGet(pageContent, 'cta.image', '/_MG_4091.jpg')}
                alt={safeGet(pageContent, 'cta.imageAlt', 'Admissions Team')}
                onError={(e) => {
                  console.warn(`CTA image failed to load: ${safeGet(pageContent, 'cta.image')}`);
                  e.target.src = '/placeholder.webp';
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '0 50px 0 50px'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;