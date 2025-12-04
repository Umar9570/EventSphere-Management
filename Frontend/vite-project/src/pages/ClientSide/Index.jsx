import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Index = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="client-home">

      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div className="container">
          <a className="navbar-brand fw-bold text-primary fs-4" href="#">
            <i className="bi bi-building me-2"></i>EventSphere Expo
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
                <Link to={'/'} className="nav-link active fw-semibold" >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to={'/events'} className="nav-link fw-semibold" >
                  Events
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

              {user ? (
                <>
                  <li className="nav-item">
                    <button className="nav-link fw-semibold" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link fw-semibold">Login</Link>
                </li>
              )}

              <li className="nav-item">
                <Link to={'/register-event'} className="btn btn-primary px-3 fw-semibold">
                  Register Now
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section className="hero position-relative">
        <div className="hero-overlay"></div>
        <div className="container h-100 d-flex align-items-center">
          <div className="text-white col-md-7">
            <h1 className="display-4 fw-bold mb-3">
              Experience the Future of Tech Expos with EventSphere
            </h1>
            <p className="fs-5 mb-4">
              Discover cutting-edge innovations, connect with industry experts,
              and participate in world-class sessions and workshops—all in one place.
            </p>
            <Link to={'/events'} className="btn btn-lg btn-primary fw-semibold px-4">
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">

            {/* LEFT TEXT */}
            <div className="col-lg-6 mb-4">
              <h2 className="fw-bold text-primary mb-3">Welcome to EventSphere Expo</h2>
              <p className="text-secondary fs-5">
                EventSphere specializes in hosting large-scale tech expos,
                bringing together innovators, exhibitors, startups, and tech enthusiasts
                from around the world. Our platform ensures smooth registration,
                real-time event updates, and seamless communication.
              </p>
              <p className="text-secondary">
                Stay informed with live schedules, interact with exhibitors,
                attend workshops, explore booth layouts, and experience events like never before.
              </p>
              <Link to={'/about'} className="btn btn-primary px-4 fw-semibold mt-2">
                Learn More
              </Link>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6">
              <img
                src="https://performitlive.com/wp-content/uploads/2024/06/5-ways-to-transform-your-events-with-tech.jpg"
                alt="Tech Expo"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENT TYPES PREVIEW ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center text-primary mb-4">Our Event Categories</h2>
          <p className="text-center text-secondary mb-5">
            Explore a variety of tech-focused events designed for attendees, exhibitors, and industry leaders.
          </p>

          <div className="row g-4">

            {/* CATEGORY 1 */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 room-card">
                <img
                  src="https://blog.hyperiondev.com/wp-content/uploads/2019/02/Blog-Tech-Events.jpg"
                  className="card-img-top"
                  alt="Tech Expo"
                />
                <div className="card-body">
                  <h5 className="fw-bold">Tech Expos</h5>
                  <p className="text-secondary small">
                    Explore booths, meet exhibitors, and discover the latest breakthroughs in technology.
                  </p>
                  <Link to={'/events'} className="btn btn-outline-primary w-100">
                    See Expos
                  </Link>
                </div>
              </div>
            </div>

            {/* CATEGORY 2 */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 room-card">
                <img
                  src="https://cdn.prod.website-files.com/62151f08c425abd5e1b8c93c/623fcba4eca5267cca895a18_623005cbd50003231294dd39_622fddac68f0fb4b76ecfcdb_Dell-EMC-2017-8-of-19.webp"
                  className="card-img-top"
                  alt="Workshops"
                />
                <div className="card-body">
                  <h5 className="fw-bold">Workshops & Sessions</h5>
                  <p className="text-secondary small">
                    Hands-on learning experiences conducted by industry experts and innovators.
                  </p>
                  <Link to={'/events'} className="btn btn-outline-primary w-100">
                    See Expos
                  </Link>
                </div>
              </div>
            </div>

            {/* CATEGORY 3 */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 room-card">
                <img
                  src="https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2024/04/19/4325511-803243270.jpg?itok=wUFu-zwD"
                  className="card-img-top"
                  alt="Startup Events"
                />
                <div className="card-body">
                  <h5 className="fw-bold">Startup Showcases</h5>
                  <p className="text-secondary small">
                    A platform for startups to pitch, present innovations,
                    and network with investors and industry leaders.
                  </p>
                  <Link to={'/events'} className="btn btn-outline-primary w-100">
                    See Expos
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <h5 className="fw-bold mb-3">EventSphere Management</h5>
          <p className="mb-1">123 Innovation Avenue, Silicon Valley, USA</p>
          <p className="mb-1">Phone: 03123456789</p>
          <p>Email: support@eventsphere.com</p>
          <p className="mt-3 small text-white-50">
            © {new Date().getFullYear()} EventSphere Management. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ================= INTERNAL PAGE CSS ================= */}
      <style>{`
        .hero {
          background: url('https://images.tech.co/wp-content/uploads/2024/01/22094704/EPN_0539-3-1-e1705934863400.jpg') center/cover no-repeat;
          height: 75vh;
          position: relative;
        }

        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 25, 27, 0.74);
        }

        .hero .container {
          position: relative;
          z-index: 2;
        }

        .text-primary{
          color: #1099a8ff !important;
        }

        .btn-primary{
          background-color: #1099a8ff !important;
          border-color: #1099a8ff !important;
        }

        .btn-primary:hover{
          background-color: #0d7480ff !important;
          border-color: #0d7480ff !important;
        }

        .btn-outline-primary{
          color:  #1099a8ff !important;
          border-color: #1099a8ff !important;
        }
        
        .btn-outline-primary:hover{
          color:  #ffffffff !important;
          background-color: #1099a8ff !important;
        }


        .room-card img {
          height: 200px;
          object-fit: cover;
        }

        .navbar .nav-link:hover {
          color: #1099a8ff !important;
        }

        @media (max-width: 768px) {
          .hero {
            height: 60vh;
          }
          .hero h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
