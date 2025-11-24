import {
    FaBook, FaCalculator, FaMusic, FaRunning, FaChild, FaLanguage, FaRobot,
    FaGraduationCap, FaShieldAlt, FaHeart, FaUsers, FaClipboardCheck, FaBus,
    FaUserMd, FaUserClock, FaCalendarAlt, FaChartLine, FaAppleAlt,
    FaChalkboardTeacher, FaBookOpen, FaTag, FaExclamationTriangle,
    FaSignOutAlt, FaPhone, FaPalette, FaBirthdayCake, FaHandshake,
    FaRocket, FaComments, FaBrain, FaSeedling,
    FaPray, FaSmile
} from 'react-icons/fa';
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
            icon: <FaChild className="pathway-icon" />,
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
            icon: <FaBook className="pathway-icon" />,
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
            icon: <FaCalculator className="pathway-icon" />,
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
            icon: <FaMusic className="pathway-icon" />,
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
            icon: <FaRunning className="pathway-icon" />,
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
            icon: <FaRocket className="enrichment-club-icon" />,
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
            icon: <FaComments className="enrichment-club-icon" />,
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
            icon: <FaSeedling className="enrichment-club-icon" />,
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
            icon: <FaMusic className="enrichment-club-icon" />,
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
            icon: <FaBookOpen className="support-item-icon" />,
            description: "Focused reading programs to improve literacy skills"
        },
        {
            title: "Test Preparation",
            icon: <FaChartLine className="support-item-icon" />,
            description: "Targeted support to improve test scores"
        },
        {
            title: "Homework Help",
            icon: <FaClipboardCheck className="support-item-icon" />,
            description: "After-school assistance with homework"
        },
        {
            title: "Individual Tutoring",
            icon: <FaUsers className="support-item-icon" />,
            description: "One-on-one support for personalized learning"
        }
    ];

    const extraCurricular = [
        {
            title: "Ball Games",
            icon: <FaRunning className="co-curricular-icon" />,
            description: "Team sports and individual athletic activities"
        },
        {
            title: "Computer Skills",
            icon: <FaRobot className="co-curricular-icon" />,
            description: "Digital literacy and basic programming"
        },
        {
            title: "Swimming",
            icon: <FaUserMd className="co-curricular-icon" />,
            description: "Water safety and swimming techniques"
        },
        {
            title: "Educational Trips",
            icon: <FaBus className="co-curricular-icon" />,
            description: "Field trips to enhance learning"
        },
        {
            title: "Creative Arts",
            icon: <FaPalette className="co-curricular-icon" />,
            description: "Visual arts, drama, and creative expression"
        }
    ];

    const philosophyItems = [
        {
            title: "Communicating",
            icon: <FaComments className="philosophy-item-icon" />,
            description: "Developing language and expression skills"
        },
        {
            title: "Creating",
            icon: <FaPalette className="philosophy-item-icon" />,
            description: "Fostering imagination and innovation"
        },
        {
            title: "Socializing",
            icon: <FaUsers className="philosophy-item-icon" />,
            description: "Building relationships and community"
        },
        {
            title: "Physical & Active",
            icon: <FaRunning className="philosophy-item-icon" />,
            description: "Promoting health and movement"
        },
        {
            title: "Thinking & Exploring",
            icon: <FaBrain className="philosophy-item-icon" />,
            description: "Encouraging curiosity and problem-solving"
        },
        {
            title: "Emotional",
            icon: <FaHeart className="philosophy-item-icon" />,
            description: "Nurturing feelings and self-awareness"
        },
        {
            title: "Spiritual & Moral",
            icon: <FaPray className="philosophy-item-icon" />,
            description: "Developing values and character"
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

                <div className="hero-overlay"></div>

                {/* NEW: Blurred Background Container */}
                <div className="hero-blur-container">
                    <div className="program-hero-content">
                        <h1 className="program-hero-title">Our Academic Programs</h1>
                        <p className="hero-subtitle">
                            Comprehensive educational pathways designed to nurture each child's potential up to Grade 7.
                        </p>
                    </div>
                </div>
            </section>

            {/* School Brief */}
            <section className="school-brief">
                <div className="container">
                    <div className="brief-content">
                        <h2 className="brief-title">About Literacy Tree School</h2>
                        <p className="brief-description">
                            Privately run by Edith B Kasandwe for over 10 years, Pickey Ponkey – Literacy Tree School provides
                            quality childcare, early and primary education at affordable fees. We are committed to quality
                            of education received by our individual learners, valuing both high and low achieving learners.
                        </p>
                    </div>
                </div>
            </section>

            {/* Teaching Philosophy Section */}
            <section className="teaching-philosophy-section">
                <div className="container">
                    <h2 className="program-section-title">Our Teaching Philosophy</h2>
                    <div className="philosophy-content-wrapper">
                        <p className="philosophy-description">
                            Our curriculum is designed around understanding that children are:
                        </p>
                        <div className="philosophy-items-grid">
                            {philosophyItems.map((item, index) => (
                                <div key={index} className="philosophy-item-card">
                                    {item.icon}
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Academic Pathways Section */}
            <section className="academic-pathways-section">
                <div className="container">
                    <h2 className="program-section-title">Our Academic Pathways</h2>
                    <div className="pathways-grid">
                        {programs.map((program, index) => (
                            <div key={index} className="pathway-card">
                                <div className="pathway-card-image">
                                    <img src={program.image} alt={program.title} loading="lazy" />
                                </div>
                                <div className="pathway-card-content">
                                    <div className="pathway-card-header">
                                        <div className="pathway-icon-container">
                                            {program.icon}
                                        </div>
                                        <div>
                                            <h3 className="pathway-title">{program.title}</h3>
                                            <p className="pathway-grades">{program.grades}</p>
                                        </div>
                                    </div>
                                    <p className="pathway-description">{program.description}</p>
                                    <div className="pathway-details">
                                        <div className="pathway-features">
                                            <h4>Key Features:</h4>
                                            <ul>
                                                {program.details.features.map((feature, i) => (
                                                    <li key={i}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pathway-benefits">
                                            <h4>Benefits:</h4>
                                            <p>{program.details.benefits}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enrichment & Clubs Section */}
            <section className="enrichment-clubs-section">
                <div className="container">
                    <h2 className="program-section-title">Enrichment & Clubs</h2>
                    <div className="enrichment-clubs-grid">
                        {specialPrograms.map((program, index) => (
                            <div key={index} className="enrichment-club-card">
                                <div className="enrichment-club-icon-wrapper">
                                    {program.icon}
                                </div>
                                <h3 className="enrichment-club-title">{program.title}</h3>
                                <p className="enrichment-club-description">{program.description}</p>
                                <ul className="enrichment-club-features">
                                    {program.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Academic Support Section */}
            <section className="academic-support-section">
                <div className="container">
                    <h2 className="program-section-title">Academic Support</h2>
                    <div className="support-cards-grid">
                        {academicSupport.map((support, index) => (
                            <div key={index} className="support-item-card">
                                <div className="support-icon-wrapper">{support.icon}</div>
                                <h3 className="support-item-title">{support.title}</h3>
                                <p className="support-item-description">{support.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Co-Curricular Activities Section */}
            <section className="co-curricular-section">
                <div className="container">
                    <h2 className="program-section-title">Co-Curricular Activities</h2>
                    <div className="co-curricular-grid">
                        {extraCurricular.map((activity, index) => (
                            <div key={index} className="co-curricular-card">
                                <div className="co-curricular-icon-wrapper">{activity.icon}</div>
                                <h3 className="co-curricular-title">{activity.title}</h3>
                                <p className="co-curricular-description">{activity.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Assessment Approach */}
            <section className="assessment-approach">
                <div className="container">
                    <h2 className="program-section-title">Our Assessment Approach</h2>
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

            {/* School Policies & Values Section */}
            <section className="school-policies-section">
                <div className="container">
                    <h2 className="program-section-title">School Policies & Values</h2>
                    <div className="policies-wrapper">
                        <div className="policy-card">
                            <h3 className="policy-card-title">Zero Tolerance on Bullying</h3>
                            <p className="policy-card-description">
                                We do not tolerate bullying or discrimination in any form. Our policy prevents bullying,
                                stops it if it occurs, and deals with incidents appropriately.
                            </p>
                        </div>
                        <div className="policy-card">
                            <h3 className="policy-card-title">Child Rights</h3>
                            <p className="policy-card-description">
                                Every child has the right to feel safe, learn without fear, belong, ask for help,
                                solve problems constructively, and be treated with respect.
                            </p>
                        </div>
                        <div className="policy-card">
                            <h3 className="policy-card-title">Discipline Approach</h3>
                            <p className="policy-card-description">
                                We maintain firm discipline while discouraging fighting and bad language.
                                Our approach focuses on helping children understand right from wrong through discussion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Annual Events & Traditions Section */}
            <section className="annual-events-section">
                <div className="container">
                    <h2 className="program-section-title">Annual Events & Traditions</h2>
                    <div className="events-timeline-wrapper">
                        <div className="timeline-event-card">
                            <div className="timeline-event-date">December</div>
                            <div className="timeline-event-content">
                                <h3>Graduation Ceremony</h3>
                                <p>Celebrating completion of Pre-school and Grade 7 with gowns, hats, and certificates</p>
                            </div>
                        </div>
                        <div className="timeline-event-card">
                            <div className="timeline-event-date">December</div>
                            <div className="timeline-event-content">
                                <h3>School Concert</h3>
                                <p>Annual performance showcasing student talents with all family members invited</p>
                            </div>
                        </div>
                        <div className="timeline-event-card">
                            <div className="timeline-event-date">Biennial</div>
                            <div className="timeline-event-content">
                                <h3>Educational Field Trips</h3>
                                <p>Learning experiences outside the classroom to broaden horizons</p>
                            </div>
                        </div>
                        <div className="timeline-event-card">
                            <div className="timeline-event-date">Ongoing</div>
                            <div className="timeline-event-content">
                                <h3>Parent Interactive Days</h3>
                                <p>Opportunities for parents to engage with the school community</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="programs-cta">
                <div className="container">
                    <h2 className="cta-title">Ready to Enroll Your Child?</h2>
                    <p className="cta-subtitle">
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