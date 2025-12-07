import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaBuilding,
  FaUsers,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLinkedin,
  FaCalendarAlt,
  FaPhone,
  FaArrowLeft
} from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const roles = [
    {
      id: 'attendee',
      icon: <FaUsers />,
      title: 'Attendee',
      description: 'Browse events, connect with exhibitors, and manage your schedule'
    },
    {
      id: 'exhibitor',
      icon: <FaBuilding />,
      title: 'Exhibitor',
      description: 'Showcase your products, manage booth, and connect with attendees'
    }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleRoleSelect = (roleId) => {
    setFormData({ ...formData, role: roleId });
    setStep(2);
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Dynamic API endpoint based on role
      let endpoint = '/auth/register/attendee';
      if (formData.role === 'exhibitor') endpoint = '/auth/register/exhibitor';

      // Prepare the data to send (excluding confirmPassword)
      const submitData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      };

      const { data } = await api.post(endpoint, submitData);
      
      if (data.status) {
        toast.success('Registration successful! You can now log in.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 25) return 'danger';
    if (strength <= 50) return 'warning';
    if (strength <= 75) return 'info';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength <= 25) return 'Weak';
    if (strength <= 50) return 'Fair';
    if (strength <= 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="register-page">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} xl={10}>
            <div className="register-card glass-card-strong">
              <Row className="g-0">
                {/* Sidebar */}
                <Col lg={5} className="register-sidebar">
                  <div className="register-sidebar-content">
                    <div className="d-flex align-items-center mb-4">
                      <h4 className="mb-0 ms-0 fw-bold text-white">EventSphere</h4>
                    </div>
                    <h2 className="register-sidebar-title mb-3">Join Our Community</h2>
                    <p className="register-sidebar-text mb-5">
                      Create an account to access all features of our event management platform.
                    </p>
                    
                    {/* Progress Steps */}
                    <div className="register-steps">
                      <div className={`register-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="register-step-number">
                          {step > 1 ? <FaCheck /> : '1'}
                        </div>
                        <div className="register-step-content">
                          <div className="register-step-title">Select Role</div>
                          <div className="register-step-subtitle">Choose your account type</div>
                        </div>
                      </div>
                      <div className={`register-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="register-step-number">
                          {step > 2 ? <FaCheck /> : '2'}
                        </div>
                        <div className="register-step-content">
                          <div className="register-step-title">Account Details</div>
                          <div className="register-step-subtitle">Enter your information</div>
                        </div>
                      </div>
                      <div className={`register-step ${step >= 3 ? 'active' : ''}`}>
                        <div className="register-step-number">
                          {step > 3 ? <FaCheck /> : '3'}
                        </div>
                        <div className="register-step-content">
                          <div className="register-step-title">Complete</div>
                          <div className="register-step-subtitle">Review and confirm</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* Form Section */}
                <Col lg={7}>
                  <div className="register-form-container">
                    {/* Step 1: Role Selection */}
                    {step === 1 && (
                      <div className="register-step-content-area">
                        <h3 className="register-form-title">Create Your Account</h3>
                        <p className="register-form-subtitle">Select how you'll be using EventSphere</p>
                        
                        <div className="role-options">
                          {roles.map((role) => (
                            <div 
                              key={role.id}
                              className={`role-option-card glass-card ${formData.role === role.id ? 'active' : ''}`}
                              onClick={() => handleRoleSelect(role.id)}
                            >
                              <div className="role-option-icon">
                                {role.icon}
                              </div>
                              <div className="role-option-content">
                                <h5 className="role-option-title">{role.title}</h5>
                                <p className="role-option-description">{role.description}</p>
                              </div>
                              <div className="role-option-check">
                                <FaCheck />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="register-login-link">
                          <p className="text-secondary-custom">
                            Already have an account?{' '}
                            <Link to="/login" className="register-link">Log in</Link>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Account Details */}
                    {step === 2 && (
                      <div className="register-step-content-area">
                        <div className="register-step-header">
                          <button 
                            className="register-back-btn"
                            onClick={() => setStep(1)}
                            type="button"
                          >
                            <FaArrowLeft />
                          </button>
                          <div>
                            <h3 className="register-form-title mb-1">Account Details</h3>
                            <p className="register-form-subtitle mb-0">
                              Registering as <span className="register-role-badge">{roles.find(r => r.id === formData.role)?.title}</span>
                            </p>
                          </div>
                        </div>

                        <Form>
                          <Row className="g-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="register-form-label">
                                  <FaUser className="label-icon" />
                                  First Name *
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="firstName"
                                  placeholder="John"
                                  className={`glass-form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                  value={formData.firstName}
                                  onChange={handleChange}
                                />
                                {errors.firstName && (
                                  <div className="register-error">{errors.firstName}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="register-form-label">
                                  <FaUser className="label-icon" />
                                  Last Name *
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="lastName"
                                  placeholder="Doe"
                                  className={`glass-form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                  value={formData.lastName}
                                  onChange={handleChange}
                                />
                                {errors.lastName && (
                                  <div className="register-error">{errors.lastName}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="register-form-label">
                                  <FaEnvelope className="label-icon" />
                                  Email Address *
                                </Form.Label>
                                <Form.Control
                                  type="email"
                                  name="email"
                                  placeholder="john@example.com"
                                  className={`glass-form-control ${errors.email ? 'is-invalid' : ''}`}
                                  value={formData.email}
                                  onChange={handleChange}
                                />
                                {errors.email && (
                                  <div className="register-error">{errors.email}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="register-form-label">
                                  <FaPhone className="label-icon" />
                                  Phone Number *
                                </Form.Label>
                                <Form.Control
                                  type="tel"
                                  name="phone"
                                  placeholder="+1 (555) 123-4567"
                                  className={`glass-form-control ${errors.phone ? 'is-invalid' : ''}`}
                                  value={formData.phone}
                                  onChange={handleChange}
                                />
                                {errors.phone && (
                                  <div className="register-error">{errors.phone}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="register-form-label">
                                  <FaLock className="label-icon" />
                                  Password *
                                </Form.Label>
                                <div className="password-input-wrapper">
                                  <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Create a strong password"
                                    className={`glass-form-control ${errors.password ? 'is-invalid' : ''}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                  />
                                  <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                  </button>
                                </div>
                                {formData.password && (
                                  <div className="password-strength">
                                    <ProgressBar 
                                      now={getPasswordStrength()} 
                                      variant={getPasswordStrengthColor()}
                                      className="password-strength-bar"
                                    />
                                    <span className={`password-strength-text text-${getPasswordStrengthColor()}`}>
                                      {getPasswordStrengthText()}
                                    </span>
                                  </div>
                                )}
                                {errors.password && (
                                  <div className="register-error">{errors.password}</div>
                                )}
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="register-form-label">
                                  <FaLock className="label-icon" />
                                  Confirm Password *
                                </Form.Label>
                                <div className="password-input-wrapper">
                                  <Form.Control
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    className={`glass-form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                  />
                                  <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                  </button>
                                </div>
                                {errors.confirmPassword && (
                                  <div className="register-error">{errors.confirmPassword}</div>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>

                          <Button 
                            className="btn-glow w-100 mt-4"
                            size="lg"
                            onClick={handleNextStep}
                            type="button"
                          >
                            Continue
                          </Button>
                        </Form>
                      </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                      <div className="register-step-content-area">
                        <div className="register-step-header">
                          <button 
                            className="register-back-btn"
                            onClick={() => setStep(2)}
                            type="button"
                            disabled={isLoading}
                          >
                            <FaArrowLeft />
                          </button>
                          <div>
                            <h3 className="register-form-title mb-1">Almost Done!</h3>
                            <p className="register-form-subtitle mb-0">Review and complete your registration</p>
                          </div>
                        </div>

                        <div className="register-summary glass-card">
                          <h6 className="register-summary-title">Account Summary</h6>
                          <div className="register-summary-grid">
                            <div className="register-summary-item">
                              <span className="register-summary-label">Role</span>
                              <span className="register-summary-value">{roles.find(r => r.id === formData.role)?.title}</span>
                            </div>
                            <div className="register-summary-item">
                              <span className="register-summary-label">Name</span>
                              <span className="register-summary-value">{formData.firstName} {formData.lastName}</span>
                            </div>
                            <div className="register-summary-item">
                              <span className="register-summary-label">Email</span>
                              <span className="register-summary-value">{formData.email}</span>
                            </div>
                            <div className="register-summary-item">
                              <span className="register-summary-label">Phone</span>
                              <span className="register-summary-value">{formData.phone}</span>
                            </div>
                          </div>
                        </div>

                        <Form onSubmit={handleSubmit}>
                          <Button 
                            type="submit"
                            className="btn-glow w-100"
                            size="lg"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating Account...
                              </>
                            ) : (
                              'Create Account'
                            )}
                          </Button>
                        </Form>
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

export default Register;