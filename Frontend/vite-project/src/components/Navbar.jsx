import React, { useState, useEffect, useContext } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaBars, 
  FaUser, 
  FaSignInAlt,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom toggle for profile dropdown
  const ProfileToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  ));

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

          {/* Desktop Auth Buttons / Profile */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle as={ProfileToggle}>
                  <div className="profile-icon-wrapper">
                    <FaUserCircle size={35} className="profile-icon" />
                    <span className="profile-name ms-2">{user.firstName}</span>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="profile-dropdown-menu">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-avatar">
                      <FaUserCircle size={40} />
                    </div>
                    <div className="profile-dropdown-info">
                      <div className="profile-dropdown-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="profile-dropdown-email">{user.email}</div>
                    </div>
                  </div>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="profile-dropdown-item logout-item">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
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
              </>
            )}
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

          {/* Mobile Auth Buttons / Profile */}
          <div className="mt-4">
            {user ? (
              <>
                <div className="profile-mobile-info mb-3 p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div className="d-flex align-items-center mb-2">
                    <FaUserCircle size={40} className="text-white me-2" />
                    <div>
                      <div className="text-white fw-bold">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-white-50 small">{user.email}</div>
                    </div>
                  </div>
                </div>
                <Button 
                  className="btn-glass w-100" 
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="d-grid gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  className="btn-glass"
                  onClick={handleClose}
                >
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
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Profile Dropdown Styles */}
      <style>{`
        .profile-icon-wrapper {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 50px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .profile-icon-wrapper:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .profile-icon {
          color: #fff;
          transition: all 0.3s ease;
        }

        .profile-name {
          color: #fff;
          font-weight: 600;
          font-size: 14px;
        }

        .profile-dropdown-menu {
          min-width: 280px;
          padding: 0;
          border: none;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          margin-top: 10px;
          overflow: hidden;
        }

        .profile-dropdown-header {
          display: flex;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #1099a8 0%, #0d7480 100%);
          color: white;
        }

        .profile-dropdown-avatar {
          margin-right: 12px;
          color: white;
        }

        .profile-dropdown-info {
          flex: 1;
        }

        .profile-dropdown-name {
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 4px;
          color: white;
        }

        .profile-dropdown-email {
          font-size: 13px;
          opacity: 0.9;
          color: rgba(255, 255, 255, 0.9);
        }

        .profile-dropdown-item {
          padding: 12px 20px;
          font-size: 14px;
          color: #333;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }

        .profile-dropdown-item:hover {
          background: rgba(16, 153, 168, 0.1);
          color: #1099a8;
        }

        .logout-item {
          color: #dc3545;
        }

        .logout-item:hover {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
        }

        .dropdown-divider {
          margin: 0;
          border-color: rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 991px) {
          .profile-mobile-info {
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </>
  );
};

export default NavigationBar;