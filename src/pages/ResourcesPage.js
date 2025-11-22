import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FaDownload,
    FaExternalLinkAlt,
    FaVideo,
    FaBook,
    FaUserFriends,
    FaChalkboardTeacher,
    FaFilePdf,
    FaFileWord,
    FaArrowRight,
    FaRobot,
    FaPaperPlane,
    FaTimes,
    FaComments,
    FaGraduationCap,
    FaLightbulb,
    FaQuestionCircle,
    FaUserCircle,
    FaExclamationTriangle,
    FaCheck
} from 'react-icons/fa';
import '../styles/Resources.css';
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const ResourcesPage = () => {
    const [mathGrade, setMathGrade] = useState('');
    const [mathTopic, setMathTopic] = useState('');
    const [generatedWorksheet, setGeneratedWorksheet] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isStarted, setIsStarted] = useState(false);

    // AI Assistant states
    const [aiChatOpen, setAiChatOpen] = useState(false);
    const [aiMessages, setAiMessages] = useState([
        {
            sender: 'ai',
            text: 'Hello! I\'m your Learning Tree Assistant powered by DeepSeek AI. I can help you find resources, answer questions, or generate personalized learning materials. How can I assist you today?'
        }
    ]);
    const [aiInput, setAiInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const [apiError, setApiError] = useState('');
    const messagesEndRef = useRef(null);

    // Child-friendly resource categories
    const resourceCategories = [
        {
            title: "Reading Materials",
            description: "Storybooks, phonics guides, and reading worksheets for all grades",
            icon: <FaBook className="resource-icon" />,
            color: "bg-blue-100 text-blue-800",
            link: "/resources/reading-materials"
        },
        {
            title: "Learning Videos",
            description: "Fun educational videos and animated lessons",
            icon: <FaVideo className="resource-icon" />,
            color: "bg-purple-100 text-purple-800",
            link: "/resources/learning-videos"
        },
        {
            title: "Parent Guides",
            description: "How to support your child's reading journey at home",
            icon: <FaUserFriends className="resource-icon" />,
            color: "bg-green-100 text-green-800",
            link: "/resources/parent-guides"
        },
        {
            title: "Teacher Tools",
            description: "Lesson plans and classroom activities",
            icon: <FaChalkboardTeacher className="resource-icon" />,
            color: "bg-yellow-100 text-yellow-800",
            link: "/resources/teacher-tools"
        }
    ];

    // Primary school focused resources
    const featuredResources = [
        {
            title: "2026 School Calendar",
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
            title: "Math Practice Guide",
            type: "PDF",
            icon: <FaFilePdf className="file-icon" />,
            url: "/downloads/math-practice.pdf",
            size: "4.2 MB",
            grades: "Grades 3-7"
        },
        {
            title: "Science Experiments",
            type: "PDF",
            icon: <FaFilePdf className="file-icon" />,
            url: "/downloads/science-experiments.pdf",
            size: "5.1 MB",
            grades: "Grades 4-7"
        },
        {
            title: "Art & Craft Ideas",
            type: "PDF",
            icon: <FaFilePdf className="file-icon" />,
            url: "/downloads/art-craft.pdf",
            size: "3.3 MB",
            grades: "All Grades"
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
        },
        {
            title: "Math Made Easy",
            description: "Simple tricks to solve math problems quickly",
            videoUrl: "/videos/math-made-easy.mp4",
            thumbnail: "/images/math-thumbnail.jpg",
            grades: "Grades 3-7"
        },
        {
            title: "Science Experiments",
            description: "Fun science experiments you can do at home",
            videoUrl: "/videos/science-experiments.mp4",
            thumbnail: "/images/science-thumbnail.jpg",
            grades: "Grades 4-7"
        },
        {
            title: "Art & Craft Workshop",
            description: "Create beautiful art with simple materials",
            videoUrl: "/videos/art-craft.mp4",
            thumbnail: "/images/art-thumbnail.jpg",
            grades: "All Grades"
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
        },
        {
            title: "Digital Library Zambia",
            url: "https://www.digitallibraryzm.org",
            description: "Access thousands of free educational resources"
        }
    ];

    // Vocabulary flashcards data
    const vocabularySets = {
        "Grade 1-2": [
            { word: "Cat", definition: "A small furry animal that says 'meow'" },
            { word: "Dog", definition: "A friendly animal that says 'woof'" },
            { word: "Sun", definition: "The bright star that gives us light and warmth" },
            { word: "Book", definition: "Something we read with stories and pictures" }
        ],
        "Grade 3-4": [
            { word: "Adventure", definition: "An exciting and dangerous journey" },
            { word: "Mystery", definition: "Something that is difficult to understand or explain" },
            { word: "Courage", definition: "Being brave when facing something difficult" },
            { word: "Discover", definition: "To find something for the first time" }
        ],
        "Grade 5-7": [
            { word: "Environment", definition: "The natural world around us" },
            { word: "Conservation", definition: "Protecting and preserving nature" },
            { word: "Innovation", definition: "A new idea or method" },
            { word: "Collaboration", definition: "Working together with others" }
        ]
    };

    // DeepSeek API integration with better error handling
    const callDeepSeekAPI = async (userMessage) => {
        try {
            console.log('Calling backend AI API...');

            const response = await fetch(`${BACKEND_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: aiMessages
                        .filter(msg => msg.sender !== 'system')
                        .map(msg => ({
                            sender: msg.sender,
                            text: msg.text
                        }))
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API request failed with status ${response.status}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Invalid response from server');
            }

            console.log('Backend API response received successfully');
            return data.response;
        } catch (error) {
            console.error('Error calling backend AI API:', error);

            // More specific error messages
            if (error.message.includes('authentication failed')) {
                setApiError('AI service configuration error. Please contact support.');
            } else if (error.message.includes('temporarily unavailable')) {
                setApiError('AI service is temporarily unavailable. Please try again later.');
            } else if (error.message.includes('busy')) {
                setApiError('AI service is busy. Please try again in a moment.');
            } else {
                setApiError(`Unable to connect to AI assistant: ${error.message}`);
            }

            return null;
        }
    };

    // Handle AI chat submission
    const handleAiSubmit = async (e) => {
        e.preventDefault();
        if (!aiInput.trim()) return;

        const userMessage = aiInput.trim();
        setAiMessages(prev => [
            ...prev,
            { sender: 'user', text: userMessage }
        ]);
        setAiInput('');
        setIsAiTyping(true);
        setApiError('');

        // Call DeepSeek API
        const aiResponse = await callDeepSeekAPI(userMessage);

        if (aiResponse) {
            setAiMessages(prev => [
                ...prev,
                { sender: 'ai', text: aiResponse }
            ]);
        } else {
            // Fallback responses when API fails
            const fallbackResponses = [
                "I'm having trouble connecting to my AI service right now. You can still explore our learning resources using the categories above!",
                "It seems I'm having connection issues. In the meantime, check out our math worksheets and vocabulary flashcards below!",
                "I'm temporarily unavailable. Please try the interactive tools or download our learning materials while I get reconnected!"
            ];

            const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

            setAiMessages(prev => [
                ...prev,
                { sender: 'ai', text: randomResponse }
            ]);
        }

        setIsAiTyping(false);
    };

    // Scroll to bottom of chat messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages]);

    // Math worksheet generator functions
    const generateMathProblems = (grade, topic) => {
        let problems = [];

        if (grade === "Grade 1-2") {
            if (topic === "Addition/Subtraction") {
                problems = [
                    "5 + 3 = ?",
                    "7 - 2 = ?",
                    "4 + 6 = ?",
                    "9 - 5 = ?",
                    "2 + 8 = ?"
                ];
            } else if (topic === "Multiplication/Division") {
                problems = [
                    "2 × 3 = ?",
                    "6 ÷ 2 = ?",
                    "4 × 2 = ?",
                    "8 ÷ 4 = ?",
                    "5 × 2 = ?"
                ];
            }
        } else if (grade === "Grade 3-4") {
            if (topic === "Addition/Subtraction") {
                problems = [
                    "25 + 17 = ?",
                    "42 - 18 = ?",
                    "56 + 34 = ?",
                    "73 - 29 = ?",
                    "88 + 12 = ?"
                ];
            } else if (topic === "Multiplication/Division") {
                problems = [
                    "7 × 8 = ?",
                    "45 ÷ 9 = ?",
                    "6 × 9 = ?",
                    "72 ÷ 8 = ?",
                    "8 × 7 = ?"
                ];
            } else if (topic === "Fractions") {
                problems = [
                    "1/2 + 1/4 = ?",
                    "3/4 - 1/4 = ?",
                    "2/3 of 12 = ?",
                    "1/5 + 2/5 = ?",
                    "4/6 - 2/6 = ?"
                ];
            }
        } else if (grade === "Grade 5-7") {
            if (topic === "Multiplication/Division") {
                problems = [
                    "12 × 15 = ?",
                    "144 ÷ 12 = ?",
                    "25 × 8 = ?",
                    "225 ÷ 15 = ?",
                    "17 × 13 = ?"
                ];
            } else if (topic === "Fractions") {
                problems = [
                    "2/3 × 3/4 = ?",
                    "5/6 ÷ 2/3 = ?",
                    "1 1/2 + 2 1/4 = ?",
                    "3/5 of 25 = ?",
                    "7/8 - 3/4 = ?"
                ];
            }
        }

        return problems;
    };

    // Add this function to format the AI response
const formatMessageContent = (text) => {
  // Split the text by lines
  const lines = text.split('\n');
  const formattedLines = [];
  let inList = false;
  let currentListItems = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for headings (###)
    if (line.startsWith('###')) {
      // If we were in a list, close it first
      if (inList) {
        formattedLines.push(<ol key={`list-${i}`}>{currentListItems}</ol>);
        currentListItems = [];
        inList = false;
      }
      
      formattedLines.push(
        <h3 key={`heading-${i}`}>
          {line.replace('###', '').trim()}
        </h3>
      );
    } 
    // Check for numbered list items
    else if (/^\d+\./.test(line)) {
      inList = true;
      
      // Extract the number and content
      const match = line.match(/^(\d+)\.\s*(.*)/);
      if (match) {
        const number = match[1];
        const content = match[2];
        
        // Check if it's a word problem
        const isWordProblem = content.includes('Word Problem:');
        const isCalculation = content.includes('Calculation:');
        const isQuestion = content.includes('Question:');
        
        let formattedContent = content;
        
        // Format math expressions
        formattedContent = formattedContent.replace(/(\d+\s*[+\-×÷]\s*\d+\s*[=]\s*\?)/g, 
          '<span class="math-expression">$1</span>');
        
        // Format fractions
        formattedContent = formattedContent.replace(/(\d+)\/(\d+)/g, 
          '<span class="fraction"><span class="fraction-numerator">$1</span><span class="fraction-denominator">$2</span></span>');
        
        // Format shapes in patterns
        formattedContent = formattedContent.replace(/[⬛⬜]/g, 
          '<span class="pattern-shape">$&</span>');
        
        currentListItems.push(
          <li key={`item-${i}`}>
            {isWordProblem && <strong>Word Problem:</strong>}
            {isCalculation && <strong>Calculation:</strong>}
            {isQuestion && <strong>Question:</strong>}
            <div 
              className={isWordProblem ? 'word-problem' : ''}
              dangerouslySetInnerHTML={{ __html: formattedContent.replace(/(Word Problem:|Calculation:|Question:)/, '') }}
            />
          </li>
        );
      }
    }
    // Regular paragraph
    else if (line) {
      // If we were in a list, close it first
      if (inList) {
        formattedLines.push(<ol key={`list-${i}`}>{currentListItems}</ol>);
        currentListItems = [];
        inList = false;
      }
      
      formattedLines.push(<p key={`para-${i}`}>{line}</p>);
    }
  }
  
  // If we're still in a list at the end, close it
  if (inList) {
    formattedLines.push(<ol key="list-end">{currentListItems}</ol>);
  }
  
  return <div className="formatted-content">{formattedLines}</div>;
};
    const handleGenerateWorksheet = () => {
        if (!mathGrade || !mathTopic) {
            alert("Please select both grade level and topic!");
            return;
        }

        const problems = generateMathProblems(mathGrade, mathTopic);
        const worksheet = `
            MATH PRACTICE WORKSHEET
            Grade: ${mathGrade}
            Topic: ${mathTopic}
            
            Problems:
            ${problems.map((problem, index) => `${index + 1}. ${problem}`).join('\n')}
            
            Good luck! 🎉
        `;

        setGeneratedWorksheet(worksheet);

        // Create a downloadable text file
        const element = document.createElement('a');
        const file = new Blob([worksheet], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `math-worksheet-${mathGrade}-${mathTopic}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    // Flashcard functions
    const startFlashcards = () => {
        const selectedGrade = mathGrade || "Grade 1-2";
        setFlashcards(vocabularySets[selectedGrade]);
        setCurrentCard(0);
        setIsFlipped(false);
        setIsStarted(true);
    };

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentCard((prev) => (prev + 1) % flashcards.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const flipCard = () => {
        setIsFlipped(!isFlipped);
    };

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

            {/* Quick Access Navigation */}
            <section className="quick-nav">
                <div className="nav-container">
                    <h2>Quick Access</h2>
                    <div className="nav-links">
                        <a href="#categories" className="nav-link">Categories</a>
                        <a href="#featured" className="nav-link">Downloads</a>
                        <a href="#videos" className="nav-link">Videos</a>
                        <a href="#tools" className="nav-link">Tools</a>
                        <a href="#ai-assistant" className="nav-link">AI Assistant</a>
                    </div>
                </div>
            </section>

            {/* Category Cards */}
            <section id="categories" className="resource-categories">
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
                                to={category.link}
                                className="category-link"
                            >
                                Let's Go! <FaArrowRight />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Resources */}
            <section id="featured" className="featured-resources">
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
            <section id="videos" className="video-gallery">
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
            <section id="tools" className="interactive-tools">
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
                            <select
                                className="tool-select"
                                value={mathGrade}
                                onChange={(e) => setMathGrade(e.target.value)}
                            >
                                <option value="">Select Grade Level</option>
                                <option value="Grade 1-2">Grade 1-2</option>
                                <option value="Grade 3-4">Grade 3-4</option>
                                <option value="Grade 5-7">Grade 5-7</option>
                            </select>
                            <select
                                className="tool-select"
                                value={mathTopic}
                                onChange={(e) => setMathTopic(e.target.value)}
                            >
                                <option value="">Select Topic</option>
                                <option value="Addition/Subtraction">Addition/Subtraction</option>
                                <option value="Multiplication/Division">Multiplication/Division</option>
                                <option value="Fractions">Fractions</option>
                            </select>
                            <button
                                className="generate-button"
                                onClick={handleGenerateWorksheet}
                            >
                                Generate Worksheet
                            </button>
                        </div>
                        {generatedWorksheet && (
                            <div className="worksheet-preview">
                                <h4>Your worksheet is ready! Check your downloads.</h4>
                            </div>
                        )}
                    </div>

                    <div className="tool-card flashcards">
                        <div className="tool-icon">
                            <svg viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
                            </svg>
                        </div>
                        <h3>Vocabulary Flashcards</h3>
                        <div className="flashcard-container" onClick={flipCard}>
                            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
                                <div className="flashcard-content front">
                                    {isStarted && flashcards.length > 0 ? (
                                        <div>
                                            <h4>{flashcards[currentCard].word}</h4>
                                            <p>Click to see definition</p>
                                        </div>
                                    ) : (
                                        "Select grade and click Start to begin!"
                                    )}
                                </div>
                                <div className="flashcard-content back">
                                    {isStarted && flashcards.length > 0 && (
                                        <div>
                                            <h4>Definition:</h4>
                                            <p>{flashcards[currentCard].definition}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flashcard-controls">
                            <button
                                className="control-button prev"
                                onClick={prevCard}
                                disabled={!isStarted}
                            >
                                Previous
                            </button>
                            <button
                                className="control-button start"
                                onClick={startFlashcards}
                            >
                                {isStarted ? 'Restart' : 'Start'}
                            </button>
                            <button
                                className="control-button next"
                                onClick={nextCard}
                                disabled={!isStarted}
                            >
                                Next
                            </button>
                        </div>
                        {isStarted && (
                            <div className="flashcard-progress">
                                Card {currentCard + 1} of {flashcards.length}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* AI Assistant Section */}
            <section id="ai-assistant" className="ai-assistant-section">
                <div className="section-header">
                    <h2>Literacy Tree AI Assistant</h2>
                    <div className="section-divider"></div>
                    <p className="section-subtitle">Get personalized help with learning resources and questions</p>
                </div>

                <div className="ai-intro">
                    <div className="ai-intro-content">
                        <div className="ai-intro-text">
                            <div className="school-logo-header">
                                <img
                                    src="/school-logo.jpg"
                                    alt="Literacy Tree School"
                                    className="school-logo-bot"
                                    onError={(e) => {
                                        // Fallback if logo doesn't load
                                        e.target.style.display = 'none';
                                        // You can add a fallback icon here if needed
                                    }}
                                />
                                <h3>Meet Your Literacy Tree Learning Assistant</h3>
                            </div>
                            <p>Our AI assistant powered by DeepSeek technology can help you find the right resources, answer questions about learning topics, generate personalized worksheets, and provide educational support for students, parents, and teachers.</p>
                            <button
                                className="ai-chat-button"
                                onClick={() => setAiChatOpen(true)}
                            >
                                <img
                                    src="/school-logo.jpg"
                                    alt="School Logo"
                                    className="chat-button-logo"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                Start Chatting
                            </button>
                        </div>
                        <div className="ai-intro-features">
                            <div className="ai-feature">
                                <div className="feature-icon-wrapper">
                                    <img
                                        src="/school-logo.jpg"
                                        alt="Resource Recommendations"
                                        className="feature-logo"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <FaGraduationCap className="feature-icon-fallback" style={{ display: 'none' }} />
                                </div>
                                <h4>Resource Recommendations</h4>
                                <p>Get personalized suggestions based on grade level and subject</p>
                            </div>
                            <div className="ai-feature">
                                <div className="feature-icon-wrapper">
                                    <img
                                        src="/school-logo.jpg"
                                        alt="Homework Help"
                                        className="feature-logo"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <FaLightbulb className="feature-icon-fallback" style={{ display: 'none' }} />
                                </div>
                                <h4>Homework Help</h4>
                                <p>Get explanations for difficult concepts and problems</p>
                            </div>
                            <div className="ai-feature">
                                <div className="feature-icon-wrapper">
                                    <img
                                        src="/school-logo.jpg"
                                        alt="Q&A Support"
                                        className="feature-logo"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                    <FaQuestionCircle className="feature-icon-fallback" style={{ display: 'none' }} />
                                </div>
                                <h4>Q&A Support</h4>
                                <p>Ask questions about any educational topic</p>
                            </div>
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

            {/* AI Chat Interface */}
            {aiChatOpen && (
    <div className="ai-chat-overlay">
        <div className="ai-chat-container">
            <div className="ai-chat-header">
                <div className="ai-chat-title">
                    <img
                        src="/school-logo.jpg"
                        alt="Literacy Tree School"
                        className="ai-chat-logo"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    <div className="fallback-icon" style={{ display: 'none' }}>
                        <FaGraduationCap />
                    </div>
                    <div className="chat-title-text">
                        <h3>Literacy Tree Assistant</h3>
                        <span className="chat-subtitle">Powered by DeepSeek AI</span>
                    </div>
                </div>
                <button
                    className="ai-chat-close"
                    onClick={() => setAiChatOpen(false)}
                >
                    <FaTimes />
                </button>
            </div>

            <div className="ai-chat-messages">
                {aiMessages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                    >
                        {message.sender === 'ai' && (
                            <div className="message-avatar">
                                <img
                                    src="/school-logo.jpg"
                                    alt="Literacy Tree Assistant"
                                    className="avatar-logo"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="avatar-fallback" style={{ display: 'none' }}>
                                    <FaGraduationCap />
                                </div>
                            </div>
                        )}
                        <div className="message-content">
                            {message.sender === 'ai' ? formatMessageContent(message.text) : message.text}
                        </div>
                        {message.sender === 'user' && (
                            <div className="message-avatar user-avatar">
                                <FaUserCircle />
                            </div>
                        )}
                    </div>
                ))}
                {isAiTyping && (
                    <div className="message ai-message">
                        <div className="message-avatar">
                            <img
                                src="/school-logo.jpg"
                                alt="Literacy Tree Assistant"
                                className="avatar-logo"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="avatar-fallback" style={{ display: 'none' }}>
                                <FaGraduationCap />
                            </div>
                        </div>
                        <div className="message-content typing">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                {apiError && (
                    <div className="message ai-message">
                        <div className="message-avatar error">
                            <img
                                src="/school-logo.jpg"
                                alt="Literacy Tree Assistant"
                                className="avatar-logo"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="avatar-fallback" style={{ display: 'none' }}>
                                <FaExclamationTriangle />
                            </div>
                        </div>
                        <div className="message-content error">
                            {apiError}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="ai-chat-input" onSubmit={handleAiSubmit}>
                <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask me anything about learning resources..."
                    disabled={isAiTyping}
                />
                <button type="submit" disabled={isAiTyping || !aiInput.trim()}>
                    <FaPaperPlane />
                </button>
            </form>

            <div className="ai-chat-suggestions">
                <p>Try asking:</p>
                <div className="suggestion-chips">
                    <button
                        className="suggestion-chip"
                        onClick={() => setAiInput("Find math resources for Grade 3")}
                    >
                        Find math resources for Grade 3
                    </button>
                    <button
                        className="suggestion-chip"
                        onClick={() => setAiInput("How can I help my child with reading?")}
                    >
                        How can I help my child with reading?
                    </button>
                    <button
                        className="suggestion-chip"
                        onClick={() => setAiInput("Generate a science worksheet")}
                    >
                        Generate a science worksheet
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default ResourcesPage;