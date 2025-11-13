// components/DynamicStats.jsx
import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaBookOpen, FaUsers, FaChartLine } from 'react-icons/fa';
import api from '../api/api';

const DynamicStats = () => {
  const [stats, setStats] = useState([]);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only the stats data
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/pages/home/stats');
        setStats(response.data || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Use default stats if API fails
        setStats([
          { number: "15", label: "Years Experience", icon: "graduation" },
          { number: "7", label: "Grades Offered", icon: "book" },
          { number: "200", label: "Pupils Enrolled", icon: "users" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    // Intersection Observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setAnimatedStats(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById('stats');
    if (statsSection) observer.observe(statsSection);

    return () => {
      if (statsSection) observer.unobserve(statsSection);
    };
  }, []);

  // Function to get the appropriate icon component
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'graduation': return <FaGraduationCap />;
      case 'book': return <FaBookOpen />;
      case 'users': return <FaUsers />;
      case 'chart': return <FaChartLine />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <section id="stats" className="stats-section">
        <div className="stats-grid">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon-wrapper">
                <div className="loading-spinner"></div>
              </div>
              <h3 className="stat-number">-</h3>
              <p className="stat-label">Loading...</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="stats" className="stats-section">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${animatedStats ? 'animate' : ''}`}>
            <div className="stat-icon-wrapper">
              {getIcon(stat.icon)}
            </div>
            <h3 className="stat-number">
              <span className="count-up" data-target={stat.number}>{stat.number}</span>
              {stat.suffix && <span>{stat.suffix}</span>}
            </h3>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default React.memo(DynamicStats);