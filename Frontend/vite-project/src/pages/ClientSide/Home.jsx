import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaCalendarCheck, 
  FaUsers, 
  FaChartLine, 
  FaComments,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaSearch,
  FaBell,
  FaHandshake
} from 'react-icons/fa';
import EventCard from '../../components/EventCard';
import GradientText from '../../components/GradientText/GradientText';

const Home = () => {
  const features = [
    {
      icon: <FaCalendarCheck />,
      title: 'Easy Registration',
      description: 'Seamless registration process for attendees, exhibitors, and organizers with role-based access.'
    },
    {
      icon: <FaSearch />,
      title: 'Smart Search',
      description: 'Find exhibitors, sessions, and events easily with our powerful search and filter capabilities.'
    },
    {
      icon: <FaComments />,
      title: 'Real-time Communication',
      description: 'Connect with exhibitors and attendees through integrated chat and messaging features.'
    },
    {
      icon: <FaBell />,
      title: 'Smart Notifications',
      description: 'Stay updated with personalized reminders for sessions, meetings, and important updates.'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Interactive Floor Plans',
      description: 'Navigate expo venues easily with detailed interactive floor plans and booth locations.'
    },
    {
      icon: <FaHandshake />,
      title: 'Networking Tools',
      description: 'Schedule appointments and connect with potential partners, clients, and collaborators.'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Tech Innovation Expo 2024',
      category: 'Technology',
      date: '15',
      month: 'Mar',
      location: 'San Francisco, CA',
      attendees: '5,000+',
      time: '9:00 AM - 6:00 PM'
    },
    {
      title: 'Global Health Summit',
      category: 'Healthcare',
      date: '22',
      month: 'Mar',
      location: 'New York, NY',
      attendees: '3,200+',
      time: '10:00 AM - 5:00 PM'
    },
    {
      title: 'Sustainable Future Conference',
      category: 'Environment',
      date: '05',
      month: 'Apr',
      location: 'Seattle, WA',
      attendees: '2,800+',
      time: '8:00 AM - 4:00 PM'
    }
  ];

  const stats = [
    { number: '500+', label: 'Events Organized' },
    { number: '50,000+', label: 'Attendees Connected' },
    { number: '2,000+', label: 'Exhibitors' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section" data-aos="fade-up">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-content" data-aos="fade-right">
              <h1 className="hero-title">
                Transform Your
                <br />
                <GradientText data-aos="fade-up">Expo Experience</GradientText>
              </h1>
              <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
                The complete event management platform that connects organizers, 
                exhibitors, and attendees. Streamline your events with powerful 
                tools and real-time insights.
              </p>
              <div className="d-flex gap-3 flex-wrap" data-aos="fade-up" data-aos-delay="400">
                <Button 
                  as={Link} 
                  to="/events" 
                  className="btn-glass"
                  size="lg"
                >
                  Explore Events
                  <FaArrowRight className="ms-2" />
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  className="btn-glow"
                  size="lg"
                >
                  Get Started
                </Button>
              </div>
            </Col>
            <Col lg={6} className="hero-image d-none d-lg-block" data-aos="fade-left">
              <div className="floating-card">
                <Row className="g-3 justify-content-center">
                  <Col xs={5} className="event-card mx-1" >
                    <div className="text-center p-3 rounded-3" data-aos="fade-up" data-aos-delay="100">
                      <h3 className="text-success mb-1">156</h3>
                      <small className="text-light">Active Events</small>
                    </div>
                  </Col>
                  <Col xs={5} className="event-card mx-1">
                    <div className="text-center p-3 rounded-3"  data-aos="fade-up" data-aos-delay="200">
                      <h3 className="text-warning mb-1">12.5K</h3>
                      <small className="text-light">Registrations</small>
                    </div>
                  </Col>
                  <Col xs={10} className="event-card">
                    <div className="p-3 rounded-3" data-aos="fade-up" data-aos-delay="300">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1">Tech Summit 2024</h6>
                          <small className="text-light">Starting in 2 days</small>
                        </div>
                        <div className="text-info-emphasis">
                          <FaCalendarCheck size={24} />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section" data-aos="fade-up">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col md={3} sm={6} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="section-padding" data-aos="fade-up">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">Why Choose EventSphere?</h2>
            <p className="section-subtitle">
              Everything you need to manage successful expos and trade shows, 
              all in one powerful platform.
            </p>
          </div>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col lg={4} md={6} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="feature-card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-text">{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Upcoming Events Section */}
      <section className="section-padding" data-aos="fade-up">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-5" data-aos="fade-up">
            <div>
              <h2 className="section-title mb-3">Upcoming Events</h2>
              <p className="text-light mb-3">Discover exciting expos and trade shows</p>
            </div>
            <Button 
              as={Link} 
              to="/events" 
              className="btn-glass d-none d-md-inline-flex"
            >
              View All Events <FaArrowRight className="ms-2" />
            </Button>
          </div>
          <Row className="g-4">
            {upcomingEvents.map((event, index) => (
              <Col lg={4} md={6} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <EventCard event={event} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4 d-md-none" data-aos="fade-up">
            <Button 
              as={Link} 
              to="/events" 
              className="btn-glass"
            >
              View All Events <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="section-padding" data-aos="fade-up">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center text-white" data-aos="fade-up">
              <h2 className="display-5 fw-bold mb-3">
                Ready to Transform Your Event Experience?
              </h2>
              <p className="lead mb-4 opacity-75">
                Join thousands of organizers, exhibitors, and attendees who are 
                already using EventSphere to create memorable events.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap" data-aos="fade-up">
                <Button 
                  as={Link} 
                  to="/events" 
                  className="btn-glass"
                  size="lg"
                >
                  View Events
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  size="lg"
                  className="btn-glow px-4"
                >
                  Register
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;
