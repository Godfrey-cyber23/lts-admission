import React, { useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaPrint, FaDownload } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import '../styles/Calendar.css';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Sample academic events data
    const academicEvents = [
        {
            id: 1,
            title: "First Term Begins",
            date: new Date(currentDate.getFullYear(), 0, 15), // January 15
            type: "academic",
            description: "Start of the first academic term for all students"
        },
        {
            id: 2,
            title: "Mid-Term Break",
            date: new Date(currentDate.getFullYear(), 1, 20), // February 20
            type: "break",
            description: "One week mid-term break for students and staff"
        },
        {
            id: 3,
            title: "End of First Term",
            date: new Date(currentDate.getFullYear(), 2, 30), // March 30
            type: "academic",
            description: "First term examinations and closing ceremony"
        },
        {
            id: 4,
            title: "Second Term Begins",
            date: new Date(currentDate.getFullYear(), 3, 10), // April 10
            type: "academic",
            description: "Start of the second academic term"
        },
        {
            id: 5,
            title: "Sports Day",
            date: new Date(currentDate.getFullYear(), 4, 15), // May 15
            type: "event",
            description: "Annual inter-house sports competition"
        },
        {
            id: 6,
            title: "Parents-Teacher Meeting",
            date: new Date(currentDate.getFullYear(), 5, 5), // June 5
            type: "meeting",
            description: "Progress review meeting with parents and teachers"
        },
        {
            id: 7,
            title: "End of Second Term",
            date: new Date(currentDate.getFullYear(), 6, 20), // July 20
            type: "academic",
            description: "Second term examinations and closing ceremony"
        },
        {
            id: 8,
            title: "Third Term Begins",
            date: new Date(currentDate.getFullYear(), 7, 5), // August 5
            type: "academic",
            description: "Start of the third and final academic term"
        },
        {
            id: 9,
            title: "Cultural Day",
            date: new Date(currentDate.getFullYear(), 8, 25), // September 25
            type: "event",
            description: "Annual cultural celebration and performances"
        },
        {
            id: 10,
            title: "Final Examinations",
            date: new Date(currentDate.getFullYear(), 9, 15), // October 15
            type: "academic",
            description: "End of year final examinations for all classes"
        },
        {
            id: 11,
            title: "Graduation Ceremony",
            date: new Date(currentDate.getFullYear(), 10, 30), // November 30
            type: "ceremony",
            description: "Annual graduation ceremony for completing students"
        },
        {
            id: 12,
            title: "School Holidays Begin",
            date: new Date(currentDate.getFullYear(), 11, 15), // December 15
            type: "break",
            description: "Start of long holidays for students and staff"
        }
    ];

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getEventTypeColor = (type) => {
        const colors = {
            academic: "#2e7d32",
            break: "#f57c00",
            event: "#1565c0",
            meeting: "#7b1fa2",
            ceremony: "#c2185b"
        };
        return colors[type] || "#666";
    };

    const getEventTypeLabel = (type) => {
        const labels = {
            academic: "Academic",
            break: "Break",
            event: "Event",
            meeting: "Meeting",
            ceremony: "Ceremony"
        };
        return labels[type] || "Event";
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const getEventsForDay = (day) => {
        return academicEvents.filter(event => 
            event.date.getDate() === day &&
            event.date.getMonth() === currentDate.getMonth() &&
            event.date.getFullYear() === currentDate.getFullYear()
        );
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    const closeEventModal = () => {
        setSelectedEvent(null);
    };

    const downloadCalendar = () => {
        // In a real app, this would generate and download a PDF or ICS file
        alert("Calendar download feature would be implemented here");
    };

    const printCalendar = () => {
        window.print();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const today = new Date();

        const calendarDays = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDay(day);
            const isToday = today.getDate() === day && 
                           today.getMonth() === currentDate.getMonth() && 
                           today.getFullYear() === currentDate.getFullYear();

            calendarDays.push(
                <div 
                    key={day} 
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                >
                    <div className="day-number">{day}</div>
                    <div className="day-events">
                        {dayEvents.slice(0, 2).map(event => (
                            <div 
                                key={event.id}
                                className="event-indicator"
                                style={{ backgroundColor: getEventTypeColor(event.type) }}
                                onClick={() => handleEventClick(event)}
                                title={event.title}
                            >
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 2 && (
                            <div className="more-events">+{dayEvents.length - 2} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return calendarDays;
    };

    const upcomingEvents = academicEvents
        .filter(event => event.date >= new Date())
        .sort((a, b) => a.date - b.date)
        .slice(0, 5);

    return (
        <div className="calendar-page">
            <div className="calendar-container">
                {/* Header */}
                <div className="calendar-header">
                    <div className="header-content">
                        <h1>
                            <FaCalendarAlt className="header-icon" />
                            Academic Calendar {currentDate.getFullYear()}
                        </h1>
                        <p>Important dates and events for the academic year</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-secondary" onClick={downloadCalendar}>
                            <FaDownload /> Download
                        </button>
                        <button className="btn btn-secondary" onClick={printCalendar}>
                            <FaPrint /> Print
                        </button>
                    </div>
                </div>

                <div className="calendar-content">
                    {/* Calendar Navigation */}
                    <div className="calendar-navigation">
                        <div className="nav-controls">
                            <button 
                                className="nav-btn" 
                                onClick={() => navigateMonth(-1)}
                                aria-label="Previous month"
                            >
                                <FaChevronLeft />
                            </button>
                            <h2 className="current-month">
                                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <button 
                                className="nav-btn" 
                                onClick={() => navigateMonth(1)}
                                aria-label="Next month"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                        <button className="btn btn-primary" onClick={goToToday}>
                            Today
                        </button>
                    </div>

                    <div className="calendar-layout">
                        {/* Main Calendar */}
                        <div className="calendar-main">
                            <div className="calendar-grid">
                                {/* Day headers */}
                                {days.map(day => (
                                    <div key={day} className="day-header">{day}</div>
                                ))}
                                {/* Calendar days */}
                                {renderCalendar()}
                            </div>
                        </div>

                        {/* Sidebar - Upcoming Events */}
                        <div className="calendar-sidebar">
                            <div className="sidebar-section">
                                <h3>
                                    <IoMdSchool className="sidebar-icon" />
                                    Upcoming Events
                                </h3>
                                <div className="upcoming-events">
                                    {upcomingEvents.map(event => (
                                        <div 
                                            key={event.id} 
                                            className="upcoming-event"
                                            onClick={() => handleEventClick(event)}
                                        >
                                            <div 
                                                className="event-type-badge"
                                                style={{ backgroundColor: getEventTypeColor(event.type) }}
                                            >
                                                {getEventTypeLabel(event.type)}
                                            </div>
                                            <div className="event-details">
                                                <div className="event-title">{event.title}</div>
                                                <div className="event-date">
                                                    {event.date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="sidebar-section">
                                <h3>Event Types</h3>
                                <div className="event-legend">
                                    {Object.entries({
                                        academic: "Academic",
                                        break: "Break",
                                        event: "Event",
                                        meeting: "Meeting",
                                        ceremony: "Ceremony"
                                    }).map(([type, label]) => (
                                        <div key={type} className="legend-item">
                                            <div 
                                                className="legend-color"
                                                style={{ backgroundColor: getEventTypeColor(type) }}
                                            ></div>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Event Modal */}
                {selectedEvent && (
                    <div className="modal-overlay" onClick={closeEventModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{selectedEvent.title}</h3>
                                <button className="close-btn" onClick={closeEventModal}>×</button>
                            </div>
                            <div className="modal-body">
                                <div className="event-info">
                                    <div className="info-item">
                                        <strong>Date:</strong> 
                                        {selectedEvent.date.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div className="info-item">
                                        <strong>Type:</strong>
                                        <span 
                                            className="event-type-tag"
                                            style={{ backgroundColor: getEventTypeColor(selectedEvent.type) }}
                                        >
                                            {getEventTypeLabel(selectedEvent.type)}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <strong>Description:</strong>
                                        <p>{selectedEvent.description}</p>
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

export default Calendar;