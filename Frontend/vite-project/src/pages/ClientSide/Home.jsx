import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Spinner, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
  FaHandshake,
  FaCheckCircle
} from 'react-icons/fa';
import GradientText from '../../components/GradientText/GradientText';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [expos, setExpos] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExpos: 0,
    totalUsers: 0,
    nearestExpo: null,
    upcomingExpos: []
  });
  const [registering, setRegistering] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Default expo image
  const defaultExpoImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop";

  // Format time for display (e.g., "09:00" -> "9:00 AM")
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Check if expo is in the future
  const isFutureExpo = (expoDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expo = new Date(expoDate);
    expo.setHours(0, 0, 0, 0);
    return expo >= today;
  };

  // Check if expo is in the past
  const isPastExpo = (expoDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expo = new Date(expoDate);
    expo.setHours(0, 0, 0, 0);
    return expo < today;
  };

  // Get days until expo
  const getDaysUntil = (expoDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expo = new Date(expoDate);
    expo.setHours(0, 0, 0, 0);
    const diffTime = expo - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get month abbreviation
  const getMonthAbbr = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date(date).getMonth()];
  };

  // Get day
  const getDay = (date) => {
    return new Date(date).getDate().toString().padStart(2, '0');
  };

  // Check if user is registered for an expo
  const isUserRegistered = (expoId) => {
    return userRegistrations.some(reg => reg.expo._id === expoId);
  };

  // Handle registration
  const handleRegister = async (expoId) => {
    // Check if user is logged in
    if (!user) {
      toast.info('Please login to register for events');
      navigate('/login');
      return;
    }

    // Check if already registered
    if (isUserRegistered(expoId)) {
      toast.info('You are already registered for this event');
      return;
    }

    try {
      setRegistering(expoId);

      const { data } = await api.post('/event-registration/register', {
        userId: user.id,
        expoId: expoId
      });

      if (data.status) {
        toast.success('Registration successful! Check your email for the QR code.');
        setRegistrationData(data.registration);
        setShowSuccessModal(true);
        fetchUserRegistrations(); // Refresh registrations
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.response?.data?.message || 'Failed to register for event';
      toast.error(errorMsg);
    } finally {
      setRegistering(null);
    }
  };

  // Fetch user registrations
  const fetchUserRegistrations = async () => {
    if (!user?.id) return;

    try {
      const { data } = await api.get(`/event-registration/user/${user.id}`);
      if (data.status) {
        setUserRegistrations(data.registrations);
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    }
  };

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch expos
      const { data: exposData } = await api.get('/expos');
      
      // Fetch users count
      const { data: usersData } = await api.get('/auth/users/count');

      if (exposData.status) {
        const allExpos = exposData.expos;
        setExpos(allExpos);

        // Filter upcoming expos
        const upcoming = allExpos.filter(expo => isFutureExpo(expo.date));
        
        // Sort upcoming by date (nearest first)
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Get nearest upcoming expo
        const nearest = upcoming.length > 0 ? upcoming[0] : null;

        // Get top 3 upcoming expos for cards (full expo objects)
        const upcomingCards = upcoming.slice(0, 3);

        setStats({
          totalExpos: allExpos.length,
          totalUsers: usersData.count || 0,
          nearestExpo: nearest,
          upcomingExpos: upcomingCards
        });

        setUsersCount(usersData.count || 0);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

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

  const statsDisplay = [
    { number: `${stats.totalExpos}+`, label: 'Events Organized' },
    { number: `${stats.totalUsers.toLocaleString()}+`, label: 'Total Registrations' },
    { number: `${expos.filter(e => isFutureExpo(e.date)).length}`, label: 'Upcoming Events' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="text-light mt-3">Loading...</p>
      </div>
    );
  }

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
                {user ? (<Button 
                  as={Link} 
                  to="/events" 
                  className="btn-glow"
                  size="lg"
                >
                  Get Started
                </Button>):(
                  <Button 
                  as={Link} 
                  to="/register" 
                  className="btn-glow"
                  size="lg"
                >
                  Get Started
                </Button>
                )
                }
              </div>
            </Col>
            <Col lg={6} className="hero-image d-none d-lg-block" data-aos="fade-left">
              <div className="floating-card">
                <Row className="g-3 justify-content-center">
                  <Col xs={5} className="event-card mx-1">
                    <div className="text-center p-3 rounded-3" data-aos="fade-up" data-aos-delay="100">
                      <h3 className="text-success mb-1">{stats.totalExpos}</h3>
                      <small className="text-light">Total Events Held</small>
                    </div>
                  </Col>
                  <Col xs={5} className="event-card mx-1">
                    <div className="text-center p-3 rounded-3" data-aos="fade-up" data-aos-delay="200">
                      <h3 className="text-warning mb-1">{stats.totalUsers > 1000 ? `${(stats.totalUsers / 1000).toFixed(1)}K` : stats.totalUsers}</h3>
                      <small className="text-light">Total Registrations</small>
                    </div>
                  </Col>
                  <Col xs={10} className="event-card">
                    <div className="p-3 rounded-3" data-aos="fade-up" data-aos-delay="300">
                      {stats.nearestExpo ? (
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <small className='' style={{color: '#ffffffbd', fontSize: '12px'}}>Upcoming Event</small>
                            <h6 className="mb-1 mt-2">{stats.nearestExpo.name}</h6>
                            <small className="text-light">
                              {getDaysUntil(stats.nearestExpo.date) === 0 
                                ? 'Today!' 
                                : getDaysUntil(stats.nearestExpo.date) === 1
                                ? 'Tomorrow'
                                : `In ${getDaysUntil(stats.nearestExpo.date)} days`
                              }
                            </small>
                          </div>
                          <div className="text-info-emphasis">
                            <FaCalendarCheck size={24} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <small className="text-light">No upcoming events</small>
                        </div>
                      )}
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
            {statsDisplay.map((stat, index) => (
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
          {stats.upcomingExpos.length > 0 ? (
            <Row className="g-4">
              {stats.upcomingExpos.map((expo, index) => {
                const isPast = isPastExpo(expo.date);
                const isRegistered = isUserRegistered(expo._id);
                const isRegisteringThis = registering === expo._id;

                return (
                  <Col lg={4} md={6} key={expo._id} data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="glass-card event-card h-100">
                      <div className="event-card-image">
                        <img 
                          src={expo.image || defaultExpoImage} 
                          alt={expo.name}
                          className="event-card-img"
                          onError={(e) => {
                            e.target.src = defaultExpoImage;
                          }}
                        />
                        <div className="event-card-image-overlay"></div>
                        <div className="event-date-badge glass-card-strong">
                          <div className="event-date-day">{getDay(expo.date)}</div>
                          <div className="event-date-month">{getMonthAbbr(expo.date)}</div>
                        </div>
                      </div>
                      <div className="event-card-content">
                        {isPast ? (
                          <span className="event-category-badge" style={{ backgroundColor: '#6c757d9c' }}>
                            Past Event
                          </span>
                        ) : isRegistered ? (
                          <span className="event-category-badge" style={{color: '#00ad26ff', backgroundColor: '#546458a8', borderColor: '#00c40048'}}>
                            Registered ✓
                          </span>
                        ) : (
                          <span className="event-category-badge">Upcoming</span>
                        )}
                        <h5 className="event-card-title">{expo.name}</h5>
                        <p className="text-light small mb-3" style={{ minHeight: '40px' }}>
                          {expo.description || 'No description available'}
                        </p>
                        <div className="event-card-location">
                          <FaMapMarkerAlt className="location-icon" />
                          <span>{expo.location}</span>
                        </div>
                        <div className="event-card-meta">
                          <span className="meta-item">
                            <FaUsers /> {expo.exhibitors?.length || 0} Exhibitors
                          </span>
                          <span className="meta-item">
                            <FaClock /> {formatTime(expo.startTime)} - {formatTime(expo.endTime)}
                          </span>
                        </div>
                        {!isPast && !isRegistered && (
                          <Button 
                            className="btn-glow w-100"
                            onClick={() => handleRegister(expo._id)}
                            disabled={isRegisteringThis}
                          >
                            {isRegisteringThis ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Registering...
                              </>
                            ) : (
                              'Register Now'
                            )}
                          </Button>
                        )}
                        {!isPast && isRegistered && (
                          <Button className="btn-glass w-100" disabled>
                            <FaCheckCircle className="me-2" />
                            Already Registered
                          </Button>
                        )}
                        {isPast && (
                          <div className="text-center py-2">
                            <small className="text-light">This event has ended</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <div className="text-center py-5">
              <FaCalendarCheck size={48} className="text-muted mb-3" />
              <p className="text-muted">No upcoming events at the moment</p>
            </div>
          )}
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
                {!user ? (<Button 
                  as={Link} 
                  to="/register" 
                  size="lg"
                  className="btn-glow px-4"
                >
                  Register
                </Button>): ('')}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Registration Successful!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <div className="mb-3">
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              backgroundColor: '#28a745', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto' 
            }}>
              <FaCheckCircle size={40} color="white" />
            </div>
          </div>
          <h5 className="mb-3">You're all set!</h5>
          <p className="text-muted mb-4">
            We've sent your event QR code to your email. Present it at the event entrance to mark your attendance.
          </p>
          {registrationData?.qrCodeImage && (
            <div className="mb-3">
              <img 
                src={registrationData.qrCodeImage} 
                alt="QR Code" 
                style={{ maxWidth: '200px', border: '2px solid #1099a8', borderRadius: '10px', padding: '10px' }}
              />
              <p className="text-muted small mt-2">Save this QR code or check your email</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Additional Styles for Image */}
      <style>{`
        .event-card-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .event-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .event-card:hover .event-card-img {
          transform: scale(1.05);
        }

        .event-card-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

export default Home;