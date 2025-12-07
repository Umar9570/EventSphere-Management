import React, { useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaTh, FaList, FaUsers, FaClock } from 'react-icons/fa';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    'All', 'Technology', 'Healthcare', 'Finance', 'Education',
    'Manufacturing', 'Retail', 'Environment', 'Food & Beverage'
  ];

  const events = [
    {
      id: 1,
      title: 'Tech Innovation Expo 2024',
      category: 'Technology',
      date: '15',
      month: 'Mar',
      location: 'San Francisco, CA',
      attendees: '5,000+',
      time: '9:00 AM - 6:00 PM',
      description: 'Join the largest technology expo featuring AI, IoT, and emerging tech.'
    },
    {
      id: 2,
      title: 'Global Health Summit',
      category: 'Healthcare',
      date: '22',
      month: 'Mar',
      location: 'New York, NY',
      attendees: '3,200+',
      time: '10:00 AM - 5:00 PM',
      description: 'Connect with healthcare professionals and discover medical innovations.'
    },
    {
      id: 3,
      title: 'Sustainable Future Conference',
      category: 'Environment',
      date: '05',
      month: 'Apr',
      location: 'Seattle, WA',
      attendees: '2,800+',
      time: '8:00 AM - 4:00 PM',
      description: 'Explore sustainable solutions and green technology innovations.'
    },
    {
      id: 4,
      title: 'FinTech World Expo',
      category: 'Finance',
      date: '12',
      month: 'Apr',
      location: 'Chicago, IL',
      attendees: '4,500+',
      time: '9:00 AM - 5:00 PM',
      description: 'Discover the latest in financial technology and digital banking.'
    },
    {
      id: 5,
      title: 'EdTech Innovation Summit',
      category: 'Education',
      date: '18',
      month: 'Apr',
      location: 'Boston, MA',
      attendees: '2,100+',
      time: '10:00 AM - 4:00 PM',
      description: 'Transform education with cutting-edge learning technologies.'
    },
    {
      id: 6,
      title: 'Manufacturing 4.0 Expo',
      category: 'Manufacturing',
      date: '25',
      month: 'Apr',
      location: 'Detroit, MI',
      attendees: '3,800+',
      time: '8:00 AM - 5:00 PM',
      description: 'Explore automation, robotics, and smart manufacturing solutions.'
    },
    {
      id: 7,
      title: 'Retail Innovation Show',
      category: 'Retail',
      date: '02',
      month: 'May',
      location: 'Las Vegas, NV',
      attendees: '6,000+',
      time: '9:00 AM - 6:00 PM',
      description: 'The future of retail, e-commerce, and customer experience.'
    },
    {
      id: 8,
      title: 'Food & Beverage Trade Show',
      category: 'Food & Beverage',
      date: '10',
      month: 'May',
      location: 'Miami, FL',
      attendees: '4,200+',
      time: '10:00 AM - 5:00 PM',
      description: 'Taste the future of food innovation and beverage trends.'
    },
    {
      id: 9,
      title: 'AI & Machine Learning Summit',
      category: 'Technology',
      date: '18',
      month: 'May',
      location: 'Austin, TX',
      attendees: '3,500+',
      time: '9:00 AM - 5:00 PM',
      description: 'Deep dive into artificial intelligence and machine learning.'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

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
                Showing <strong className="text-primary-custom">{filteredEvents.length}</strong> events
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-muted-custom me-2">View:</span>
              <button
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FaTh />
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FaList />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="category-pills mb-4">
            {categories.map((cat, index) => (
              <span
                key={index}
                className={`filter-chip ${
                  selectedCategory === cat.toLowerCase() ||
                  (cat === 'All' && selectedCategory === 'all')
                    ? 'active'
                    : ''
                }`}
                onClick={() => setSelectedCategory(cat === 'All' ? 'all' : cat.toLowerCase())}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <Row className="g-4">
              {filteredEvents.map((event) => (
                <Col lg={4} md={6} key={event.id}>
                  <div className="glass-card event-card h-100">
                    <div className="event-card-image">
                      <span className="event-card-emoji">🎪</span>
                      <div className="event-date-badge glass-card-strong">
                        <div className="event-date-day">{event.date}</div>
                        <div className="event-date-month">{event.month}</div>
                      </div>
                    </div>
                    <div className="event-card-content">
                      <span className="event-category-badge">{event.category}</span>
                      <h5 className="event-card-title">{event.title}</h5>
                      <div className="event-card-location">
                        <FaMapMarkerAlt className="location-icon" />
                        <span>{event.location}</span>
                      </div>
                      <div className="event-card-meta">
                        <span className="meta-item">
                          <FaUsers /> {event.attendees}
                        </span>
                        <span className="meta-item">
                          <FaClock /> {event.time}
                        </span>
                      </div>
                      <Button className="btn-glow w-100">
                        Register Now
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="no-events-container text-center py-5">
              <div className="mb-3">
                <FaCalendarAlt size={48} className="text-muted-custom" />
              </div>
              <h4 className="text-primary-custom">No events found</h4>
              <p className="text-secondary-custom">Try adjusting your search or filter criteria</p>
              <Button
                className="btn-glass"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Load More */}
          {filteredEvents.length > 0 && (
            <div className="text-center mt-5">
              <Button className="btn-outline-glow">
                Load More Events
              </Button>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default Events;