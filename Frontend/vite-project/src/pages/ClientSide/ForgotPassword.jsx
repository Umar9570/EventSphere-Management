import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
  FaInbox,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();

  // States
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [canResend, setCanResend] = useState(false);

  // Timer for code expiry
  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return; // Only digits

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`code-${index + 1}`).focus();
    }

    if (error) setError('');
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`).focus();
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validateCode = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!newPassword) {
      setError('Password is required');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Step 1: Send Code
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/password-reset/send-code', { email });

      if (data.status) {
        toast.success('Reset code sent to your email');
        setStep(2);
        setTimeLeft(60);
        setCanResend(false);
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send reset code';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!validateCode()) return;

    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/password-reset/verify-code', {
        email,
        code: code.join('')
      });

      if (data.status) {
        toast.success('Code verified successfully');
        setStep(3);
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid or expired code';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/password-reset/reset-password', {
        email,
        code: code.join(''),
        newPassword
      });

      if (data.status) {
        toast.success('Password reset successfully! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to reset password';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Code
  const handleResend = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/password-reset/resend-code', { email });

      if (data.status) {
        toast.success('New code sent to your email');
        setCode(['', '', '', '']);
        setTimeLeft(60);
        setCanResend(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to resend code');
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
                      Don't worry! It happens to the best of us. Follow the steps to reset your password.
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
                          <span>Code expires in 1 minute</span>
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

                    {/* STEP 1: Email Input */}
                    {step === 1 && (
                      <>
                        <div className="forgot-password-form-header">
                          <div className="forgot-password-icon-wrapper">
                            <FaLock />
                          </div>
                          <h3 className="forgot-password-form-title">Forgot Password?</h3>
                          <p className="forgot-password-form-subtitle">
                            Enter your registered email address and we'll send you a 4-digit code to reset your password.
                          </p>
                        </div>

                        {error && (
                          <Alert className="glass-alert-error d-flex align-items-center mb-4">
                            <FaExclamationCircle className="me-2" />
                            {error}
                          </Alert>
                        )}

                        <Form onSubmit={handleSendCode}>
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
                              onChange={handleEmailChange}
                              disabled={isLoading}
                            />
                          </Form.Group>

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
                                Send Reset Code
                              </>
                            )}
                          </Button>
                        </Form>

                        <div className="forgot-password-register-link">
                          <p className="text-secondary-custom mb-0">
                            Remember your password?{' '}
                            <Link to="/login" className="forgot-password-link">
                              Sign In
                            </Link>
                          </p>
                        </div>
                      </>
                    )}

                    {/* STEP 2: Code Verification */}
                    {step === 2 && (
                      <>
                        <div className="forgot-password-form-header">
                          <div className="forgot-password-icon-wrapper">
                            <FaInbox />
                          </div>
                          <h3 className="forgot-password-form-title">Enter Verification Code</h3>
                          <p className="forgot-password-form-subtitle">
                            We've sent a 4-digit code to <strong>{email}</strong>
                          </p>
                        </div>

                        {error && (
                          <Alert className="glass-alert-error d-flex align-items-center mb-4">
                            <FaExclamationCircle className="me-2" />
                            {error}
                          </Alert>
                        )}

                        <Form onSubmit={handleVerifyCode}>
                          <Form.Group className="mb-4">
                            <Form.Label className="forgot-password-form-label text-center w-100">
                              Verification Code
                            </Form.Label>
                            <div className="code-input-container">
                              {code.map((digit, index) => (
                                <input
                                  key={index}
                                  id={`code-${index}`}
                                  type="text"
                                  maxLength="1"
                                  className="code-input"
                                  value={digit}
                                  onChange={(e) => handleCodeChange(index, e.target.value)}
                                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                  disabled={isLoading}
                                />
                              ))}
                            </div>
                          </Form.Group>

                          <div className="text-center mb-4">
                            {timeLeft > 0 ? (
                              <p className="text-muted-custom">
                                Code expires in <strong className="text-danger">{timeLeft}s</strong>
                              </p>
                            ) : (
                              <p className="text-danger">Code has expired!</p>
                            )}
                          </div>

                          <Button 
                            type="submit"
                            className="btn-glow w-100 mb-3"
                            size="lg"
                            disabled={isLoading || timeLeft === 0}
                          >
                            {isLoading ? (
                              <span className="forgot-password-loading">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Verifying...
                              </span>
                            ) : (
                              'Verify Code'
                            )}
                          </Button>

                          <Button 
                            className="btn-glass w-100"
                            onClick={handleResend}
                            disabled={isLoading || !canResend}
                          >
                            {isLoading ? 'Resending...' : canResend ? 'Resend Code' : `Resend in ${timeLeft}s`}
                          </Button>
                        </Form>

                        <div className="forgot-password-register-link">
                          <p className="text-secondary-custom mb-0">
                            Wrong email?{' '}
                            <button 
                              className="forgot-password-link-btn"
                              onClick={() => {
                                setStep(1);
                                setEmail('');
                                setCode(['', '', '', '']);
                                setError('');
                              }}
                            >
                              Try again
                            </button>
                          </p>
                        </div>
                      </>
                    )}

                    {/* STEP 3: New Password */}
                    {step === 3 && (
                      <>
                        <div className="forgot-password-form-header">
                          <div className="forgot-password-icon-wrapper">
                            <FaCheckCircle style={{ color: '#28a745' }} />
                          </div>
                          <h3 className="forgot-password-form-title">Create New Password</h3>
                          <p className="forgot-password-form-subtitle">
                            Choose a strong password to secure your account
                          </p>
                        </div>

                        {error && (
                          <Alert className="glass-alert-error d-flex align-items-center mb-4">
                            <FaExclamationCircle className="me-2" />
                            {error}
                          </Alert>
                        )}

                        <Form onSubmit={handleResetPassword}>
                          <Form.Group className="mb-3">
                            <Form.Label className="forgot-password-form-label">
                              <FaLock className="label-icon" />
                              New Password
                            </Form.Label>
                            <div className="password-input-wrapper">
                              <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                className="glass-form-control"
                                value={newPassword}
                                onChange={(e) => {
                                  setNewPassword(e.target.value);
                                  if (error) setError('');
                                }}
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <Form.Label className="forgot-password-form-label">
                              <FaLock className="label-icon" />
                              Confirm Password
                            </Form.Label>
                            <div className="password-input-wrapper">
                              <Form.Control
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                className="glass-form-control"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  if (error) setError('');
                                }}
                                disabled={isLoading}
                              />
                              <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                          </Form.Group>

                          <Button 
                            type="submit"
                            className="btn-glow w-100"
                            size="lg"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="forgot-password-loading">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Resetting Password...
                              </span>
                            ) : (
                              <>
                                <FaCheckCircle className="me-2" />
                                Reset Password
                              </>
                            )}
                          </Button>
                        </Form>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Additional Styles for Code Input */}
      <style jsx>{`
        .code-input-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
        }

        .code-input {
          width: 60px;
          height: 60px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          color: #fff;
          transition: all 0.3s ease;
        }

        .code-input:focus {
          outline: none;
          border-color: #1099a8;
          background: rgba(16, 153, 168, 0.1);
          box-shadow: 0 0 0 3px rgba(16, 153, 168, 0.1);
        }

        .code-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .forgot-password-link-btn {
          background: none;
          border: none;
          color: #1099a8;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          font-weight: 600;
        }

        .forgot-password-link-btn:hover {
          color: #0d7480;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;