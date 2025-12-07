import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa';

const EventCard = ({ event }) => {
  const { 
    title, 
    category, 
    date, 
    month, 
    location, 
    attendees, 
    time 
  } = event;

  const emojis = ['🎪', '🎭', '🎯', '🚀', '💡', '🌟', '🎨', '🔮'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <Card className="event-card h-100">
      <div className="event-image">
        <span style={{ fontSize: '4rem' }}>{randomEmoji}</span>
        <div className="event-date-badge">
          <div className="event-date-day">{date}</div>
          <div className="event-date-month">{month}</div>
        </div>
      </div>
      <Card.Body className="event-content">
        <Badge className="event-category">{category}</Badge>
        <h5 className="event-title text-white">{title}</h5>
        <div className="event-location mb-2">
          <FaMapMarkerAlt />
          <span>{location}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <span><FaUsers className="me-1" /> {attendees} attending</span>
          <span><FaClock className="me-1" /> {time}</span>
        </div>
        <div className="d-grid">
          <Button className="btn-glow">
            Register Now
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard;