import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.status) {
      toast.success('Login successful');
      if (res.user.role === 'organizer') navigate('/dashboard');
      else if (res.user.role === 'exhibitor') navigate('/all-expos');
      else navigate('/home');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className='login-page'>
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
                <Link to={'/'} className="nav-link fw-semibold">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/room-categories'} className="nav-link fw-semibold">
                  Rooms
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/about'} className="nav-link fw-semibold">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/contact'} className="nav-link fw-semibold">
                  Contact Us
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/login'} className="nav-link active fw-semibold">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/booknow'} className="btn btn-primary px-3 fw-semibold">
                  Book Now
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-4" style={{ width: '400px' }}>
          <h4 className="text-center mb-3 text-primary">Login</h4>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name='email'
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-3">
            Don't have an account?{" "}
            <a href="/register" className="text-primary fw-semibold">
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Inline theme color */}
      <style>{`
      .text-primary {
        color: #1099a8ff !important;
      }

      .text-primary:hover{
          color: #0d7480ff !important;
        }

      .btn-primary{
          color: #ffffffff !important;
          background-color: #1099a8ff !important;
          border-color: #1099a8ff !important;
        }

      .btn-primary:hover{
        background-color: #0d7480ff !important;
      }
      
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

export default Login;
