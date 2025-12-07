import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Accordion } from 'react-bootstrap';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaQuestionCircle
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    userType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt />,
      title: 'Visit Us',
      details: ['123 Event Street', 'Tech City, TC 12345', 'United States']
    },
    {
      icon: <FaPhone />,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543', 'Toll-free: 1-800-EVENT']
    },
    {
      icon: <FaEnvelope />,
      title: 'Email Us',
      details: ['info@eventsphere.com', 'support@eventsphere.com', 'sales@eventsphere.com']
    },
    {
      icon: <FaClock />,
      title: 'Working Hours',
      details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM', 'Sunday: Closed']
    }
  ];

  const faqs = [
    {
      question: 'How do I register as an exhibitor?',
      answer: 'Click on the Register button and select "Exhibitor" as your role. Complete the registration form with your company details and submit. Our team will review and approve your application within 24-48 hours.'
    },
    {
      question: 'Can I attend multiple events?',
      answer: 'Yes! Once registered as an attendee, you can browse and register for any available events through your dashboard. There\'s no limit to the number of events you can attend.'
    },
    {
      question: 'How do I contact exhibitors before the event?',
      answer: 'Through the Attendee Interface, you can search for exhibitors, view their profiles, and use our built-in messaging system to send inquiries or schedule appointments.'
    },
    {
      question: 'Is there a mobile app available?',
      answer: 'Yes, EventSphere is available on both iOS and Android. Download our app for real-time notifications, interactive floor plans, and seamless networking during events.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero-section" data-aos="fade-up">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8} data-aos="fade-up">
              <h1 className="contact-hero-title display-4 fw-bold mb-4" data-aos="fade-up">Get In Touch</h1>
              <p className="contact-hero-subtitle lead" data-aos="fade-up" data-aos-delay="200">
                Have questions about EventSphere? We're here to help. 
                Reach out to us and we'll respond as soon as we can.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form Section */}
      <section className="contact-section" data-aos="fade-up">
        <Container>
          <Row className="g-4">
            <Col lg={8} data-aos="fade-right">
              <div className="glass-card p-4 p-md-5">
                <h3 className="text-primary-custom mb-4" data-aos="fade-up">Send Us a Message</h3>
                
                {submitted && (
                  <Alert className="glass-alert-success d-flex align-items-center mb-4" data-aos="fade-up">
                    <FaCheckCircle className="me-2" />
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} className='contact-form'>
                  <Row className="g-3">
                    <Col md={6} data-aos="fade-up">
                      <Form.Group>
                        <Form.Label className="contact-form-label">Full Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          className="glass-form-control"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} data-aos="fade-up" data-aos-delay="100">
                      <Form.Group>
                        <Form.Label className="contact-form-label">Email Address *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="john@example.com"
                          className="glass-form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} data-aos="fade-up" data-aos-delay="200">
                      <Form.Group>
                        <Form.Label className="contact-form-label">Subject *</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          placeholder="How can we help?"
                          className="glass-form-control"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} data-aos="fade-up" data-aos-delay="300">
                      <Form.Group>
                        <Form.Label className="contact-form-label">I am a *</Form.Label>
                        <Form.Select
                          name="userType"
                          className="glass-form-control glass-form-select"
                          value={formData.userType}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select user type</option>
                          <option value="attendee">Attendee</option>
                          <option value="exhibitor">Exhibitor</option>
                          <option value="organizer">Organizer</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} data-aos="fade-up" data-aos-delay="400">
                      <Form.Group>
                        <Form.Label className="contact-form-label">Message *</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="message"
                          rows={5}
                          placeholder="Tell us more about your inquiry..."
                          className="glass-form-control"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} data-aos="fade-up" data-aos-delay="500">
                      <Button type="submit" className="btn-glow" size="lg">
                        <FaPaperPlane className="me-2" />
                        Send Message
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
            <Col lg={4} data-aos="fade-left">
              <div className="glass-card-strong contact-info-glass p-4">
                <h4 className="text-primary-custom mb-4" data-aos="fade-up">Contact Information</h4>
                {contactInfo.map((info, index) => (
                  <div key={index} className="contact-info-item-glass" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="contact-info-icon-glass">
                      {info.icon}
                    </div>
                    <div>
                      <h6 className="text-primary-custom mb-2">{info.title}</h6>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-secondary-custom mb-1 small">{detail}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Map Section */}
      <section className="contact-map-section" data-aos="fade-up">
        <Container fluid className="p-0">
          <div className="glass-card contact-map-placeholder" data-aos="zoom-in">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3620.017148282561!2d67.0743981!3d24.8632639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33ea3db108f41%3A0x42acc4507358b160!2sAptech%20Learning%2C%20Shahrah%20e%20Faisal%20Center!5e0!3m2!1sen!2s!4v1765071247909!5m2!1sen!2s" style={{width:'80%', height: '100%'}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq-section" data-aos="fade-up">
        <Container>
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="contact-section-title">Frequently Asked Questions</h2>
            <p className="contact-section-subtitle" data-aos="fade-up" data-aos-delay="200">
              Quick answers to common questions
            </p>
          </div>
          <Row className="justify-content-center">
            <Col lg={8} data-aos="fade-up">
              <Accordion className="glass-accordion">
                {faqs.map((faq, index) => (
                  <Accordion.Item 
                    eventKey={index.toString()} 
                    key={index}
                    className="glass-accordion-item"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Accordion.Header className="glass-accordion-header">
                      <FaQuestionCircle className="faq-icon me-3" />
                      {faq.question}
                    </Accordion.Header>
                    <Accordion.Body className="glass-accordion-body">
                      {faq.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Contact;