import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaBars, 
  FaUser, 
  FaSignInAlt 
} from 'react-icons/fa';

const NavigationBar = () => {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar 
        expand="lg" 
        fixed="top" 
        className={`navbar-glass ${scrolled ? 'scrolled' : ''}`}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="navbar-brand-glow">
            EventSphere
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Nav className="mx-auto d-none d-lg-flex">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-glass ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/events" 
              className={`nav-link-glass ${isActive('/events') ? 'active' : ''}`}
            >
              Events
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={`nav-link-glass ${isActive('/about') ? 'active' : ''}`}
            >
              About Us
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              className={`nav-link-glass ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Nav.Link>
          </Nav>

          {/* Desktop Auth Buttons */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            <Button as={Link} to="/login" className="btn-glass">
              <FaSignInAlt className="me-2" />
              Login
            </Button>
            <Button 
              as={Link} 
              to="/register" 
              className="btn-glow"
            >
              <FaUser className="me-2" />
              Register
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button 
            className="btn-glass d-lg-none border-0 px-3"
            onClick={handleShow}
          >
            <FaBars size={20} />
          </Button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="navbar-brand-glow">
            <FaCalendarAlt className="me-2" />
            EventSphere
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link 
              as={Link} 
              to="/" 
              onClick={handleClose}
              className="py-3 text-white border-bottom border-secondary"
            >
              Home
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/events" 
              onClick={handleClose}
              className="py-3 text-white border-bottom border-secondary"
            >
              Events
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              onClick={handleClose}
              className="py-3 text-white border-bottom border-secondary"
            >
              About Us
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contact" 
              onClick={handleClose}
              className="py-3 text-white border-bottom border-secondary"
            >
              Contact
            </Nav.Link>
          </Nav>
          <div className="mt-4 d-grid gap-2">
            <Button className="btn-glass">
              <FaSignInAlt className="me-2" />
              Login
            </Button>
            <Button 
              as={Link} 
              to="/register" 
              className="btn-glow"
              onClick={handleClose}
            >
              <FaUser className="me-2" />
              Register
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavigationBar;