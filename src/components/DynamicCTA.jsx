// components/DynamicCTA.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';

const DynamicCTA = () => {
  const [cta, setCTA] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only the CTA data
    const fetchCTA = async () => {
      try {
        setLoading(true);
        const response = await api.get('/pages/home/cta');
        setCTA(response.data || {});
      } catch (error) {
        console.error('Error fetching CTA:', error);
        // Use default CTA if API fails
        setCTA({
          title: "Ready to Join Our Community?",
          subtitle: `Applications for the ${new Date().getFullYear()}-${new Date().getFullYear() + 1} academic year are now open. Limited spaces available.`,
          buttons: [
            { text: "Start Application", link: "/admission" },
            { text: "Contact Admissions", link: "/contact" }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCTA();
  }, []);

  if (loading) {
    return (
      <section id="cta" className="cta-section">
        <div className="cta-content">
          <h2 className="home-section-title">Loading...</h2>
          <p className="cta-subtitle">Please wait...</p>
          <div className="cta-buttons">
            <div className="loading-button"></div>
            <div className="loading-button"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="cta" className="cta-section">
      <div className="cta-content">
        <h2 className="home-section-title">{cta.title}</h2>
        <p className="cta-subtitle">{cta.subtitle}</p>
        <div className="cta-buttons">
          {cta.buttons && cta.buttons.map((button, index) => (
            <Link
              key={index}
              to={button.link}
              className={`btn ${index === 0 ? 'btn-primary' : 'btn-secondary'}`}
              aria-label={button.text}
            >
              {button.text}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(DynamicCTA);