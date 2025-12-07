import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaPaperPlane,
  FaShieldAlt,
  FaKey,
  FaLock,
  FaInbox
} from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Password reset email sent to:', email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Password reset email resent to:', email);
      // Show resend success (could add a toast notification here)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <div className="forgot-password-card glass-card-strong">
              <Row className="g-0">
                {/* Sidebar */}
                <Col lg={5} className="forgot-password-sidebar">
                  <div className="forgot-password-sidebar-content">
                    <div className="d-flex align-items-center mb-4">
                      <h4 className="mb-0 ms-0 fw-bold text-white">EventSphere</h4>
                    </div>
                    <h2 className="forgot-password-sidebar-title mb-3">Reset Your Password</h2>
                    <p className="forgot-password-sidebar-text mb-5">
                      Don't worry! It happens to the best of us. Enter your email and we'll send you a reset link.
                    </p>
                    
                    {/* Security Features */}
                    <div className="forgot-password-features">
                      <div className="forgot-password-feature-item">
                        <div className="forgot-password-feature-icon">
                          <FaShieldAlt />
                        </div>
                        <div className="forgot-password-feature-text">
                          <span>Secure password reset process</span>
                        </div>
                      </div>
                      <div className="forgot-password-feature-item">
                        <div className="forgot-password-feature-icon">
                          <FaKey />
                        </div>
                        <div className="forgot-password-feature-text">
                          <span>Link expires in 24 hours</span>
                        </div>
                      </div>
                      <div className="forgot-password-feature-item">
                        <div className="forgot-password-feature-icon">
                          <FaLock />
                        </div>
                        <div className="forgot-password-feature-text">
                          <span>End-to-end encryption</span>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="forgot-password-sidebar-decoration">
                      <div className="decoration-circle decoration-circle-1"></div>
                      <div className="decoration-circle decoration-circle-2"></div>
                    </div>
                  </div>
                </Col>

                {/* Form Section */}
                <Col lg={7}>
                  <div className="forgot-password-form-container">
                    {/* Back to Login Link */}
                    <Link to="/login" className="forgot-password-back-link">
                      <FaArrowLeft className="me-2" />
                      Back to Login
                    </Link>

                    {!isSubmitted ? (
                      <>
                        {/* Form Header */}
                        <div className="forgot-password-form-header">
                          <div className="forgot-password-icon-wrapper">
                            <FaLock />
                          </div>
                          <h3 className="forgot-password-form-title">Forgot Password?</h3>
                          <p className="forgot-password-form-subtitle">
                            No worries! Enter your registered email address and we'll send you instructions to reset your password.
                          </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                          <Alert className="glass-alert-error d-flex align-items-center mb-4">
                            <FaExclamationCircle className="me-2" />
                            {error}
                          </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                          {/* Email Field */}
                          <Form.Group className="mb-4">
                            <Form.Label className="forgot-password-form-label">
                              <FaEnvelope className="label-icon" />
                              Email Address
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter your registered email"
                              className={`glass-form-control ${error ? 'is-invalid' : ''}`}
                              value={email}
                              onChange={handleChange}
                              disabled={isLoading}
                            />
                          </Form.Group>

                          {/* Submit Button */}
                          <Button 
                            type="submit"
                            className="btn-glow w-100 forgot-password-submit-btn"
                            size="lg"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="forgot-password-loading">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                              </span>
                            ) : (
                              <>
                                <FaPaperPlane className="me-2" />
                                Send Reset Link
                              </>
                            )}
                          </Button>
                        </Form>

                        {/* Register Link */}
                        <div className="forgot-password-register-link">
                          <p className="text-secondary-custom mb-0">
                            Remember your password?{' '}
                            <Link to="/login" className="forgot-password-link">
                              Sign In
                            </Link>
                          </p>
                          <p className="text-secondary-custom mb-0 mt-2">
                            Don't have an account?{' '}
                            <Link to="/register" className="forgot-password-link">
                              Create Account
                            </Link>
                          </p>
                        </div>
                      </>
                    ) : (
                      /* Success State */
                      <div className="forgot-password-success">
                        <div className="forgot-password-success-icon">
                          <FaInbox />
                        </div>
                        <h3 className="forgot-password-success-title">Check Your Email</h3>
                        <p className="forgot-password-success-text">
                          We've sent a password reset link to:
                        </p>
                        <div className="forgot-password-email-badge">
                          <FaEnvelope className="me-2" />
                          {email}
                        </div>
                        <p className="forgot-password-success-note">
                          Click the link in the email to reset your password. If you don't see it, check your spam folder.
                        </p>

                        <div className="forgot-password-success-actions">
                          <Button 
                            className="btn-glow w-100 mb-3"
                            size="lg"
                            onClick={() => window.open('https://mail.google.com', '_blank')}
                          >
                            <FaEnvelope className="me-2" />
                            Open Email App
                          </Button>
                          
                          <Button 
                            className="btn-glass w-100"
                            onClick={handleResend}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="forgot-password-loading">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Resending...
                              </span>
                            ) : (
                              'Resend Email'
                            )}
                          </Button>
                        </div>

                        <div className="forgot-password-success-footer">
                          <p className="text-muted-custom mb-0">
                            Wrong email?{' '}
                            <button 
                              className="forgot-password-link-btn"
                              onClick={() => {
                                setIsSubmitted(false);
                                setEmail('');
                              }}
                            >
                              Try again
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
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

export default ForgotPassword;