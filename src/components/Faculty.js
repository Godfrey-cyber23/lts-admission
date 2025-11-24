import React, { useState, useEffect } from 'react';
import { 
  FaGraduationCap, 
  FaEnvelope, 
  FaPhone, 
  FaBook, 
  FaSearch, 
  FaFilter, 
  FaUserTie, 
  FaChalkboardTeacher, 
  FaUserShield,
  FaMapMarkerAlt,
  FaAward,
  FaStar,
  FaQuoteLeft,
  FaTimes,
  FaSitemap,
  FaChevronDown,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa';
import { IoMdSchool, IoMdPeople } from 'react-icons/io';
import { GiTeacher } from 'react-icons/gi';
import '../styles/Faculty.css';

const Faculty = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState('org-chart');
    const [expandedLevels, setExpandedLevels] = useState(new Set([1]));

    const facultyMembers = [
        {
            id: 1,
            name: "Dr. Sarah Mwila",
            position: "School Director",
            department: "leadership",
            email: "s.mwila@literacytree.edu",
            phone: "+260 977-845317",
            qualifications: ["PhD in Education", "M.Ed Curriculum Development", "B.Ed Primary Education"],
            bio: "Dr. Sarah Mwila has over 15 years of experience in educational leadership and curriculum development. She is passionate about innovative teaching methodologies and student-centered learning approaches.",
            image: "/staff/director.jpg",
            subjects: ["Educational Leadership", "Curriculum Development"],
            experience: "15 years",
            office: "Main Administration Building, Room 101",
            achievements: ["Excellence in Education Award 2020", "Published Author of 3 Education Books", "National Education Advisory Board Member"],
            rank: 1,
            reportsTo: null,
            social: {
                linkedin: "sarah-mwila",
                twitter: "sarah_educator"
            }
        },
        {
            id: 2,
            name: "Mr. David Banda",
            position: "School Principal",
            department: "leadership",
            email: "d.banda@literacytree.edu",
            phone: "+260 966-845317",
            qualifications: ["M.Sc Education Administration", "B.Ed Secondary Education", "PGCE"],
            bio: "Mr. Banda has extensive experience in school management and is dedicated to creating a positive learning environment for all students.",
            image: "/staff/principal.jpg",
            subjects: ["School Management", "Educational Policy"],
            experience: "12 years",
            office: "Main Administration Building, Room 102",
            achievements: ["Outstanding Principal Award 2019", "Educational Reform Advocate"],
            rank: 2,
            reportsTo: 1
        },
        {
            id: 3,
            name: "Mrs. Grace Tembo",
            position: "Administration Manager",
            department: "administration",
            email: "g.tembo@literacytree.edu",
            phone: "+260 971-935653",
            qualifications: ["BA Business Administration", "Diploma in Office Management", "Certified Administrative Professional"],
            bio: "Mrs. Tembo ensures smooth administrative operations and supports the school leadership in daily management tasks.",
            image: "/staff/admin.jpg",
            subjects: ["Office Administration", "Record Management"],
            experience: "8 years",
            office: "Main Administration Building, Room 103",
            achievements: ["Efficiency Award 2021", "Staff Excellence Recognition"],
            rank: 3,
            reportsTo: 2
        },
        {
            id: 4,
            name: "Mr. Peter Phiri",
            position: "Academic Supervisor",
            department: "academic",
            email: "p.phiri@literacytree.edu",
            phone: "+260 976-123456",
            qualifications: ["M.Ed Educational Supervision", "B.Ed Primary Education", "PGCE"],
            bio: "Mr. Phiri oversees academic standards and ensures teaching quality across all departments.",
            image: "/staff/supervisor.jpg",
            subjects: ["Educational Supervision", "Quality Assurance"],
            experience: "10 years",
            office: "Academic Affairs, Room 201",
            achievements: ["Quality Assurance Excellence Award 2020", "Teacher Development Program Lead"],
            rank: 4,
            reportsTo: 2
        },
        {
            id: 5,
            name: "Mrs. Alice Mulenga",
            position: "Curriculum Development Coordinator",
            department: "academic",
            email: "a.mulenga@literacytree.edu",
            phone: "+260 978-654321",
            qualifications: ["M.Ed Curriculum Development", "B.Ed Early Years", "Montessori Certified"],
            bio: "Mrs. Mulenga leads curriculum innovation and ensures alignment with educational standards.",
            image: "/staff/curriculum.jpg",
            subjects: ["Curriculum Design", "Educational Assessment"],
            experience: "9 years",
            office: "Academic Affairs, Room 202",
            achievements: ["Curriculum Innovation Award 2021", "National Curriculum Review Committee"],
            rank: 4,
            reportsTo: 2
        },
        {
            id: 6,
            name: "Mr. James Lungu",
            position: "Head of Lower School",
            department: "academic",
            email: "j.lungu@literacytree.edu",
            phone: "+260 975-789123",
            qualifications: ["M.Ed Primary Education", "B.Ed Early Childhood", "PGCE"],
            bio: "Mr. Lungu leads the lower school section and focuses on foundational learning for young students.",
            image: "/staff/lower-head.jpg",
            subjects: ["Primary Education", "Early Childhood Development"],
            experience: "11 years",
            office: "Lower School Building, Room 301",
            achievements: ["Lower School Excellence Award 2022", "Early Years Program Developer"],
            rank: 5,
            reportsTo: 4
        },
        {
            id: 7,
            name: "Mrs. Beatrice Kasonde",
            position: "Head of Upper School",
            department: "academic",
            email: "b.kasonde@literacytree.edu",
            phone: "+260 974-456789",
            qualifications: ["MA Education Management", "B.A Education", "PGCE"],
            bio: "Mrs. Kasonde oversees upper school programs and prepares students for higher education.",
            image: "/staff/upper-head.jpg",
            subjects: ["Secondary Education", "College Preparation"],
            experience: "13 years",
            office: "Upper School Building, Room 401",
            achievements: ["Upper School Leadership Award 2021", "College Placement Specialist"],
            rank: 5,
            reportsTo: 4
        },
        {
            id: 8,
            name: "Mr. Michael Soko",
            position: "Senior Mathematics Teacher",
            department: "teaching",
            email: "m.soko@literacytree.edu",
            phone: "+260 973-321654",
            qualifications: ["M.Sc Mathematics", "B.Ed Secondary Education", "PGCE"],
            bio: "Mr. Soko specializes in making mathematics accessible and enjoyable for all students.",
            image: "/staff/math-teacher.jpg",
            subjects: ["Mathematics", "Additional Mathematics", "Statistics"],
            experience: "7 years",
            office: "Teachers Building, Room 101",
            achievements: ["Best Mathematics Teacher 2020", "Math Olympiad Coach"],
            rank: 6,
            reportsTo: 6
        },
        {
            id: 9,
            name: "Ms. Jane Chanda",
            position: "English Department Head",
            department: "teaching",
            email: "j.chanda@literacytree.edu",
            phone: "+260 972-987654",
            qualifications: ["MA English Literature", "B.A English", "PGCE"],
            bio: "Ms. Chanda is passionate about literature and creative writing.",
            image: "/staff/english-teacher.jpg",
            subjects: ["English Language", "English Literature", "Creative Writing"],
            experience: "5 years",
            office: "Teachers Building, Room 102",
            achievements: ["Literary Competition Coach 2021", "Creative Writing Workshop Leader"],
            rank: 6,
            reportsTo: 7
        },
        {
            id: 10,
            name: "Mr. John Bwalya",
            position: "Science Coordinator",
            department: "teaching",
            email: "j.bwalya@literacytree.edu",
            phone: "+260 979-123456",
            qualifications: ["M.Sc Chemistry", "B.Sc Education", "PGCE"],
            bio: "Mr. Bwalya brings science to life through practical experiments.",
            image: "/staff/science-teacher.jpg",
            subjects: ["Chemistry", "Physics", "General Science"],
            experience: "6 years",
            office: "Teachers Building, Room 103",
            achievements: ["Science Innovation Award 2022", "STEM Program Developer"],
            rank: 6,
            reportsTo: 7
        }
    ];

    const departments = [
        { value: 'all', label: 'All Departments', icon: <FaUserTie />, color: '#1a5f3f' },
        { value: 'leadership', label: 'Leadership', icon: <FaUserShield />, color: '#0f3d27' },
        { value: 'administration', label: 'Administration', icon: <FaUserTie />, color: '#2d7a52' },
        { value: 'academic', label: 'Academic', icon: <FaChalkboardTeacher />, color: '#3b8a5c' },
        { value: 'teaching', label: 'Teaching', icon: <FaBook />, color: '#4a9a6c' }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const getDepartmentIcon = (department) => {
        const dept = departments.find(d => d.value === department);
        return dept ? dept.icon : <FaUserTie />;
    };

    const getDepartmentColor = (department) => {
        const dept = departments.find(d => d.value === department);
        return dept ? dept.color : '#1a5f3f';
    };

    const getDepartmentLabel = (department) => {
        const dept = departments.find(d => d.value === department);
        return dept ? dept.label : 'Unknown Department';
    };

    const filteredFaculty = facultyMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            member.subjects.some(subject => 
                                subject.toLowerCase().includes(searchTerm.toLowerCase())
                            );
        const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
        
        return matchesSearch && matchesDepartment;
    });

    const openStaffModal = (staff) => {
        setSelectedStaff(staff);
        document.body.style.overflow = 'hidden';
    };

    const closeStaffModal = () => {
        setSelectedStaff(null);
        document.body.style.overflow = 'unset';
    };

    const toggleLevel = (level) => {
        const newExpandedLevels = new Set(expandedLevels);
        if (newExpandedLevels.has(level)) {
            newExpandedLevels.delete(level);
        } else {
            newExpandedLevels.add(level);
        }
        setExpandedLevels(newExpandedLevels);
    };

    const getFacultyByLevel = () => {
        const levels = {};
        facultyMembers.forEach(member => {
            if (!levels[member.rank]) {
                levels[member.rank] = [];
            }
            levels[member.rank].push(member);
        });
        return levels;
    };

    const getSubordinates = (managerId) => {
        return facultyMembers.filter(member => member.reportsTo === managerId);
    };

    if (isLoading) {
        return (
            <div className="faculty-page-loading">
                <div className="faculty-loading-spinner"></div>
                <p>Loading our amazing team...</p>
            </div>
        );
    }

    const facultyLevels = getFacultyByLevel();

    return (
        <div className="faculty-page-container">
            {/* Hero Section */}
            <section className="faculty-hero-section">
                <div className="faculty-hero-background">
                    <div className="faculty-hero-overlay"></div>
                </div>
                <div className="faculty-hero-content">
                    <h1 className="faculty-hero-title">
                        <FaGraduationCap className="faculty-hero-icon" />
                        Meet Our Team
                    </h1>
                    <p className="faculty-hero-subtitle">
                        Dedicated educators and administrators committed to nurturing young minds 
                        and building futures at Literacy Tree School
                    </p>
                    <div className="faculty-hero-stats">
                        <div className="faculty-stat-item">
                            <span className="faculty-stat-number">{facultyMembers.length}+</span>
                            <span className="faculty-stat-label">Team Members</span>
                        </div>
                        <div className="faculty-stat-item">
                            <span className="faculty-stat-number">85+</span>
                            <span className="faculty-stat-label">Years Combined Experience</span>
                        </div>
                        <div className="faculty-stat-item">
                            <span className="faculty-stat-number">100%</span>
                            <span className="faculty-stat-label">Certified Professionals</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Controls Section */}
            <section className="faculty-controls-section">
                <div className="faculty-controls-container">
                    <div className="faculty-search-container">
                        <FaSearch className="faculty-search-icon" />
                        <input
                            type="text"
                            placeholder="Search team members by name, position, or expertise..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="faculty-search-input"
                        />
                    </div>
                    
                    <div className="faculty-filters-container">
                        <div className="faculty-filter-group">
                            <FaFilter className="faculty-filter-icon" />
                            <select
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                className="faculty-department-select"
                            >
                                {departments.map(dept => (
                                    <option key={dept.value} value={dept.value}>
                                        {dept.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="faculty-view-toggle-group">
                            <button 
                                className={`faculty-view-toggle-btn ${activeView === 'org-chart' ? 'faculty-view-active' : ''}`}
                                onClick={() => setActiveView('org-chart')}
                            >
                                <FaSitemap /> Organization Chart
                            </button>
                            <button 
                                className={`faculty-view-toggle-btn ${activeView === 'grid' ? 'faculty-view-active' : ''}`}
                                onClick={() => setActiveView('grid')}
                            >
                                <IoMdPeople /> Team Grid
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Organization Chart View */}
            {activeView === 'org-chart' && (
                <section className="faculty-org-chart-section">
                    <div className="faculty-org-chart-container">
                        <h2 className="faculty-section-title">Organizational Structure</h2>
                        <p className="faculty-section-subtitle">
                            Our hierarchical structure ensures clear leadership and effective communication
                        </p>
                        
                        <div className="faculty-org-chart">
                            {Object.keys(facultyLevels)
                                .sort((a, b) => a - b)
                                .map(level => (
                                    <div key={level} className="faculty-org-level">
                                        <div className="faculty-level-header">
                                            <h3 className="faculty-level-title">
                                                Level {level} Leadership
                                            </h3>
                                            <button 
                                                className="faculty-level-toggle"
                                                onClick={() => toggleLevel(parseInt(level))}
                                            >
                                                <FaChevronDown className={`faculty-toggle-icon ${expandedLevels.has(parseInt(level)) ? 'faculty-toggle-expanded' : ''}`} />
                                            </button>
                                        </div>
                                        
                                        {expandedLevels.has(parseInt(level)) && (
                                            <div className="faculty-level-members">
                                                {facultyLevels[level].map(member => (
                                                    <div key={member.id} className="faculty-org-member">
                                                        <div 
                                                            className="faculty-member-card"
                                                            style={{ borderLeftColor: getDepartmentColor(member.department) }}
                                                            onClick={() => openStaffModal(member)}
                                                        >
                                                            <div className="faculty-member-avatar">
                                                                <img 
                                                                    src={member.image} 
                                                                    alt={member.name}
                                                                    onError={(e) => {
                                                                        e.target.src = '/images/avatar-placeholder.jpg';
                                                                    }}
                                                                />
                                                                <div 
                                                                    className="faculty-member-badge"
                                                                    style={{ backgroundColor: getDepartmentColor(member.department) }}
                                                                >
                                                                    {getDepartmentIcon(member.department)}
                                                                </div>
                                                            </div>
                                                            <div className="faculty-member-info">
                                                                <h4 className="faculty-member-name">{member.name}</h4>
                                                                <p className="faculty-member-position">{member.position}</p>
                                                                <p className="faculty-member-department">
                                                                    {getDepartmentLabel(member.department)}
                                                                </p>
                                                                <div className="faculty-member-experience">
                                                                    <span className="faculty-experience-tag">
                                                                        {member.experience}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Subordinates */}
                                                        {getSubordinates(member.id).length > 0 && (
                                                            <div className="faculty-subordinates">
                                                                {getSubordinates(member.id).map(subordinate => (
                                                                    <div key={subordinate.id} className="faculty-subordinate-member">
                                                                        <div 
                                                                            className="faculty-member-card faculty-subordinate-card"
                                                                            onClick={() => openStaffModal(subordinate)}
                                                                        >
                                                                            <div className="faculty-member-avatar">
                                                                                <img 
                                                                                    src={subordinate.image} 
                                                                                    alt={subordinate.name}
                                                                                    onError={(e) => {
                                                                                        e.target.src = '/images/avatar-placeholder.jpg';
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="faculty-member-info">
                                                                                <h5 className="faculty-member-name">{subordinate.name}</h5>
                                                                                <p className="faculty-member-position">{subordinate.position}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Grid View */}
            {activeView === 'grid' && (
                <section className="faculty-grid-section">
                    <div className="faculty-grid-container">
                        <h2 className="faculty-section-title">Our Team Members</h2>
                        <p className="faculty-section-subtitle">
                            Meet the dedicated professionals who make Literacy Tree School exceptional
                        </p>
                        
                        <div className="faculty-members-grid">
                            {filteredFaculty.length > 0 ? (
                                filteredFaculty.map(member => (
                                    <div 
                                        key={member.id} 
                                        className="faculty-grid-member-card"
                                        onClick={() => openStaffModal(member)}
                                    >
                                        <div className="faculty-grid-card-header">
                                            <div className="faculty-grid-avatar">
                                                <img 
                                                    src={member.image} 
                                                    alt={member.name}
                                                    onError={(e) => {
                                                        e.target.src = '/images/avatar-placeholder.jpg';
                                                    }}
                                                />
                                                <div 
                                                    className="faculty-grid-badge"
                                                    style={{ backgroundColor: getDepartmentColor(member.department) }}
                                                >
                                                    {getDepartmentIcon(member.department)}
                                                </div>
                                            </div>
                                            {member.achievements.length > 0 && (
                                                <div className="faculty-achievement-indicator">
                                                    <FaStar />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="faculty-grid-card-body">
                                            <h3 className="faculty-grid-name">{member.name}</h3>
                                            <p className="faculty-grid-position">{member.position}</p>
                                            <p className="faculty-grid-department">
                                                {getDepartmentLabel(member.department)}
                                            </p>
                                            
                                            <div className="faculty-grid-expertise">
                                                {member.subjects.slice(0, 3).map((subject, index) => (
                                                    <span 
                                                        key={index} 
                                                        className="faculty-expertise-tag"
                                                        style={{ 
                                                            backgroundColor: getDepartmentColor(member.department) + '20',
                                                            color: getDepartmentColor(member.department)
                                                        }}
                                                    >
                                                        {subject}
                                                    </span>
                                                ))}
                                                {member.subjects.length > 3 && (
                                                    <span className="faculty-expertise-more">
                                                        +{member.subjects.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="faculty-grid-card-footer">
                                            <div className="faculty-grid-experience">
                                                <span 
                                                    className="faculty-experience-badge"
                                                    style={{ backgroundColor: getDepartmentColor(member.department) }}
                                                >
                                                    {member.experience}
                                                </span>
                                            </div>
                                            <button 
                                                className="faculty-view-profile-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openStaffModal(member);
                                                }}
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="faculty-no-results">
                                    <GiTeacher className="faculty-no-results-icon" />
                                    <h3>No team members found</h3>
                                    <p>Try adjusting your search criteria or browse all departments</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Department Overview */}
            <section className="faculty-departments-section">
                <div className="faculty-departments-container">
                    <h2 className="faculty-section-title">Department Overview</h2>
                    <div className="faculty-departments-grid">
                        {departments.filter(dept => dept.value !== 'all').map(dept => {
                            const count = facultyMembers.filter(member => 
                                member.department === dept.value
                            ).length;
                            const deptMembers = facultyMembers.filter(member => member.department === dept.value);
                            const avgExperience = (deptMembers.reduce((acc, member) => {
                                const years = parseInt(member.experience);
                                return acc + (isNaN(years) ? 0 : years);
                            }, 0) / count).toFixed(1);
                            
                            return (
                                <div 
                                    key={dept.value} 
                                    className="faculty-department-card"
                                    style={{ borderTopColor: dept.color }}
                                >
                                    <div className="faculty-department-icon">
                                        {dept.icon}
                                    </div>
                                    <div className="faculty-department-info">
                                        <h3 className="faculty-department-name">{dept.label}</h3>
                                        <div className="faculty-department-stats">
                                            <div className="faculty-department-stat">
                                                <span className="faculty-department-count">{count}</span>
                                                <span className="faculty-department-label">Members</span>
                                            </div>
                                            <div className="faculty-department-stat">
                                                <span className="faculty-department-count">{avgExperience}</span>
                                                <span className="faculty-department-label">Avg. Years</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Staff Detail Modal */}
            {selectedStaff && (
                <div className="faculty-modal-overlay" onClick={closeStaffModal}>
                    <div className="faculty-modal-container" onClick={e => e.stopPropagation()}>
                        <div className="faculty-modal-header">
                            <h2>Team Member Profile</h2>
                            <button className="faculty-modal-close" onClick={closeStaffModal}>
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="faculty-modal-content">
                            <div className="faculty-modal-profile">
                                <div className="faculty-modal-avatar">
                                    <img 
                                        src={selectedStaff.image} 
                                        alt={selectedStaff.name}
                                        onError={(e) => {
                                            e.target.src = '/images/avatar-placeholder.jpg';
                                        }}
                                    />
                                    <div 
                                        className="faculty-modal-badge"
                                        style={{ backgroundColor: getDepartmentColor(selectedStaff.department) }}
                                    >
                                        {getDepartmentIcon(selectedStaff.department)}
                                    </div>
                                </div>
                                
                                <div className="faculty-modal-info">
                                    <h1 className="faculty-modal-name">{selectedStaff.name}</h1>
                                    <p className="faculty-modal-position">{selectedStaff.position}</p>
                                    <p className="faculty-modal-department">
                                        {getDepartmentLabel(selectedStaff.department)}
                                    </p>
                                    
                                    <div className="faculty-modal-stats">
                                        <div className="faculty-modal-stat">
                                            <span className="faculty-modal-stat-value">{selectedStaff.experience}</span>
                                            <span className="faculty-modal-stat-label">Experience</span>
                                        </div>
                                        <div className="faculty-modal-stat">
                                            <span className="faculty-modal-stat-value">{selectedStaff.qualifications.length}</span>
                                            <span className="faculty-modal-stat-label">Qualifications</span>
                                        </div>
                                        <div className="faculty-modal-stat">
                                            <span className="faculty-modal-stat-value">{selectedStaff.subjects.length}</span>
                                            <span className="faculty-modal-stat-label">Expertise Areas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="faculty-modal-details">
                                <div className="faculty-modal-section">
                                    <h3>Contact Information</h3>
                                    <div className="faculty-contact-details">
                                        <div className="faculty-contact-item">
                                            <FaEnvelope className="faculty-contact-icon" />
                                            <a href={`mailto:${selectedStaff.email}`}>
                                                {selectedStaff.email}
                                            </a>
                                        </div>
                                        <div className="faculty-contact-item">
                                            <FaPhone className="faculty-contact-icon" />
                                            <a href={`tel:${selectedStaff.phone}`}>
                                                {selectedStaff.phone}
                                            </a>
                                        </div>
                                        <div className="faculty-contact-item">
                                            <FaMapMarkerAlt className="faculty-contact-icon" />
                                            <span>{selectedStaff.office}</span>
                                        </div>
                                        {selectedStaff.social && (
                                            <div className="faculty-social-links">
                                                {selectedStaff.social.linkedin && (
                                                    <a href={`https://linkedin.com/in/${selectedStaff.social.linkedin}`} className="faculty-social-link">
                                                        <FaLinkedin />
                                                    </a>
                                                )}
                                                {selectedStaff.social.twitter && (
                                                    <a href={`https://twitter.com/${selectedStaff.social.twitter}`} className="faculty-social-link">
                                                        <FaTwitter />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="faculty-modal-section">
                                    <h3>Professional Qualifications</h3>
                                    <ul className="faculty-qualifications-list">
                                        {selectedStaff.qualifications.map((qual, index) => (
                                            <li key={index} className="faculty-qualification-item">
                                                <FaAward className="faculty-qualification-icon" />
                                                {qual}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="faculty-modal-section">
                                    <h3>Areas of Expertise</h3>
                                    <div className="faculty-expertise-tags">
                                        {selectedStaff.subjects.map((subject, index) => (
                                            <span 
                                                key={index} 
                                                className="faculty-expertise-tag-large"
                                                style={{ 
                                                    backgroundColor: getDepartmentColor(selectedStaff.department) + '20',
                                                    color: getDepartmentColor(selectedStaff.department)
                                                }}
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                {selectedStaff.achievements && selectedStaff.achievements.length > 0 && (
                                    <div className="faculty-modal-section">
                                        <h3>Notable Achievements</h3>
                                        <ul className="faculty-achievements-list">
                                            {selectedStaff.achievements.map((achievement, index) => (
                                                <li key={index} className="faculty-achievement-item">
                                                    <FaStar className="faculty-achievement-icon" />
                                                    {achievement}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                <div className="faculty-modal-section">
                                    <h3>Professional Bio</h3>
                                    <p className="faculty-bio-text">{selectedStaff.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Faculty;