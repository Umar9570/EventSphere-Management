import { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'attendee' // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Dynamic API endpoint based on role
      let endpoint = '/auth/register/attendee';
      if (form.role === 'exhibitor') endpoint = '/auth/register/exhibitor';

      const { data } = await api.post(endpoint, form);
      if (data.status) {
        toast.success('Registration successful! You can now log in.');
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error. Please try again later.');
    }
  };

  return (
    <div className='register-page'>
      <div className="bg fixed"></div>
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary fs-4" href="#">
            <i className="bi bi-building me-2"></i>EventSphere
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#clientNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="clientNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-4">
              <li className="nav-item">
                <Link to={'/'} className="nav-link fw-semibold">Home</Link>
              </li>
              <li className="nav-item">
                <Link to={'/room-categories'} className="nav-link fw-semibold">Rooms</Link>
              </li>
              <li className="nav-item">
                <Link to={'/about'} className="nav-link fw-semibold">About</Link>
              </li>
              <li className="nav-item">
                <Link to={'/contact'} className="nav-link fw-semibold">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link to={'/login'} className="nav-link active fw-semibold">Login</Link>
              </li>
              <li className="nav-item">
                <Link to={'/booknow'} className="btn btn-primary px-3 fw-semibold">Book Now</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card shadow p-4">
              <h4 className="text-center mb-3">Guest Registration</h4>

              <form onSubmit={handleSubmit}>
                {/* Role Selection */}
                <div className="mb-3">
                  <label>Register as</label>
                  <select
                    name="role"
                    className="form-select"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="attendee">Attendee (Visit the Exhibition)</option>
                    <option value="exhibitor">Exhibitor</option>
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <a href="/login" className="text-primary fw-semibold">Login</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inline theme color */}
      <style>{`
        .text-primary { color: #1099a8ff !important; }
        .text-primary:hover { color: #0d7480ff !important; }
        .btn-primary {
          color: #ffffffff !important;
          background-color: #1099a8ff !important;
          border-color: #1099a8ff !important;
        }
        .btn-primary:hover { background-color: #0d7480ff !important; }
        .bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        
        background-color: #e6eef7;
        opacity: 0.1;
        background-image:  repeating-radial-gradient( circle at 0 0, transparent 0, #e6eef7 40px ), repeating-linear-gradient( #45aaf755, #45aaf7 );
      }
      `}</style>
    </div>
  );
};

export default Register;
