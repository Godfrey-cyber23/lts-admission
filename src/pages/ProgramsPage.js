import { FaBook, FaCalculator, FaMusic, FaRunning, FaChild, FaLanguage, FaRobot } from 'react-icons/fa';
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
            title: "STEM Program",
            icon: <FaRobot className="text-3xl" />,
            description: "Our innovative STEM program introduces scientific thinking and technology skills.",
            features: [
                "Coding basics from Grade 4",
                "Hands-on science experiments",
                "Math enrichment",
                "Annual science fair"
            ]
        },
        {
            title: "Language Program",
            icon: <FaLanguage className="text-3xl" />,
            description: "French language instruction with cultural immersion experiences.",
            features: [
                "Daily French lessons from Grade 1",
                "Cultural celebration days",
                "Language competitions",
                "Pen pal exchanges"
            ]
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
                            <div className="hero-overlay"></div>
                        </div>
                    ))}
                </Carousel>
                
                <div className="program-hero-content container">
                    <h1 className="hero-title">Our Academic Programs</h1>
                    <p className="hero-subtitle">
                        Comprehensive educational pathways designed to nurture each child's potential up to Grade 7.
                    </p>
                </div>
            </section>


            {/* Curriculum Approach */}
            <section className="curriculum-approach py-16">
                <div className="container">
                    <div className="approach-grid">
                        <div className="approach-text">
                            <h2 className="section-title">Our Curriculum Approach</h2>
                            <p className="approach-description">
                                At Literacy Tree School, we blend the Zambian national curriculum with international best practices
                                to create a dynamic learning experience for primary school students.
                            </p>
                            <p className="approach-description">
                                Our programs emphasize critical thinking, creativity, and real-world application of knowledge,
                                tailored specifically for young learners up to Grade 7.
                            </p>
                        </div>
                        <div className="approach-image">
                            <Carousel 
                                showThumbs={false} 
                                showStatus={false} 
                                infiniteLoop 
                                autoPlay 
                                interval={5000}
                                className="approach-carousel"
                            >
                                {[
                                    "/classroom-1.jpg",
                                    "/classroom-2.jpg",
                                    "/classroom-3.jpg"
                                ].map((image, index) => (
                                    <div key={index}>
                                        <img 
                                            src={image} 
                                            alt="Classroom activities" 
                                            className="carousel-image"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Programs */}
            <section className="main-programs py-16 bg-gray-50">
                <div className="container">
                    <h2 className="section-title text-center mb-12">Program Offerings</h2>
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
            <section className="special-programs py-16">
                <div className="container">
                    <h2 className="section-title text-center mb-12">Special Programs</h2>
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

            {/* CTA Section */}
            <section className="programs-cta py-16 bg-primary text-white">
                <div className="container text-center">
                    <h2 className="cta-title mb-6">Ready to Enroll Your Child?</h2>
                    <p className="cta-subtitle mb-8">
                        Limited spaces available for the 2025 academic year. Schedule a tour to learn more about our programs.
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