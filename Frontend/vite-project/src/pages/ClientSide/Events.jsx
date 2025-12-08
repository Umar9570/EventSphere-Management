import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const Events = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [expos, setExpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registering, setRegistering] = useState(null);
  const [userRegistrations, setUserRegistrations] = useState([]);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Format time for display (e.g., "09:00" -> "9:00 AM")
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Check if expo is in the past
  const isPastExpo = (expoDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expo = new Date(expoDate);
    expo.setHours(0, 0, 0, 0);
    return expo < today;
  };

  // Fetch expos
  const fetchExpos = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/expos');
      if (data.status) {
        // Sort by date (newest first)
        const sorted = data.expos.sort((a, b) => new Date(b.date) - new Date(a.date));
        setExpos(sorted);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchExpos();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRegistrations();
    }
  }, [user]);

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

  // Filter expos based on search
  const filteredExpos = expos.filter(expo => {
    const matchesSearch = expo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expo.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Get month abbreviation
  const getMonthAbbr = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date(date).getMonth()];
  };

  // Get day
  const getDay = (date) => {
    return new Date(date).getDate().toString().padStart(2, '0');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="text-muted mt-3">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero-section">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="text-white display-4 fw-bold mb-4">
                Discover Events
              </h1>
              <p className="events-hero-subtitle lead mb-4">
                Browse our curated collection of expos, trade shows, and conferences
                across various industries.
              </p>

              {/* Search Box */}
              <div className="glass-card p-4">
                <Row className="justify-content-between g-3">
                  <Col md={8}>
                    <InputGroup className="glass-input-group">
                      <InputGroup.Text className="glass-input-icon">
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search events or locations..."
                        className="glass-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <Button className="btn-glow w-100 h-100">
                      <FaSearch className="me-2" />
                      Search
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Events Listing */}
      <section className="events-listing-section">
        <Container>
          {/* Filter Bar */}
          <div className="events-filter-bar d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <p className="mb-0 text-secondary-custom">
                Showing <strong className="text-primary-custom">{filteredExpos.length}</strong> events
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          {/* Events Grid */}
          {filteredExpos.length > 0 ? (
            <Row className="g-4">
              {filteredExpos.map((expo) => {
                const isPast = isPastExpo(expo.date);
                const isRegistered = isUserRegistered(expo._id);
                const isRegisteringThis = registering === expo._id;

                return (
                  <Col lg={4} md={6} key={expo._id}>
                    <div className="glass-card event-card h-100">
                      <div className="event-card-image">
                        <span className="event-card-emoji">🎪</span>
                        <div className="event-date-badge glass-card-strong">
                          <div className="event-date-day">{getDay(expo.date)}</div>
                          <div className="event-date-month">{getMonthAbbr(expo.date)}</div>
                        </div>
                      </div>
                      <div className="event-card-content">
                        {isPast ? (
                          <span className="event-category-badge" style={{ backgroundColor: '#6c757d' }}>
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
                            <small className="text-muted">This event has ended</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <div className="no-events-container text-center py-5">
              <div className="mb-3">
                <FaCalendarAlt size={48} className="text-muted-custom" />
              </div>
              <h4 className="text-primary-custom">No events found</h4>
              <p className="text-secondary-custom">Try adjusting your search criteria</p>
              <Button
                className="btn-glass"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredExpos.length > 0 && filteredExpos.length >= 9 && (
            <div className="text-center mt-5">
              <Button className="btn-outline-glow" disabled>
                All Events Loaded
              </Button>
            </div>
          )}
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
    </div>
  );
};

export default Events;