import { FaQuestionCircle, FaUserGraduate, FaMoneyBillWave, FaBus } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/FAQPage.css';

const FAQPage = () => {
  const faqs = [
    {
      question: "What are the admission requirements?",
      answer: "We require a completed application form, previous school records, and an assessment for grade placement. For kindergarten, we conduct developmental screenings.",
      icon: <FaUserGraduate className="text-accent text-xl" />
    },
    {
      question: "What is the tuition fee structure?",
      answer: "Tuition varies by grade level. We offer flexible payment plans and sibling discounts. Please contact our admissions office for detailed fee information.",
      icon: <FaMoneyBillWave className="text-accent text-xl" />
    },
    {
      question: "Do you provide transportation?",
      answer: "Yes, we have a fleet of school buses serving major routes in Lusaka. Transportation fees are separate from tuition.",
      icon: <FaBus className="text-accent text-xl" />
    },
    {
      question: "What are the school hours?",
      answer: "Regular school hours are from 7:30 AM to 2:30 PM, with after-school programs available until 4:30 PM.",
      icon: <FaQuestionCircle className="text-accent text-xl" />
    },
    {
      question: "Do you offer scholarships?",
      answer: "We have a limited number of merit-based scholarships available for exceptional students. Applications are due by March 1st each year.",
      icon: <FaQuestionCircle className="text-accent text-xl" />
    },
    {
      question: "What COVID-19 safety measures are in place?",
      answer: "We follow all Ministry of Health guidelines including regular sanitization, mask protocols, and social distancing measures in classrooms.",
      icon: <FaQuestionCircle className="text-accent text-xl" />
    }
  ];

  const heroImages = [
    '/school-building.jpg',
    '/classroom.jpg',
    '/classroom-1.jpg',
    '/library.jpeg'
  ];

  const testimonialImages = [
    '/parent-1.jpg',
    '/_MG_3665.jpg',
    '/_MG_4091.jpg'
  ];

  return (
    <div className="faq-page-container">
      {/* Hero Section with Sliding Images */}
      <section className="hero-slider">
        <Carousel 
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          stopOnHover={false}
          transitionTime={800}
        >
          {heroImages.map((image, index) => (
            <div key={index} className="hero-slide">
              <img src={image} alt={`School view ${index + 1}`} />
              <div className="hero-overlay">
                <div className="hero-content">
                  <h1>Admission FAQs</h1>
                  <p>Answers to common questions about joining the Literacy Tree School community</p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* FAQ Content */}
      <div className="faq-content">
        <div className="container">
          <div className="faq-grid">
            {faqs.map((item, index) => (
              <div key={index} className="faq-card">
                <div className="faq-icon">{item.icon}</div>
                <div className="faq-text">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial Slider */}
          <div className="testimonial-slider">
            <h2>What Parents Say</h2>
            <Carousel
              showArrows={true}
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              autoPlay
              interval={6000}
            >
              {testimonialImages.map((image, index) => (
                <div key={index} className="testimonial-slide">
                  <img src={image} alt={`Testimonial ${index + 1}`} />
                  <div className="testimonial-content">
                    <p>"Literacy Tree School provided excellent support during the admission process."</p>
                    <span>- Happy Parent</span>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <div className="cta-content">
              <h2>Still have questions?</h2>
              <p>Our admissions team is happy to help with any additional questions you may have.</p>
              <a href="/contact" className="cta-button">
                Contact Admissions
              </a>
            </div>
            <div className="cta-image">
              <img src="/_MG_4091.jpg" alt="Admissions Team" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;