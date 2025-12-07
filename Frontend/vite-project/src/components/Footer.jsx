import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-glass">
      <Container>
        <Row className="g-5 justify-content-center">
          <Col lg={4} md={6}>
            <div className="footer-brand d-flex align-items-center gap-2">
              <FaCalendarAlt />
              EventSphere
            </div>
            <p className="footer-text mb-4">
              Revolutionizing the expo experience with cutting-edge technology. 
              Connect, engage, and grow with our comprehensive event management platform.
            </p>
            <div className="footer-social">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaLinkedinIn /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="footer-title">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </Col>

          <Col lg={4} md={6}>
            <h5 className="footer-title">Contact Info</h5>
            <ul className="footer-links">
              <li className="d-flex align-items-start gap-2 mb-3">
                <FaMapMarkerAlt className="mt-1" style={{ color: 'var(--primary-light)' }} />
                <span>123 Event Street, Tech City, TC 12345</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-3">
                <FaPhone style={{ color: 'var(--primary-light)' }} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope style={{ color: 'var(--primary-light)' }} />
                <span>info@eventsphere.com</span>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="footer-bottom">
          <Row className="align-items-center">
            <Col md={6} className="text-md-start mb-3 mb-md-0">
              <p className="mb-0">
                © {new Date().getFullYear()} EventSphere Management. All rights reserved.
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;