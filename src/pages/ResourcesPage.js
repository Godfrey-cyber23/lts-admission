import { Link } from 'react-router-dom';
import { FaDownload, FaExternalLinkAlt, FaVideo, FaBook, FaUserFriends, FaChalkboardTeacher, FaFilePdf, FaFileWord, FaArrowRight } from 'react-icons/fa';
import '../styles/Resources.css';

const ResourcesPage = () => {
    // Child-friendly resource categories
    const resourceCategories = [
        {
            title: "Reading Materials",
            description: "Storybooks, phonics guides, and reading worksheets for all grades",
            icon: <FaBook className="resource-icon" />,
            color: "bg-blue-100 text-blue-800"
        },
        {
            title: "Learning Videos",
            description: "Fun educational videos and animated lessons",
            icon: <FaVideo className="resource-icon" />,
            color: "bg-purple-100 text-purple-800"
        },
        {
            title: "Parent Guides",
            description: "How to support your child's reading journey at home",
            icon: <FaUserFriends className="resource-icon" />,
            color: "bg-green-100 text-green-800"
        },
        {
            title: "Teacher Tools",
            description: "Lesson plans and classroom activities",
            icon: <FaChalkboardTeacher className="resource-icon" />,
            color: "bg-yellow-100 text-yellow-800"
        }
    ];

    // Primary school focused resources
    const featuredResources = [
        {
            title: "2024-2025 School Calendar",
            type: "PDF",
            icon: <FaFilePdf className="file-icon" />,
            url: "/downloads/academic-calendar-2024.pdf",
            size: "2.4 MB"
        },
        {
            title: "Recommended Reading List",
            type: "DOCX",
            icon: <FaFileWord className="file-icon" />,
            url: "/downloads/reading-list.docx",
            size: "1.1 MB",
            grades: "Grades 1-7"
        },
        {
            title: "Fun Literacy Activities",
            type: "PDF",
            icon: <FaFilePdf className="file-icon" />,
            url: "/downloads/literacy-activities.pdf",
            size: "3.7 MB",
            grades: "For Home Learning"
        },
        {
            title: "2024-2025 School Calendar",
            type: "PDF",
            icon: <FaFilePdf className="file-icon" />,
            url: "/downloads/academic-calendar-2024.pdf",
            size: "2.4 MB"
        },
        {
            title: "Recommended Reading List",
            type: "DOCX",
            icon: <FaFileWord className="file-icon" />,
            url: "/downloads/reading-list.docx",
            size: "1.1 MB",
            grades: "Grades 1-7"
        },
        {
            title: "Fun Literacy Activities",
            type: "PDF",
            icon: <FaFilePdf className="file-icon" />,
            url: "/downloads/literacy-activities.pdf",
            size: "3.7 MB",
            grades: "For Home Learning"
        }
    ];

    // Self-hosted video resources
    const videoResources = [
        {
            title: "Phonics Fun Series",
            description: "Learn letter sounds with our friendly tree characters",
            videoUrl: "/videos/phonics-fun.mp4",
            thumbnail: "/images/phonics-thumbnail.jpeg",
            grades: "Grades 1-3"
        },
        {
            title: "Story Time with Teachers",
            description: "Our teachers read favorite storybooks aloud",
            videoUrl: "/videos/storytime.mp4",
            thumbnail: "/images/storytime-thumbnail.jpg",
            grades: "All Grades"
        },
        {
            title: "Creative Writing Tips",
            description: "Learn to write your own stories step by step",
            videoUrl: "/videos/creative-writing.mp4",
            thumbnail: "/images/writing-thumbnail.webp",
            grades: "Grades 4-7"
        }
    ];

    // School-specific external links
    const externalLinks = [
        {
            title: "Literacy Tree Parent Portal",
            url: "https://parents.literacytree.edu.zm",
            description: "Access your child's progress and school updates"
        },
        {
            title: "Storybooks Zambia",
            url: "https://www.storybookszambia.org",
            description: "Free local storybooks for young readers"
        },
        {
            title: "Ministry of Education (Zambia)",
            url: "https://www.education.gov.zm",
            description: "Primary school curriculum information"
        }
    ];

    return (
        <div className="resources-page">
            {/* Hero Section */}
            <section className="resources-hero">
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to Our Learning Tree!</h1>
                    <p className="hero-subtitle">
                        Discover fun reading materials, videos, and activities for Grades 1-7
                    </p>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Find stories, worksheets, or videos..."
                            className="search-input"
                        />
                        <button className="search-button">
                            <svg className="search-icon" viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Category Cards */}
            <section className="resource-categories">
                <div className="section-header">
                    <h2>What Would You Like to Explore?</h2>
                    <div className="section-divider"></div>
                </div>
                <div className="category-grid">
                    {resourceCategories.map((category, index) => (
                        <div
                            key={index}
                            className={`category-card ${category.color.replace('bg-', '').replace('text-', '')}`}
                        >
                            <div className="category-icon">{category.icon}</div>
                            <h3>{category.title}</h3>
                            <p>{category.description}</p>
                            <Link
                                to={`/resources/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                                className="category-link"
                            >
                                Let's Go! <FaArrowRight />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Resources */}
            <section className="featured-resources">
                <div className="section-header">
                    <h2>Popular Downloads</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">Great materials for school and home</p>
                </div>
                <div className="resource-grid">
                    {featuredResources.map((resource, index) => (
                        <div key={index} className="resource-card">
                            <div className="file-type">{resource.icon}</div>
                            <div className="resource-details">
                                <h3>{resource.title}</h3>
                                {resource.grades && <span className="grade-badge">{resource.grades}</span>}
                                <span className="file-meta">{resource.type} • {resource.size}</span>
                            </div>
                            <a
                                href={resource.url}
                                download
                                className="download-button"
                            >
                                <FaDownload /> Get It
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Video Gallery - Grid Layout */}
            <section className="video-gallery">
                <div className="section-header">
                    <h2>Video Learning Resources</h2>
                    <div className="section-divider"></div>
                </div>

                <div className="video-grid">
                    {videoResources.map((video, index) => (
                        <div key={index} className="video-card">
                            <div className="video-container">
                                <video
                                    controls
                                    width="100%"
                                    poster={video.thumbnail}
                                >
                                    <source src={video.videoUrl} type="video/mp4" />
                                    Your browser doesn't support HTML5 video.
                                </video>
                            </div>
                            <div className="video-info">
                                <h3>{video.title}</h3>
                                <p>{video.description}</p>
                                {video.grades && <span className="grade-badge">{video.grades}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Interactive Tools Section */}
            <section className="interactive-tools">
                <div className="section-header">
                    <h2>Interactive Learning Tools</h2>
                    <div className="section-divider"></div>
                </div>
                <div className="tools-grid">
                    <div className="tool-card math-generator">
                        <div className="tool-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                            </svg>
                        </div>
                        <h3>Math Practice Generator</h3>
                        <div className="tool-controls">
                            <select className="tool-select">
                                <option>Select Grade Level</option>
                                <option>Grade 1-2</option>
                                <option>Grade 3-4</option>
                                <option>Grade 5-7</option>
                            </select>
                            <select className="tool-select">
                                <option>Select Topic</option>
                                <option>Addition/Subtraction</option>
                                <option>Multiplication/Division</option>
                                <option>Fractions</option>
                            </select>
                            <button className="generate-button">
                                Generate Worksheet
                            </button>
                        </div>
                    </div>

                    <div className="tool-card flashcards">
                        <div className="tool-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
                            </svg>
                        </div>
                        <h3>Vocabulary Flashcards</h3>
                        <div className="flashcard-container">
                            <div className="flashcard">
                                <div className="flashcard-content">
                                    Click "Start" to begin practicing
                                </div>
                            </div>
                        </div>
                        <div className="flashcard-controls">
                            <button className="control-button prev">
                                Previous
                            </button>
                            <button className="control-button start">
                                Start
                            </button>
                            <button className="control-button next">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Helpful Links Section */}
            <section className="external-resources">
                <div className="section-header">
                    <h2>More Helpful Links</h2>
                    <div className="section-divider"></div>
                </div>
                <div className="external-grid">
                    {externalLinks.map((link, index) => (
                        <div key={index} className="external-card">
                            <h3>{link.title}</h3>
                            <p>{link.description}</p>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="external-link"
                            >
                                Visit <FaExternalLinkAlt />
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            {/* Resource Request Form */}
            <section className="resource-request">
                <div className="request-container">
                    <div className="request-header">
                        <h2>Need Help Finding Something?</h2>
                        <p>Ask us for specific learning materials!</p>
                    </div>
                    <form className="request-form">
                        <div className="form-group">
                            <label>Your Name</label>
                            <input type="text" required />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" required />
                        </div>
                        <div className="form-group">
                            <label>What are you looking for?</label>
                            <textarea required></textarea>
                        </div>
                        <button type="submit" className="submit-button">
                            Send Request
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ResourcesPage;