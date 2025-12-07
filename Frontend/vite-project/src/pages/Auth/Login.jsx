import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLinkedin,
  FaCalendarAlt,
  FaSignInAlt,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');

    const res = await login(formData.email, formData.password);
    setIsLoading(false);

    if (res.status) {
      setLoginSuccess(true);
      toast.success('Login successful');
      
      // Navigate based on user role
      if (res.user.role === 'organizer') {
        navigate('/dashboard');
      } else if (res.user.role === 'exhibitor') {
        navigate('/all-expos');
      } else {
        navigate('/home');
      }
    } else {
      setLoginError(res.message);
      toast.error(res.message);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="login-card glass-card-strong">
              <Row className="g-0">
                {/* Sidebar */}
                <Col lg={5} className="login-sidebar">
                  <div className="login-sidebar-content">
                    <div className="d-flex align-items-center mb-4">
                      <h4 className="mb-0 ms-0 fw-bold text-white">EventSphere</h4>
                    </div>
                    <h2 className="login-sidebar-title mb-3">Welcome Back!</h2>
                    <p className="login-sidebar-text mb-5">
                      Sign in to access your dashboard, manage events, and connect with the community.
                    </p>
                    
                    {/* Features List */}
                    <div className="login-features">
                      <div className="login-feature-item">
                        <div className="login-feature-icon">
                          <FaCheckCircle />
                        </div>
                        <div className="login-feature-text">
                          <span>Access your personalized dashboard</span>
                        </div>
                      </div>
                      <div className="login-feature-item">
                        <div className="login-feature-icon">
                          <FaCheckCircle />
                        </div>
                        <div className="login-feature-text">
                          <span>Manage event registrations</span>
                        </div>
                      </div>
                      <div className="login-feature-item">
                        <div className="login-feature-icon">
                          <FaCheckCircle />
                        </div>
                        <div className="login-feature-text">
                          <span>Connect with exhibitors & attendees</span>
                        </div>
                      </div>
                      <div className="login-feature-item">
                        <div className="login-feature-icon">
                          <FaCheckCircle />
                        </div>
                        <div className="login-feature-text">
                          <span>Real-time notifications & updates</span>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="login-sidebar-decoration">
                      <div className="decoration-circle decoration-circle-1"></div>
                      <div className="decoration-circle decoration-circle-2"></div>
                    </div>
                  </div>
                </Col>

                {/* Form Section */}
                <Col lg={7}>
                  <div className="login-form-container">
                    <div className="login-form-header">
                      <h3 className="login-form-title">Sign In</h3>
                      <p className="login-form-subtitle">
                        Enter your credentials to access your account
                      </p>
                    </div>

                    {/* Success Message */}
                    {loginSuccess && (
                      <Alert className="glass-alert-success d-flex align-items-center mb-4">
                        <FaCheckCircle className="me-2" />
                        Login successful! Redirecting to dashboard...
                      </Alert>
                    )}

                    {/* Error Message */}
                    {loginError && (
                      <Alert className="glass-alert-error d-flex align-items-center mb-4">
                        <FaExclamationCircle className="me-2" />
                        {loginError}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      {/* Email Field */}
                      <Form.Group className="mb-4">
                        <Form.Label className="login-form-label">
                          <FaEnvelope className="label-icon" />
                          Email Address
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className={`glass-form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={formData.email}
                          onChange={handleChange}
                          disabled={isLoading}
                        />
                        {errors.email && (
                          <div className="login-error">{errors.email}</div>
                        )}
                      </Form.Group>

                      {/* Password Field */}
                      <Form.Group className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <Form.Label className="login-form-label mb-0">
                            <FaLock className="label-icon" />
                            Password
                          </Form.Label>
                          <Link to="/forgot-password" className="login-forgot-link">
                            Forgot Password?
                          </Link>
                        </div>
                        <div className="password-input-wrapper">
                          <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            className={`glass-form-control ${errors.password ? 'is-invalid' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {errors.password && (
                          <div className="login-error">{errors.password}</div>
                        )}
                      </Form.Group>

                      {/* Remember Me */}
                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="login-checkbox"
                          label="Remember me for 30 days"
                          disabled={isLoading}
                        />
                      </Form.Group>

                      {/* Submit Button */}
                      <Button 
                        type="submit"
                        className="btn-glow w-100 login-submit-btn"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="login-loading">
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing in...
                          </span>
                        ) : (
                          <>
                            <FaSignInAlt className="me-2" />
                            Sign In
                          </>
                        )}
                      </Button>
                      {/* Register Link */}
                      <div className="login-register-link">
                        <p className="text-secondary-custom mb-0">
                          Don't have an account?{' '}
                          <Link to="/register" className="login-link">
                            Create an account
                          </Link>
                        </p>
                      </div>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;