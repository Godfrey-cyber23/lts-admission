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
  FaSitemap
} from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import '../styles/Faculty.css';

const Faculty = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState('tree'); // 'tree' or 'grid'

    // Sample faculty data with new hierarchy
    const facultyMembers = [
        {
            id: 1,
            name: "Dr. Sarah Mwila",
            position: "School Director",
            department: "directors",
            email: "s.mwila@literacytree.edu",
            phone: "+260 977-845317",
            qualifications: ["PhD in Education", "M.Ed Curriculum Development", "B.Ed Primary Education"],
            bio: "Dr. Sarah Mwila has over 15 years of experience in educational leadership and curriculum development. She is passionate about innovative teaching methodologies.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Educational Leadership", "Curriculum Development"],
            experience: "15 years",
            office: "Main Administration Building, Room 101",
            achievements: ["Excellence in Education Award 2020", "Published Author of 3 Education Books"],
            rank: 1 // Directors
        },
        {
            id: 2,
            name: "Mr. David Banda",
            position: "School Principal",
            department: "principal",
            email: "d.banda@literacytree.edu",
            phone: "+260 966-845317",
            qualifications: ["M.Sc Education Administration", "B.Ed Secondary Education", "PGCE"],
            bio: "Mr. Banda has extensive experience in school management and is dedicated to creating a positive learning environment for all students.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["School Management", "Educational Policy"],
            experience: "12 years",
            office: "Main Administration Building, Room 102",
            achievements: ["Outstanding Principal Award 2019", "Educational Reform Advocate"],
            rank: 2 // School Principal
        },
        {
            id: 3,
            name: "Mrs. Grace Tembo",
            position: "Administration Assistant",
            department: "administration",
            email: "g.tembo@literacytree.edu",
            phone: "+260 971-935653",
            qualifications: ["BA Business Administration", "Diploma in Office Management"],
            bio: "Mrs. Tembo ensures smooth administrative operations and supports the school leadership in daily management tasks.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Office Administration", "Record Management"],
            experience: "8 years",
            office: "Main Administration Building, Room 103",
            achievements: ["Efficiency Award 2021"],
            rank: 3 // Administration Assistance
        },
        {
            id: 4,
            name: "Mr. Peter Phiri",
            position: "Supervisor",
            department: "supervision",
            email: "p.phiri@literacytree.edu",
            phone: "+260 976-123456",
            qualifications: ["M.Ed Educational Supervision", "B.Ed Primary Education", "PGCE"],
            bio: "Mr. Phiri oversees academic standards and ensures teaching quality across all departments.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Educational Supervision", "Quality Assurance"],
            experience: "10 years",
            office: "Academic Affairs, Room 201",
            achievements: ["Quality Assurance Excellence Award 2020"],
            rank: 4 // Supervisor
        },
        {
            id: 5,
            name: "Mrs. Alice Mulenga",
            position: "Curriculum Development Coordinator",
            department: "cdc",
            email: "a.mulenga@literacytree.edu",
            phone: "+260 978-654321",
            qualifications: ["M.Ed Curriculum Development", "B.Ed Early Years", "Montessori Certified"],
            bio: "Mrs. Mulenga leads curriculum innovation and ensures alignment with educational standards.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Curriculum Design", "Educational Assessment"],
            experience: "9 years",
            office: "Academic Affairs, Room 202",
            achievements: ["Curriculum Innovation Award 2021"],
            rank: 4 // CDC
        },
        {
            id: 6,
            name: "Mr. James Lungu",
            position: "Head of Lower School",
            department: "lower-school",
            email: "j.lungu@literacytree.edu",
            phone: "+260 975-789123",
            qualifications: ["M.Ed Primary Education", "B.Ed Early Childhood", "PGCE"],
            bio: "Mr. Lungu leads the lower school section and focuses on foundational learning for young students.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Primary Education", "Early Childhood Development"],
            experience: "11 years",
            office: "Lower School Building, Room 301",
            achievements: ["Lower School Excellence Award 2022"],
            rank: 5 // Head of Lower
        },
        {
            id: 7,
            name: "Mrs. Beatrice Kasonde",
            position: "Head of Upper School",
            department: "upper-school",
            email: "b.kasonde@literacytree.edu",
            phone: "+260 974-456789",
            qualifications: ["MA Education Management", "B.A Education", "PGCE"],
            bio: "Mrs. Kasonde oversees upper school programs and prepares students for higher education.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Secondary Education", "College Preparation"],
            experience: "13 years",
            office: "Upper School Building, Room 401",
            achievements: ["Upper School Leadership Award 2021"],
            rank: 5 // Head of Upper
        },
        {
            id: 8,
            name: "Mr. Michael Soko",
            position: "Mathematics Teacher",
            department: "teachers",
            email: "m.soko@literacytree.edu",
            phone: "+260 973-321654",
            qualifications: ["M.Sc Mathematics", "B.Ed Secondary Education", "PGCE"],
            bio: "Mr. Soko specializes in making mathematics accessible and enjoyable for all students.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Mathematics", "Additional Mathematics", "Statistics"],
            experience: "7 years",
            office: "Teachers Building, Room 101",
            achievements: ["Best Mathematics Teacher 2020"],
            rank: 6 // College of teachers
        },
        {
            id: 9,
            name: "Ms. Jane Chanda",
            position: "English Teacher",
            department: "teachers",
            email: "j.chanda@literacytree.edu",
            phone: "+260 972-987654",
            qualifications: ["MA English Literature", "B.A English", "PGCE"],
            bio: "Ms. Chanda is passionate about literature and creative writing.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["English Language", "English Literature", "Creative Writing"],
            experience: "5 years",
            office: "Teachers Building, Room 102",
            achievements: ["Literary Competition Coach 2021"],
            rank: 6 // College of teachers
        },
        {
            id: 10,
            name: "Mr. John Bwalya",
            position: "Science Teacher",
            department: "teachers",
            email: "j.bwalya@literacytree.edu",
            phone: "+260 979-123456",
            qualifications: ["M.Sc Chemistry", "B.Sc Education", "PGCE"],
            bio: "Mr. Bwalya brings science to life through practical experiments.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Chemistry", "Physics", "General Science"],
            experience: "6 years",
            office: "Teachers Building, Room 103",
            achievements: ["Science Innovation Award 2022"],
            rank: 6 // College of teachers
        },
        {
            id: 11,
            name: "Mrs. Mary Mwansa",
            position: "Librarian",
            department: "auxiliary",
            email: "m.mwansa@literacytree.edu",
            phone: "+260 977-654321",
            qualifications: ["BA Library Science", "Diploma in Information Management"],
            bio: "Mrs. Mwansa manages the school library and promotes reading culture among students.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["Library Management", "Information Literacy"],
            experience: "8 years",
            office: "Library, Room 001",
            achievements: ["Library Excellence Award 2021"],
            rank: 7 // Auxiliary
        },
        {
            id: 12,
            name: "Mr. Joseph Muleya",
            position: "IT Support",
            department: "auxiliary",
            email: "j.muleya@literacytree.edu",
            phone: "+260 976-987654",
            qualifications: ["B.Sc Computer Science", "Diploma in IT Support"],
            bio: "Mr. Muleya provides technical support to students and staff.",
            image: "/staff/_MG_4091.jpg",
            subjects: ["IT Support", "Network Administration"],
            experience: "4 years",
            office: "IT Department, Room 501",
            achievements: ["Technical Excellence Award 2022"],
            rank: 7 // Auxiliary
        }
    ];

    // Testimonial data
    const testimonials = [
        {
            id: 1,
            text: "Literacy Tree School has transformed my child's learning experience. The dedicated faculty and innovative teaching methods have made all the difference.",
            author: "Parent of Grade 9 Student"
        },
        {
            id: 2,
            text: "The professional development opportunities and collaborative environment at Literacy Tree make it an exceptional place to grow as an educator.",
            author: "Faculty Member"
        }
    ];

    const departments = [
        { value: 'all', label: 'All Departments', icon: <FaUserTie /> },
        { value: 'directors', label: 'Directors', icon: <FaUserShield /> },
        { value: 'principal', label: 'School Principal', icon: <FaUserTie /> },
        { value: 'administration', label: 'Administration', icon: <FaUserShield /> },
        { value: 'supervision', label: 'Supervision', icon: <FaChalkboardTeacher /> },
        { value: 'cdc', label: 'Curriculum Development', icon: <FaBook /> },
        { value: 'lower-school', label: 'Lower School', icon: <FaChalkboardTeacher /> },
        { value: 'upper-school', label: 'Upper School', icon: <FaChalkboardTeacher /> },
        { value: 'teachers', label: 'Teachers', icon: <FaBook /> },
        { value: 'auxiliary', label: 'Auxiliary Staff', icon: <FaUserTie /> }
    ];

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const getDepartmentIcon = (department) => {
        const dept = departments.find(d => d.value === department);
        return dept ? dept.icon : <FaUserTie />;
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

    // Organize faculty by rank for tree structure
    const getFacultyByRank = () => {
        const facultyByRank = {};
        
        filteredFaculty.forEach(member => {
            if (!facultyByRank[member.rank]) {
                facultyByRank[member.rank] = [];
            }
            facultyByRank[member.rank].push(member);
        });
        
        return facultyByRank;
    };

    if (isLoading) {
        return (
            <div className="faculty-page loading">
                <div className="loading-spinner"></div>
                <p>Loading faculty information...</p>
            </div>
        );
    }

    const facultyByRank = getFacultyByRank();

    return (
        <div className="faculty-page">
            <div className="faculty-container">
                {/* Faculty Header */}
                <div className="faculty-header">
                    <div className="header-content">
                        <h1>
                            <FaGraduationCap className="header-icon" />
                            Our Faculty & Staff
                        </h1>
                        <p>Meet our dedicated team of educators and administrators committed to excellence in education</p>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className="faculty-controls">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, position, or subject..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    
                    <div className="filter-section">
                        <FaFilter className="filter-icon" />
                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="department-filter"
                        >
                            {departments.map(dept => (
                                <option key={dept.value} value={dept.value}>
                                    {dept.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="view-toggle">
                        <button 
                            className={`view-button ${activeView === 'tree' ? 'active' : ''}`}
                            onClick={() => setActiveView('tree')}
                        >
                            <FaSitemap /> Tree View
                        </button>
                        <button 
                            className={`view-button ${activeView === 'grid' ? 'active' : ''}`}
                            onClick={() => setActiveView('grid')}
                        >
                            <FaUserTie /> Grid View
                        </button>
                    </div>
                </div>

                {/* Faculty Tree View */}
                {activeView === 'tree' && (
                    <div className="faculty-tree-container">
                        <div className="tree-levels">
                            {Object.keys(facultyByRank).sort((a, b) => a - b).map((rank, index) => (
                                <div key={rank} className={`tree-level level-${rank}`}>
                                    <div className="level-label">
                                        {rank === 1 && "Directors"}
                                        {rank === 2 && "School Principal"}
                                        {rank === 3 && "Administration Assistance"}
                                        {rank === 4 && "Supervision & CDC"}
                                        {rank === 5 && "School Heads"}
                                        {rank === 6 && "College of Teachers"}
                                        {rank === 7 && "Auxiliary Staff"}
                                    </div>
                                    <div className="tree-nodes">
                                        {facultyByRank[rank].map((member, memberIndex) => (
                                            <div key={member.id} className="tree-node">
                                                <div 
                                                    className="node-card"
                                                    onClick={() => openStaffModal(member)}
                                                >
                                                    <div className="node-image">
                                                        <img 
                                                            src={member.image} 
                                                            alt={member.name}
                                                            onError={(e) => {
                                                                e.target.src = '/images/staff/placeholder.jpg';
                                                            }}
                                                        />
                                                        <div className="department-badge">
                                                            {getDepartmentIcon(member.department)}
                                                        </div>
                                                        {member.achievements.length > 0 && (
                                                            <div className="achievement-badge">
                                                                <FaStar />
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="node-content">
                                                        <h3 className="staff-name">{member.name}</h3>
                                                        <p className="staff-position">{member.position}</p>
                                                        <p className="staff-department">
                                                            {getDepartmentLabel(member.department)}
                                                        </p>
                                                        
                                                        <div className="staff-subjects">
                                                            {member.subjects.slice(0, 2).map((subject, index) => (
                                                                <span key={index} className="subject-tag">
                                                                    {subject}
                                                                </span>
                                                            ))}
                                                            {member.subjects.length > 2 && (
                                                                <span className="subject-tag more">
                                                                    +{member.subjects.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="staff-experience">
                                                            <span className="experience-badge">
                                                                {member.experience} experience
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Connect to next level if not the last level */}
                                                {rank < 7 && (
                                                    <div className="node-connector"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Faculty Grid View */}
                {activeView === 'grid' && (
                    <div className="faculty-grid">
                        {filteredFaculty.length > 0 ? (
                            filteredFaculty.map(member => (
                                <div 
                                    key={member.id} 
                                    className="faculty-card"
                                    onClick={() => openStaffModal(member)}
                                >
                                    <div className="card-image">
                                        <img 
                                            src={member.image} 
                                            alt={member.name}
                                            onError={(e) => {
                                                e.target.src = '/placeholder.jpg';
                                            }}
                                        />
                                        <div className="department-badge">
                                            {getDepartmentIcon(member.department)}
                                        </div>
                                        {member.achievements.length > 0 && (
                                            <div className="achievement-badge">
                                                <FaStar />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="card-content">
                                        <h3 className="staff-name">{member.name}</h3>
                                        <p className="staff-position">{member.position}</p>
                                        <p className="staff-department">
                                            {getDepartmentLabel(member.department)}
                                        </p>
                                        
                                        <div className="staff-subjects">
                                            {member.subjects.slice(0, 2).map((subject, index) => (
                                                <span key={index} className="subject-tag">
                                                    {subject}
                                                </span>
                                            ))}
                                            {member.subjects.length > 2 && (
                                                <span className="subject-tag more">
                                                    +{member.subjects.length - 2} more
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="staff-experience">
                                            <span className="experience-badge">
                                                {member.experience} experience
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="card-actions">
                                        <button 
                                            className="btn-view-profile"
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
                            <div className="no-results">
                                <IoMdSchool className="no-results-icon" />
                                <h3>No staff members found</h3>
                                <p>Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Department Statistics */}
                <div className="department-stats">
                    <h2>
                        <IoMdSchool className="stats-icon" />
                        Department Overview
                    </h2>
                    <div className="stats-grid">
                        {departments.filter(dept => dept.value !== 'all').map(dept => {
                            const count = facultyMembers.filter(member => 
                                member.department === dept.value
                            ).length;
                            return (
                                <div key={dept.value} className="stat-card">
                                    <div className="stat-icon">
                                        {dept.icon}
                                    </div>
                                    <div className="stat-info">
                                        <div className="stat-count">{count}</div>
                                        <div className="stat-label">{dept.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Staff Detail Modal */}
                {selectedStaff && (
                    <div className="modal-overlay" onClick={closeStaffModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Staff Profile</h3>
                                <button className="close-btn" onClick={closeStaffModal}>
                                    <FaTimes />
                                </button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="staff-profile">
                                    <div className="profile-header">
                                        <div className="profile-image">
                                            <img 
                                                src={selectedStaff.image} 
                                                alt={selectedStaff.name}
                                                onError={(e) => {
                                                    e.target.src = '/images/staff/placeholder.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="profile-info">
                                            <h2>{selectedStaff.name}</h2>
                                            <p className="position">{selectedStaff.position}</p>
                                            <p className="department">
                                                {getDepartmentLabel(selectedStaff.department)}
                                            </p>
                                            <div className="experience">
                                                <span className="experience-badge">
                                                    {selectedStaff.experience} experience
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="profile-details">
                                        <div className="detail-section">
                                            <h4>Contact Information</h4>
                                            <div className="contact-info">
                                                <div className="contact-item">
                                                    <FaEnvelope className="contact-icon" />
                                                    <a href={`mailto:${selectedStaff.email}`}>
                                                        {selectedStaff.email}
                                                    </a>
                                                </div>
                                                <div className="contact-item">
                                                    <FaPhone className="contact-icon" />
                                                    <a href={`tel:${selectedStaff.phone}`}>
                                                        {selectedStaff.phone}
                                                    </a>
                                                </div>
                                                <div className="contact-item">
                                                    <FaUserTie className="contact-icon" />
                                                    <span>{selectedStaff.office}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="detail-section">
                                            <h4>Qualifications</h4>
                                            <ul className="qualifications-list">
                                                {selectedStaff.qualifications.map((qual, index) => (
                                                    <li key={index}>{qual}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        
                                        <div className="detail-section">
                                            <h4>Subjects & Expertise</h4>
                                            <div className="subjects-list">
                                                {selectedStaff.subjects.map((subject, index) => (
                                                    <span key={index} className="subject-tag large">
                                                        {subject}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {selectedStaff.achievements && selectedStaff.achievements.length > 0 && (
                                            <div className="detail-section">
                                                <h4>Achievements</h4>
                                                <ul className="achievements-list">
                                                    {selectedStaff.achievements.map((achievement, index) => (
                                                        <li key={index}>{achievement}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        <div className="detail-section">
                                            <h4>Bio</h4>
                                            <p className="staff-bio">{selectedStaff.bio}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Faculty;