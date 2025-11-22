import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faTiktok
} from '@fortawesome/free-brands-svg-icons';
import {
  FaSchool,
  FaChalkboardTeacher,
  FaHeart,
  FaShieldAlt,
  FaGraduationCap,
  FaBook,
  FaUserFriends,
  FaClipboardCheck,
  FaCalendarAlt,
  FaPhone,
  FaBus,
  FaRunning,
  FaSwimmer,
  FaMusic,
  FaLaptop,
  FaAppleAlt,
  FaUserShield,
  FaClock,
  FaExclamationTriangle,
  FaHome,
  FaGift,
  FaUserSecret,
  FaFileAlt,
  FaPalette,
  FaBirthdayCake,
  FaHandshake,
  FaChevronDown,
  FaQuoteLeft,
  FaQuoteRight
} from 'react-icons/fa';
import '../styles/AboutPage.css';

// TabButton component for better code organization
const TabButton = ({ tab, isActive, onClick }) => {
  return (
    <button
      className={`tab-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(tab.id)}
    >
      <span className="tab-icon">{tab.icon}</span>
      <span className="tab-label">{tab.label}</span>
    </button>
  );
};

// ContentCard component for consistent styling
const ContentCard = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`content-card ${className}`}>
      {title && (
        <h3 className="card-title">
          {icon && <span className="card-icon">{icon}</span>}
          {title}
        </h3>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};

// PolicyCard component for policy sections
const PolicyCard = ({ title, icon, children }) => {
  return (
    <div className="policy-card">
      <h3 className="policy-title">
        <span className="policy-icon">{icon}</span>
        {title}
      </h3>
      <div className="policy-content">{children}</div>
    </div>
  );
};

// ActivityCard component for activities section
const ActivityCard = ({ icon, title, description }) => {
  return (
    <div className="activity-card">
      <div className="activity-icon-container">
        <span className="activity-icon">{icon}</span>
      </div>
      <h3 className="activity-title">{title}</h3>
      <p className="activity-description">{description}</p>
    </div>
  );
};

// Testimonial component for quotes
const Testimonial = ({ text, author }) => {
  return (
    <div className="testimonial">
      <FaQuoteLeft className="quote-icon quote-left" />
      <p className="testimonial-text">{text}</p>
      <FaQuoteRight className="quote-icon quote-right" />
      <p className="testimonial-author">- {author}</p>
    </div>
  );
};

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('ownership');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for tab navigation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'ownership', label: 'Ownership', icon: <FaUserShield /> },
    { id: 'background', label: 'Background', icon: <FaSchool /> },
    { id: 'policies', label: 'Policies', icon: <FaShieldAlt /> },
    { id: 'philosophy', label: 'Philosophy & Aims', icon: <FaHeart /> },
    { id: 'curriculum', label: 'Curriculum', icon: <FaBook /> },
    { id: 'activities', label: 'Activities', icon: <FaRunning /> },
    { id: 'parent-info', label: 'Parent Information', icon: <FaUserFriends /> }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="about-hero-title">Literacy Tree School</h1>
          <p className="hero-subtitle">
            Quality childcare and education you can afford,<br />
            trusted for 15+ years.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years of Excellence</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Dedicated Staff</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Students</span>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <FaChevronDown className="scroll-icon" />
        </div>
      </section>

      {/* Tab Navigation */}
      <section className={`tab-navigation ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="tab-buttons">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={setActiveTab}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-section">
        <div className="container">
          {/* Ownership Section */}
          {activeTab === 'ownership' && (
            <div className="content-panel">
              <h2 className="section-title">
                <FaUserShield className="title-icon" /> Ownership
              </h2>
              <ContentCard>
                <p className="content-text">
                  Pickey Ponkey – Literacy Tree School is privately run by Edith B Kasandwe with the aim of providing the highest quality of childcare, early and primary education at affordable fees. We know you and your child will enjoy the time with us, and we sincerely hope to become part of your family.
                </p>
                <Testimonial 
                  text="Our commitment to excellence in education is unwavering. We believe every child deserves the best start in life."
                  author="Edith B Kasandwe, School Director"
                />
              </ContentCard>
            </div>
          )}

          {/* Background Section */}
          {activeTab === 'background' && (
            <div className="content-panel">
              <h2 className="section-title">
                <FaSchool className="title-icon" /> Background
              </h2>
              <ContentCard>
                <p className="content-text">
                  Literacy Tree School has been a great human conduit for over 10 years. We receive children from early years of Nursery, through Reception to Primary education. Our learners continue to receive unmatched quality teaching each academic year. We are greatly committed to the quality of education received by our individual learners.
                </p>
                <p className="content-text">
                  We value high and low achieving learners and accord multi-ability to individuals as well as groups, learning opportunities equitably; in our whole-embracing school climate and culture.
                </p>
                <p className="content-text">
                  We are proud of our goals, guidelines and commitment to Early Childhood Education and Primary Education. The future of children in our care and the future of the global community that we are all part of. We are fully aware of the enormous responsibility that we have in providing the best possible care physically, emotionally, socially and morally for children and families who are in our care. We honor the fact that parents have chosen our school for their child's early years of learning. When children graduate from Pickey Ponkey – Literacy Tree School, we want them to leave as confident, independent individuals with good self-esteem. We want them to trust who they are and know that they have the potential to go forward in their lives and achieve whatever they aspire to be.
                </p>
                <p className="content-text">
                  Watching our young aces enter our school from early years and later exit with excellent results at the end of seventh grade continue to motivate us.
                </p>
              </ContentCard>
            </div>
          )}

          {/* Policies Section */}
          {activeTab === 'policies' && (
            <div className="content-panel">
              <h2 className="section-title">
                <FaShieldAlt className="title-icon" /> School Policies
              </h2>

              <PolicyCard title="Zero Tolerance on Bullying" icon={<FaExclamationTriangle />}>
                <p className="policy-text">
                  We do not tolerate bullying or discrimination in any form. The policy of the school is to prevent bullying and discrimination from taking place, to stop it if it does take place and deal with incidents if they occur.
                </p>
                <p className="policy-text">
                  In accordance with the Official School Policy. No corporal punishment is allowed by any staff member of a school. As time-out does not work for all offenses.
                </p>
              </PolicyCard>

              <PolicyCard title="School Policy" icon={<FaHeart />}>
                <p className="policy-text">
                  We would like our school to be a place where everyone feels safe and respected. As such, a child has the right to:
                </p>
                <ul className="policy-list">
                  <li>Feel safe (emotionally and physically)</li>
                  <li>Learn, work and play without fear of being hurt or humiliated</li>
                  <li>A sense of belonging, acceptance and friendship</li>
                  <li>Ask for help in stopping hurtful behavior</li>
                  <li>Learn to solve problems with others in a helpful way</li>
                  <li>Be treated politely and with respect by others</li>
                </ul>
              </PolicyCard>

              <PolicyCard title="Dressing" icon={<FaUserShield />}>
                <p className="policy-text">
                  Children are to be dressed appropriately at all times! This is especially important concerning girls, in order to give the respect all children deserve.
                </p>
              </PolicyCard>
            </div>
          )}

          {/* Philosophy & Aims Section */}
          {activeTab === 'philosophy' && (
            <div className="content-panel">
              <h2 className="section-title">
                <FaHeart className="title-icon" /> School Philosophy & Aims
              </h2>

              <PolicyCard title="School Philosophy" icon={<FaGraduationCap />}>
                <p className="policy-text">
                  The philosophy of our program is for each child to be encouraged in their creative, cognitive, and social abilities. The child's individuality and independence will be nurtured in a loving and kind atmosphere. Our motivation will be to have your child learn to share, cooperate and form trusting relationships with his/her peers and teachers alike. The school aims to provide a safe and happy environment for your child.
                </p>
              </PolicyCard>

              <PolicyCard title="School Aims" icon={<FaClipboardCheck />}>
                <p className="policy-text">
                  Our aim is to create an environment of excellence, and give each child the very best opportunities possible to grow and develop in a safe and nurturing environment. We do everything possible to ensure that every child in our care will develop and realize their full potential, and thus make the best possible use of their lives.
                </p>
                <p className="policy-text">
                  We strive to create an atmosphere that encourages responsibility, self-discipline, and a positive self-image. A balance is constantly maintained by providing a vigorous play environment.
                </p>
                <p className="policy-text">
                  To meet these aims, our enthusiastic, highly skilled staff have vast experience in child care and look after small groups of children enjoying up-to-date toys and modern learning equipment.
                </p>
                <p className="policy-text">
                  Our extra moral activities include songs, poetry, dance and our inter-class sports day. We have an annual concert that all our children participate in, with our little one's concert on the same day. Our graduates enjoy the graduation ceremony in gowns, hats and certificates all thrown in. They are always so excited when this day comes around, and it is a very special treat to watch.
                </p>
              </PolicyCard>

              <PolicyCard title="Our Mission" icon={<FaHeart />}>
                <p className="policy-text">
                  We believe that each child is an individual with his/her own unique temperament, needs, interests and abilities; we try to be aware of the uniqueness of each child in encouraging their interest, fostering their abilities and in meeting their needs for integral growth.
                </p>
              </PolicyCard>

              <PolicyCard title="Core Values" icon={<FaUserFriends />}>
                <div className="values-grid">
                  <div className="value-item">
                    <span className="value-icon">🤝</span>
                    <span className="value-text">We are partners</span>
                  </div>
                  <div className="value-item">
                    <span className="value-icon">❤️</span>
                    <span className="value-text">We value our learners</span>
                  </div>
                  <div className="value-item">
                    <span className="value-icon">🎯</span>
                    <span className="value-text">We are committed</span>
                  </div>
                  <div className="value-item">
                    <span className="value-icon">👂</span>
                    <span className="value-text">We are responsive</span>
                  </div>
                </div>
              </PolicyCard>
            </div>
          )}

          {/* Curriculum Section */}
          {activeTab === 'curriculum' && (
            <div className="content-panel">
              <h2 className="section-title">
                <FaBook className="title-icon" /> The Curriculum
              </h2>
              <ContentCard>
                <p className="content-text">
                  In the creation of our curriculum, we have included deals and philosophies of many childhood theorists as well as new up-to-date information about children and their potential and ability to learn in their early years. We have also taken into consideration the importance of both academics and emotions and socialization of children in their early years. Our commitment to children in our care is to provide materials and a learning environment together with exceptional, skilled, loving and caring teachers who are qualified educators.
                </p>
                <p className="content-text">
                  The basics of our Curriculum follow the notion that:
                </p>
                <div className="curriculum-grid">
                  <div className="curriculum-item">
                    <span className="curriculum-icon">💬</span>
                    <span className="curriculum-text">The child is communicating</span>
                  </div>
                  <div className="curriculum-item">
                    <span className="curriculum-icon">🎨</span>
                    <span className="curriculum-text">The child is creating</span>
                  </div>
                  <div className="curriculum-item">
                    <span className="curriculum-icon">👥</span>
                    <span className="curriculum-text">The child is socializing</span>
                  </div>
                  <div className="curriculum-item">
                    <span className="curriculum-icon">🏃</span>
                    <span className="curriculum-text">The child is physical and active</span>
                  </div>
                  <div className="curriculum-item">
                    <span className="curriculum-icon">🧠</span>
                    <span className="curriculum-text">The child is thinking, investigating, exploring and problem solving</span>
                  </div>
                  <div className="curriculum-item">
                    <span className="curriculum-icon">😊</span>
                    <span className="curriculum-text">The child has feelings and is emotional</span>
                  </div>
                  <div className="curriculum-item">
                    <span className="curriculum-icon">🙏</span>
                    <span className="curriculum-text">The child is spiritual and has morals</span>
                  </div>
                </div>
                <p className="content-text">
                  The programme in each classroom is designed by teachers who work closely together with directors in order to fulfil the philosophy and "live soul" of the school each day, taking into consideration the age of the children.
                </p>
                <p className="content-text">
                  The child is aspiring to follow these essential qualities: open mindedness, good communicator, well balanced, principled, risk taker, thinker, caring, knowledgeable, reflective, inquirer, curious, appreciative, emphatic, independent, respectful, committed, enthusiastic, and tolerant.
                </p>
              </ContentCard>

              <ContentCard title="We Offer" className="offer-card">
                <div className="offer-grid">
                  <div className="offer-item">
                    <FaBook className="offer-icon" />
                    <span>Intensive reading</span>
                  </div>
                  <div className="offer-item">
                    <FaClipboardCheck className="offer-icon" />
                    <span>Improve test scores</span>
                  </div>
                  <div className="offer-item">
                    <FaHome className="offer-icon" />
                    <span>Homework help</span>
                  </div>
                  <div className="offer-item">
                    <FaGraduationCap className="offer-icon" />
                    <span>Math and reading</span>
                  </div>
                  <div className="offer-item">
                    <FaUserFriends className="offer-icon" />
                    <span>Study group</span>
                  </div>
                  <div className="offer-item">
                    <FaChalkboardTeacher className="offer-icon" />
                    <span>Individual tutoring</span>
                  </div>
                </div>
              </ContentCard>
            </div>
          )}

          {/* Activities Section */}
          {activeTab === 'activities' && (
            <div className="content-panel">
              <h2 className="section-title">
                <FaRunning className="title-icon" /> Extra Curriculum Activities
              </h2>
              <div className="activities-grid">
                <ActivityCard
                  icon={<FaRunning />}
                  title="Ball Games"
                  description="Various sports activities to develop physical skills and teamwork"
                />
                <ActivityCard
                  icon={<FaRunning />}
                  title="Floor Games"
                  description="Indoor games that promote strategic thinking and coordination"
                />
                <ActivityCard
                  icon={<FaSwimmer />}
                  title="Swimming"
                  description="Swimming lessons to develop water safety and physical fitness"
                />
                <ActivityCard
                  icon={<FaBus />}
                  title="Trips"
                  description="Educational field trips to enhance learning experiences"
                />
                <ActivityCard
                  icon={<FaMusic />}
                  title="Music"
                  description="Music lessons to develop creativity and cultural appreciation"
                />
                <ActivityCard
                  icon={<FaLaptop />}
                  title="Computer"
                  description="Computer skills development for the digital age"
                />
              </div>
            </div>
          )}

          {/* Parent Information Section */}
          {activeTab === 'parent-info' && (
            <div className="content-panel">
              <h2 className="section-title">
                <FaUserFriends className="title-icon" /> Parent Information
              </h2>

              <PolicyCard title="Sick Children" icon={<FaAppleAlt />}>
                <p className="policy-text">
                  Parents are required to assist us in preventing cross infection of our children and therefore, we have implemented the following rules:
                </p>
                <ul className="policy-list">
                  <li>No medicine will be administered without written permission from parents. You need to write the name and dosage of the medication in the back of the homework book.</li>
                  <li>Children with eye infections, obvious contagious illness, runny tummies or vomiting are not permitted at school.</li>
                  <li>If a child is prescribed an antibiotic they are not permitted at school for the first 48 hours.</li>
                </ul>
              </PolicyCard>

              <PolicyCard title="Parents Rules" icon={<FaClock />}>
                <h4 className="policy-subtitle">Late Pickups</h4>
                <ul className="policy-list">
                  <li>Please note school hours are from 07:00hrs - 12:00hrs for nursery and 15:00hrs for primary. Any child being collected after closing times will be charged an additional fee of K50.00 for every 30 minutes or part thereof that parents come late.</li>
                  <li>Late coming and honking: When a child is brought in, kindly avoid honking for this distracts the atmosphere of learning.</li>
                </ul>
                <h4 className="policy-subtitle">Payment of fees</h4>
                <ul className="policy-list">
                  <li>Fees are to be paid on or before the 1st day of every term, or during the first week of the school term.</li>
                </ul>
              </PolicyCard>

              <PolicyCard title="Open Day" icon={<FaHandshake />}>
                <p className="policy-text">
                  Parental support is important for all children as they benefit from plenty of praise and encouragement whilst learning. Research has shown that children, whose parents take time to attend school activities, check homework books have their IQ develop fast because they feel accompanied and they know that their parents do care about their school progress.
                </p>
              </PolicyCard>

              <PolicyCard title="Field Trip" icon={<FaBus />}>
                <p className="policy-text">
                  Field trips are educational activities out of the school environment, related to lessons taught especially in moral, social and environmental education which enable children to widen their horizon and relate what they learn in class to reality.
                </p>
              </PolicyCard>

              <PolicyCard title="Assessment" icon={<FaClipboardCheck />}>
                <p className="policy-text">
                  Assessment of children is not based on age but on ability to write and identify letters and numbers. Ability to formulate, blend and identify sounds in words. For example, if a child is 6 years and cannot write, read, identify numbers, shapes and colors that child will start / remain in lower class. However, if a child is 5 and his/her performance is very good that child can be moved to a higher level.
                </p>
              </PolicyCard>

              <PolicyCard title="Nutrition" icon={<FaAppleAlt />}>
                <p className="policy-text">
                  Nutrition is an important factor in the formal learning process of a child. Good nutrition promotes healthier bodies and healthier children are more successful in school and learn more efficiently and their concentration capacity is enhanced.
                </p>
              </PolicyCard>

              <PolicyCard title="Discipline" icon={<FaUserShield />}>
                <p className="policy-text">
                  Charity begins at home, so is discipline. We are quite firm in discipline and discourage fighting and bad language. We want children to understand right from wrong. Our policy is to talk through problems.
                </p>
              </PolicyCard>

              <PolicyCard title="Homework Books" icon={<FaBook />}>
                <p className="policy-text">
                  Do not append your signature on work that you have not done with the child. Do not submit aided homework, instead accompany a child and understand his/her progression.
                </p>
              </PolicyCard>

              <PolicyCard title="Exercise Book" icon={<FaBook />}>
                <p className="policy-text">
                  Exercise books for the nursery section are kept at school because our experience has shown that when books are taken home they are either lost or come back in a different form.
                </p>
              </PolicyCard>

              <PolicyCard title="Marking of Clothes, Shoes and Bags" icon={<FaClipboardCheck />}>
                <p className="policy-text">
                  Please note that it is the parent's responsibility to mark your children's things. Parents are also requested to encourage their children to keep their things in their school bag. This encourages your child to become responsible for his/her things. If you find things in your child's bag that doesn't belong to you please be so kind as to return them to school as soon as possible.
                </p>
              </PolicyCard>

              <PolicyCard title="Toys, Sweets and Party Packs" icon={<FaGift />}>
                <p className="policy-text">
                  Please try to keep toys, balloons, gum and candy at home, as these can be very disruptive to their focus and concentration.
                </p>
              </PolicyCard>

              <PolicyCard title="Stranger Danger" icon={<FaUserSecret />}>
                <p className="policy-text">
                  No child will be allowed to go home by persons unknown to the staff. Should your child have to be collected by someone else, it is the responsibility of the parents to supply the school with written permission as well as the ID number of the person collecting. This will also include persons doing transport for your child.
                </p>
              </PolicyCard>

              <PolicyCard title="Withdraw Notice" icon={<FaFileAlt />}>
                <p className="policy-text">
                  Please note that the school requires a one-month withdraw notice for pre-school and a three-month withdraw notice for primary school children, as we have already budgeted for your child being with us. If you're moving or changing your telephone number or any relevant details, please be sure to notify the school.
                </p>
              </PolicyCard>

              <PolicyCard title="Absenteeism" icon={<FaPhone />}>
                <p className="policy-text">
                  Please inform the school when a child is unable to attend school on a particular day, due to illness or any other reasons. The school telephone number is 0977845317 /0966845317.
                </p>
              </PolicyCard>

              <PolicyCard title="Worksheets" icon={<FaPalette />}>
                <p className="policy-text">
                  Please ensure to collect your child's artwork when a notice is given. Our emphasis during art is on the process and not the product.
                </p>
              </PolicyCard>

              <PolicyCard title="Reminders for All Parents" icon={<FaBirthdayCake />}>
                <p className="policy-text">
                  Our school celebrates birthdays. The children enjoy celebrating their special day with all their classmates. If you would like, you may bring in a birthday cake on your child's birthday. Please notify a teacher if you plan to do this. Gifts can only be exchanged within the class of each child, not the entire school. Birthday calendars will be circulated.
                </p>
              </PolicyCard>

              <PolicyCard title="Special Events for You to Remember" icon={<FaCalendarAlt />}>
                <ul className="policy-list">
                  <li>Our Parent Interactive Day. Share ideas on how to improve the school and have a great time together.</li>
                  <li>Our School Concert will be held on your child's last day of school in December. This is a celebration that all family is invited to. We do ask that if possible both parents must attend, as this is a celebration.</li>
                  <li>Every two years, we go on a field trip. This is great fun as learners experience.</li>
                  <li>Our last to remember is our graduation that is held on your child's completion of Pre-school and upper primary education in December. This is another celebration that all the LTS family is on board. Once again, parents must be present.</li>
                </ul>
                <p className="policy-text">
                  What a busy year to look forward to!
                  May we also remind all parents that they are free to come in and be part of our program. Please feel free to share any ideas or suggestions you may have that can be incorporated into our themes.
                  If you have any problems or concerns, please do not hesitate to talk to any one of us.
                  Thank you!!
                </p>
              </PolicyCard>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Contact Us</h2>
          <div className="contact-info">
            <div className="contact-item">
              <span>0977845317 / 0966845317</span>
            </div>
            <div className="contact-item">
              <span>Pickey Ponkey – Literacy Tree School</span>
            </div>
          </div>

          {/* Working Hours */}
          <div className="contact-hours">
            <h3 className="hours-title">School Hours</h3>
            <div className="hours-item">
              <span>Nursery:</span>
              <span>07:00 - 12:00</span>
            </div>
            <div className="hours-item">
              <span>Primary Section:</span>
              <span>07:30 - 15:00</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="contact-social">
            <h3 className="social-title">Follow Us</h3>
            <div className="social-links">
              <a href="https://web.facebook.com/profile.php?id=100054527196325" className="social-link facebook" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://www.tiktok.com/@literacy.tree.scho?lang=en" className="social-link tiktok" aria-label="Tiktok">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href="https://www.instagram.com/literacytreeschool/" className="social-link instagram" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://www.youtube.com/@LiteracyTreeSchool" className="social-link youtube" aria-label="Youtube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;