import { FaBook, FaCalculator, FaMusic, FaRunning, FaChild, FaLanguage, FaRobot, FaGraduationCap, FaShieldAlt, FaHeart, FaUsers, FaClipboardCheck, FaBus, FaUserMd, FaUserClock, FaCalendarAlt, FaChartLine, FaAppleAlt, FaChalkboardTeacher, FaBookOpen, FaTag, FaExclamationTriangle, FaSignOutAlt, FaPhone, FaPalette, FaBirthdayCake, FaHandshake, FaRocket, FaComments, FaSeedling, FaMicrophone } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/ProgramsPage.css';

const ProgramsPage = () => {
     const heroImages = [
        { src: "/classroom-1.jpg", alt: "Students engaged in classroom activities" },
        { src: "/library.jpeg", alt: "School library with students reading" },
        { src: "/resources-bg.webp", alt: "Students conducting science experiments" },
        { src: "/graduation-ceremony.jpg", alt: "Students playing sports" }
    ];

    const programs = [
        {
            title: "Early Childhood",
            icon: <FaChild className="program-icon" />,
            description: "Play-based learning for ages 3-6 focusing on literacy, numeracy, and social skills.",
            grades: "Pre-K to Kindergarten",
            image: "/early-class.jpg",
            details: {
                features: [
                    "Montessori-inspired learning centers",
                    "Phonics-based reading program",
                    "Social-emotional development focus",
                    "Half-day and full-day options"
                ],
                benefits: "Develops foundational skills through hands-on exploration and play"
            }
        },
        {
            title: "Lower Primary",
            icon: <FaBook className="program-icon" />,
            description: "Building core academic skills with emphasis on reading fluency and mathematical thinking.",
            grades: "Grades 1-3",
            image: "/pre-school.jpg",
            details: {
                features: [
                    "Literacy blocks with guided reading",
                    "Hands-on math manipulatives",
                    "Inquiry-based science",
                    "Social studies through projects"
                ],
                benefits: "Establishes strong foundational skills in all core subjects"
            }
        },
        {
            title: "Upper Primary",
            icon: <FaCalculator className="program-icon" />,
            description: "Advanced curriculum preparing students for secondary education with subject specialization.",
            grades: "Grades 4-7",
            image: "/upper-primary.jpg",
            details: {
                features: [
                    "Specialized subject teachers",
                    "Research projects",
                    "STEM integration",
                    "Leadership opportunities"
                ],
                benefits: "Prepares students for academic success in secondary school"
            }
        },
        {
            title: "Creative Arts",
            icon: <FaMusic className="program-icon" />,
            description: "Integrated arts program including music, visual arts, and drama.",
            grades: "All Grades",
            image: "/creative-arts.jpeg",
            details: {
                features: [
                    "Music appreciation and performance",
                    "Annual school production",
                    "Visual arts exhibitions",
                    "Creative writing workshops"
                ],
                benefits: "Fosters creativity and self-expression across all disciplines"
            }
        },
        {
            title: "Physical Education",
            icon: <FaRunning className="program-icon" />,
            description: "Comprehensive program promoting physical health and teamwork.",
            grades: "All Grades",
            image: "/physical-education.jpeg",
            details: {
                features: [
                    "Age-appropriate fitness activities",
                    "Inter-class competitions",
                    "Sports day events",
                    "Health education"
                ],
                benefits: "Promotes physical health, teamwork, and sportsmanship"
            }
        }
    ];

    const specialPrograms = [
        {
            title: "Jets Club",
            icon: <FaRocket className="text-3xl" />,
            description: "Our Jets Club focuses on science, technology, and innovation, encouraging students to explore STEM fields.",
            features: [
                "Science experiments and projects",
                "Technology workshops",
                "Innovation challenges",
                "STEM competitions"
            ]
        },
        {
            title: "Debate Club",
            icon: <FaComments className="text-3xl" />,
            description: "Developing critical thinking, public speaking, and argumentation skills through structured debates.",
            features: [
                "Weekly debate sessions",
                "Public speaking practice",
                "Critical thinking exercises",
                "Inter-school debate competitions"
            ]
        },
        {
            title: "Agriculture Club",
            icon: <FaSeedling className="text-3xl" />,
            description: "Hands-on learning about farming, environmental conservation, and sustainable agriculture practices.",
            features: [
                "School garden projects",
                "Environmental conservation",
                "Sustainable farming practices",
                "Agricultural science experiments"
            ]
        },
        {
            title: "Music Clubs",
            icon: <FaMusic className="text-3xl" />,
            description: "Various music clubs offering vocal training, instrument lessons, and performance opportunities.",
            features: [
                "Vocal training and choir",
                "Instrument lessons",
                "Music theory classes",
                "School band and performances"
            ]
        }
    ];

    const academicSupport = [
        {
            title: "Intensive Reading",
            icon: <FaBookOpen />,
            description: "Focused reading programs to improve literacy skills"
        },
        {
            title: "Test Preparation",
            icon: <FaChartLine />,
            description: "Targeted support to improve test scores"
        },
        {
            title: "Homework Help",
            icon: <FaClipboardCheck />,
            description: "After-school assistance with homework"
        },
        {
            title: "Individual Tutoring",
            icon: <FaUsers />,
            description: "One-on-one support for personalized learning"
        }
    ];

    const extraCurricular = [
        {
            title: "Ball Games",
            icon: <FaRunning />,
            description: "Team sports and individual athletic activities"
        },
        {
            title: "Computer Skills",
            icon: <FaRobot />,
            description: "Digital literacy and basic programming"
        },
        {
            title: "Swimming",
            icon: <FaUserMd />,
            description: "Water safety and swimming techniques"
        },
        {
            title: "Educational Trips",
            icon: <FaBus />,
            description: "Field trips to enhance learning"
        },
        {
            title: "Creative Arts",
            icon: <FaPalette />,
            description: "Visual arts, drama, and creative expression"
        }
    ];

    return (
        <div className="programs-page">
            {/* Hero Section with Image Background */}
            <section className="programs-hero">
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
                        </div>
                    ))}
                </Carousel>
                
                <div 
                    className="program-hero-content container"
                    style={{
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
                    }}
                >
                    <h1 className="program-hero-title">Our Academic Programs</h1>
                    <p className="hero-subtitle">
                        Comprehensive educational pathways designed to nurture each child's potential up to Grade 7.
                    </p>
                </div>
            </section>

            {/* School Brief */}
            <section className="school-brief py-16">
                <div className="container">
                    <div className="brief-content">
                        <h2 className="brief-title">About Literacy Tree School</h2>
                        <p className="brief-description">
                            Privately run by Edith B Kasandwe for over 10 years, Pickey Ponkey – Literacy Tree School provides 
                            quality childcare, early and primary education at affordable fees. We are committed to the quality 
                            of education received by our individual learners, valuing both high and low achieving learners.
                        </p>
                    </div>
                </div>
            </section>

            {/* Curriculum Philosophy */}
            <section className="curriculum-philosophy py-16 bg-gray-50">
                <div className="container">
                    <h2 className="program-section-title text-center mb-12">Our Curriculum Philosophy</h2>
                    <div className="philosophy-content">
                        <p className="philosophy-description">
                            Our curriculum is designed around the understanding that children are:
                        </p>
                        <div className="philosophy-grid">
                            <div className="philosophy-item">
                                <h3>Communicating</h3>
                                <p>Developing language and expression skills</p>
                            </div>
                            <div className="philosophy-item">
                                <h3>Creating</h3>
                                <p>Fostering imagination and innovation</p>
                            </div>
                            <div className="philosophy-item">
                                <h3>Socializing</h3>
                                <p>Building relationships and community</p>
                            </div>
                            <div className="philosophy-item">
                                <h3>Physical & Active</h3>
                                <p>Promoting health and movement</p>
                            </div>
                            <div className="philosophy-item">
                                <h3>Thinking & Exploring</h3>
                                <p>Encouraging curiosity and problem-solving</p>
                            </div>
                            <div className="philosophy-item">
                                <h3>Emotional</h3>
                                <p>Nurturing feelings and self-awareness</p>
                            </div>
                            <div className="philosophy-item">
                                <h3>Spiritual & Moral</h3>
                                <p>Developing values and character</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Programs */}
            <section className="main-programs py-16">
                <div className="container">
                    <h2 className="program-section-title text-center mb-12">Program Offerings</h2>
                    <div className="programs-grid">
                        {programs.map((program, index) => (
                            <div key={index} className="program-card">
                                <div className="program-image-container">
                                    <img 
                                        src={program.image} 
                                        alt={program.title} 
                                        className="program-image"
                                    />
                                    <div className="program-badge">{program.grades}</div>
                                </div>
                                <div className="program-content">
                                    <div className="program-header">
                                        <div className="program-icon-container">
                                            {program.icon}
                                        </div>
                                        <h3 className="program-title">{program.title}</h3>
                                    </div>
                                    <p className="program-description">{program.description}</p>
                                    
                                    <div className="program-details">
                                        <h4 className="details-title">Key Features:</h4>
                                        <ul className="features-list">
                                            {program.details.features.map((feature, i) => (
                                                <li key={i} className="feature-item">
                                                    <span className="feature-bullet">•</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="benefits-box">
                                            <h4 className="benefits-title">Key Benefits:</h4>
                                            <p>{program.details.benefits}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Programs */}
            <section className="special-programs py-16 bg-gray-50">
                <div className="container">
                    <h2 className="program-section-title text-center mb-12">Special Programs & Clubs</h2>
                    <div className="special-programs-grid">
                        {specialPrograms.map((program, index) => (
                            <div key={index} className="special-program-card">
                                <div className="special-program-icon">
                                    {program.icon}
                                </div>
                                <h3 className="special-program-title">{program.title}</h3>
                                <p className="special-program-description">{program.description}</p>
                                <ul className="special-program-features">
                                    {program.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academic Support */}
            <section className="academic-support py-16">
                <div className="container">
                    <h2 className="program-section-title text-center mb-12">Academic Support Programs</h2>
                    <div className="support-grid">
                        {academicSupport.map((support, index) => (
                            <div key={index} className="support-card">
                                <div className="support-icon">{support.icon}</div>
                                <h3 className="support-title">{support.title}</h3>
                                <p className="support-description">{support.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Extra-Curricular Activities */}
            <section className="extra-curricular py-16 bg-gray-50">
                <div className="container">
                    <h2 className="program-section-title text-center mb-12">Extra-Curricular Activities</h2>
                    <div className="activities-grid">
                        {extraCurricular.map((activity, index) => (
                            <div key={index} className="activity-card">
                                <div className="activity-icon">{activity.icon}</div>
                                <h3 className="activity-title">{activity.title}</h3>
                                <p className="activity-description">{activity.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Assessment Approach */}
            <section className="assessment-approach py-16">
                <div className="container">
                    <h2 className="program-section-title text-center mb-12">Our Assessment Approach</h2>
                    <div className="assessment-card">
                        <p className="assessment-description">
                            Assessment at Literacy Tree School is based on ability rather than age. We evaluate each child's 
                            capacity to write, identify letters and numbers, formulate sounds, and demonstrate understanding. 
                            This approach ensures that children progress at their own pace, with 5-year-olds who demonstrate 
                            advanced skills able to move to higher levels, while 6-year-olds needing more support receive 
                            appropriate foundational instruction.
                        </p>
                        <div className="assessment-highlights">
                            <div className="highlight-item">
                                <h4>Individual Progress</h4>
                                <p>Focus on personal development rather than age-based expectations</p>
                            </div>
                            <div className="highlight-item">
                                <h4>Skill-Based Assessment</h4>
                                <p>Evaluation based on demonstrated abilities and understanding</p>
                            </div>
                            <div className="highlight-item">
                                <h4>Flexible Placement</h4>
                                <p>Children placed according to their learning needs and capabilities</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Policies */}
            <section className="program-policies py-16 bg-gray-50">
                <div className="container">
                    <h2 className="program-section-title text-center mb-12">Program Policies</h2>
                    <div className="policies-content">
                        <div className="policy-section">
                            <h3 className="policy-title">Zero Tolerance on Bullying</h3>
                            <p className="policy-description">
                                We do not tolerate bullying or discrimination in any form. Our policy prevents bullying, 
                                stops it if it occurs, and deals with incidents appropriately.
                            </p>
                        </div>
                        <div className="policy-section">
                            <h3 className="policy-title">Child Rights</h3>
                            <p className="policy-description">
                                Every child has the right to feel safe, learn without fear, belong, ask for help, 
                                solve problems constructively, and be treated with respect.
                            </p>
                        </div>
                        <div className="policy-section">
                            <h3 className="policy-title">Discipline Approach</h3>
                            <p className="policy-description">
                                We maintain firm discipline while discouraging fighting and bad language. 
                                Our approach focuses on helping children understand right from wrong through discussion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Special Program Events */}
            <section className="program-events py-16">
                <div className="container">
                    <h2 className="program-section-title text-center mb-12">Annual Program Events</h2>
                    <div className="events-timeline">
                        <div className="event-item">
                            <div className="event-date">December</div>
                            <div className="event-content">
                                <h3>Graduation Ceremony</h3>
                                <p>Celebrating completion of Pre-school and Grade 7 with gowns, hats, and certificates</p>
                            </div>
                        </div>
                        <div className="event-item">
                            <div className="event-date">December</div>
                            <div className="event-content">
                                <h3>School Concert</h3>
                                <p>Annual performance showcasing student talents with all family members invited</p>
                            </div>
                        </div>
                        <div className="event-item">
                            <div className="event-date">Biennial</div>
                            <div className="event-content">
                                <h3>Educational Field Trips</h3>
                                <p>Learning experiences outside the classroom to broaden horizons</p>
                            </div>
                        </div>
                        <div className="event-item">
                            <div className="event-date">Ongoing</div>
                            <div className="event-content">
                                <h3>Parent Interactive Days</h3>
                                <p>Opportunities for parents to engage with the school community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="programs-cta py-16 bg-primary text-white">
                <div className="container text-center">
                    <h2 className="cta-title mb-6">Ready to Enroll Your Child?</h2>
                    <p className="cta-subtitle mb-8">
                        Limited spaces available for the 2026 academic year. Schedule a tour to learn more about our programs.
                    </p>
                    <div className="cta-buttons">
                        <a href="/admissions" className="btn btn-light">
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

export default ProgramsPage;