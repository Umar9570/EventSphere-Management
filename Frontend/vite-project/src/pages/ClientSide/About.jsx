import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaRocket, 
  FaEye, 
  FaHeart,
  FaAward,
  FaGlobe,
  FaUsers,
  FaLightbulb,
  FaShieldAlt
} from 'react-icons/fa';

const About = () => {
  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', initials: 'SJ' },
    { name: 'Michael Chen', role: 'CTO', initials: 'MC' },
    { name: 'Emily Rodriguez', role: 'Head of Operations', initials: 'ER' },
    { name: 'David Kim', role: 'Lead Developer', initials: 'DK' }
  ];

  const values = [
    {
      icon: <FaLightbulb />,
      title: 'Innovation',
      description: 'Constantly pushing boundaries to deliver cutting-edge solutions.'
    },
    {
      icon: <FaUsers />,
      title: 'Collaboration',
      description: 'Building strong partnerships with our clients and community.'
    },
    {
      icon: <FaHeart />,
      title: 'Passion',
      description: 'Dedicated to creating exceptional event experiences.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Integrity',
      description: 'Maintaining the highest standards of honesty and transparency.'
    }
  ];

  const milestones = [
    { year: '2018', event: 'EventSphere Founded', description: 'Started with a vision to revolutionize event management.' },
    { year: '2019', event: 'First Major Expo', description: 'Successfully managed our first large-scale trade show.' },
    { year: '2021', event: 'Global Expansion', description: 'Expanded operations to 15+ countries worldwide.' },
    { year: '2023', event: '500+ Events', description: 'Reached milestone of 500+ successfully organized events.' }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero-section" data-aos="fade-up">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8} data-aos="fade-up">
              <h1 className="about-hero-title display-4 fw-bold mb-4" data-aos="fade-up">About EventSphere</h1>
              <p className="about-hero-subtitle lead" data-aos="fade-up" data-aos-delay="200">
                We're on a mission to transform how expos and trade shows are 
                organized, experienced, and remembered. Our platform connects 
                people, ideas, and opportunities.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="about-section" data-aos="fade-up">
        <Container>
          <Row className="g-4">
            <Col md={6} data-aos="fade-right">
              <div className="glass-card h-100 p-4">
                <div className="about-icon-box mb-4" data-aos="zoom-in">
                  <FaRocket />
                </div>
                <h3 className="text-primary-custom mb-3" data-aos="fade-up">Our Mission</h3>
                <p className="text-secondary-custom mb-0" data-aos="fade-up" data-aos-delay="200">
                  To empower event organizers, exhibitors, and attendees with 
                  innovative technology that simplifies event management and 
                  creates meaningful connections. We believe in making every 
                  expo experience seamless, engaging, and impactful.
                </p>
              </div>
            </Col>
            <Col md={6} data-aos="fade-left">
              <div className="glass-card h-100 p-4">
                <div className="about-icon-box about-icon-box-alt mb-4" data-aos="zoom-in">
                  <FaEye />
                </div>
                <h3 className="text-primary-custom mb-3" data-aos="fade-up">Our Vision</h3>
                <p className="text-secondary-custom mb-0" data-aos="fade-up" data-aos-delay="200">
                  To become the world's leading event management platform, 
                  setting new standards for how trade shows and expos are 
                  organized and experienced. We envision a future where 
                  technology enhances every aspect of event participation.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Our Story */}
      <section className="about-section about-story-section" data-aos="fade-up">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} data-aos="fade-right">
              <h2 className="about-section-title" data-aos="fade-up">Our Story</h2>
              <p className="text-secondary-custom mb-4" data-aos="fade-up" data-aos-delay="100">
                EventSphere was born from a simple observation: traditional expo 
                management was fragmented, inefficient, and frustrating for everyone 
                involved. Our founders, experienced event professionals, envisioned 
                a better way.
              </p>
              <p className="text-secondary-custom mb-4" data-aos="fade-up" data-aos-delay="200">
                In 2018, we launched EventSphere with a clear goal – to create a 
                unified platform that would streamline every aspect of expo management. 
                From registration to real-time communication, floor plan navigation 
                to analytics, we built tools that actually work.
              </p>
              <p className="text-secondary-custom mb-0" data-aos="fade-up" data-aos-delay="300">
                Today, we're proud to serve thousands of event organizers, exhibitors, 
                and attendees worldwide. Our platform has facilitated countless 
                connections, deals, and memorable experiences.
              </p>
            </Col>
            <Col lg={6} data-aos="fade-left">
              <div className="ps-lg-5 mt-5 mt-lg-0">
                {milestones.map((milestone, index) => (
                  <div key={index} className="milestone-item d-flex mb-4" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="me-4">
                      <div className="milestone-year">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="glass-card milestone-content p-3 flex-grow-1">
                      <h5 className="text-primary-custom mb-1">{milestone.event}</h5>
                      <p className="text-secondary-custom mb-0 small">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Core Values */}
      <section className="about-section" data-aos="fade-up">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="about-section-title" data-aos="fade-up">Our Core Values</h2>
            <p className="about-section-subtitle" data-aos="fade-up" data-aos-delay="200">
              The principles that guide everything we do
            </p>
          </div>
          <Row className="g-4">
            {values.map((value, index) => (
              <Col md={6} lg={3} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="glass-card text-center p-4 h-100">
                  <div className="about-icon-box mx-auto mb-3" data-aos="zoom-in">
                    {value.icon}
                  </div>
                  <h5 className="text-primary-custom mb-2">{value.title}</h5>
                  <p className="text-secondary-custom mb-0 small">{value.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Team Section */}
      <section className="about-section about-team-section" data-aos="fade-up">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="about-section-title">Meet Our Team</h2>
            <p className="about-section-subtitle" data-aos="fade-up" data-aos-delay="200">
              The passionate people behind EventSphere
            </p>
          </div>
          <Row className="g-4 justify-content-center">
            {team.map((member, index) => (
              <Col lg={3} md={4} sm={6} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="glass-card text-center p-4 h-100">
                  <div className="team-avatar-glass mx-auto mb-3" data-aos="zoom-in">
                    {member.initials}
                  </div>
                  <h5 className="text-primary-custom mb-1">{member.name}</h5>
                  <p className="team-role-text mb-0">{member.role}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Achievements */}
      <section className="about-stats-section" data-aos="fade-up">
        <Container>
          <div className="glass-card-strong p-5" data-aos="fade-up">
            <Row className="text-center">
              <Col md={3} sm={6} className="mb-4 mb-md-0" data-aos="fade-up" data-aos-delay="0">
                <div className="about-stat-item">
                  <FaAward className="about-stat-icon mb-3" />
                  <div className="about-stat-number">25+</div>
                  <div className="about-stat-label">Industry Awards</div>
                </div>
              </Col>
              <Col md={3} sm={6} className="mb-4 mb-md-0" data-aos="fade-up" data-aos-delay="100">
                <div className="about-stat-item">
                  <FaGlobe className="about-stat-icon mb-3" />
                  <div className="about-stat-number">30+</div>
                  <div className="about-stat-label">Countries Served</div>
                </div>
              </Col>
              <Col md={3} sm={6} data-aos="fade-up" data-aos-delay="200">
                <div className="about-stat-item">
                  <FaUsers className="about-stat-icon mb-3" />
                  <div className="about-stat-number">100+</div>
                  <div className="about-stat-label">Team Members</div>
                </div>
              </Col>
              <Col md={3} sm={6} data-aos="fade-up" data-aos-delay="300">
                <div className="about-stat-item">
                  <FaHeart className="about-stat-icon mb-3" />
                  <div className="about-stat-number">98%</div>
                  <div className="about-stat-label">Client Satisfaction</div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default About;