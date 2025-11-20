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
            <i className="bi bi-building me-2"></i>LuxuryStay Hotel
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
                <Link to={'/room-categories'} className="nav-link fw-semibold" >
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
                <Link to={'/booknow'} className="btn btn-primary px-3 fw-semibold">
                  Book Now
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
              Experience Luxury & Comfort With LuxuryStay
            </h1>
            <p className="fs-5 mb-4">
              Book your perfect stay with modern rooms, world-class service,
              and a peaceful environment—all at unbeatable prices.
            </p>
            <Link to={'/room-categories'} className="btn btn-lg btn-primary fw-semibold px-4">
              Explore Rooms
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
              <h2 className="fw-bold text-primary mb-3">Welcome to LuxuryStay</h2>
              <p className="text-secondary fs-5">
                At LuxuryStay, we combine elegance with comfort to provide
                guests a memorable experience. Whether you're here for business,
                leisure, or a relaxing getaway, our rooms and amenities are
                designed to cater to your every need.
              </p>
              <p className="text-secondary">
                Enjoy luxurious rooms, 24/7 room service, high-speed internet,
                delicious dining options, and friendly staff ready to make your
                stay perfect.
              </p>
              <Link to={'/about'} className="btn btn-primary px-4 fw-semibold mt-2">
                Learn More
              </Link>
            </div>

            {/* RIGHT IMAGE */}
            <div className="col-lg-6">
              <img
                src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/ce/5c/0d/indura-beach-golf-resort.jpg?w=1200&h=-1&s=1"
                alt="Hotel"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= ROOM TYPES PREVIEW ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center text-primary mb-4">Our Rooms</h2>
          <p className="text-center text-secondary mb-5">
            Choose from a variety of room categories designed to suit every need.
          </p>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 room-card">
                <img
                  src="https://media.istockphoto.com/id/496859731/photo/modern-twin-room-interior.jpg?s=612x612&w=0&k=20&c=ZYrOwKJbbm-15fq0kxpCwlO0Lvg_OQhOyctsWgfonWw="
                  className="card-img-top"
                  alt="Single Room"
                />
                <div className="card-body">
                  <h5 className="fw-bold">Single Room</h5>
                  <p className="text-secondary small">
                    A cozy and comfortable room designed for solo travelers.
                  </p>
                  <Link to={'/room-categories'} className="btn btn-outline-primary w-100">
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 room-card">
                <img
                  src="https://www.glenmarie.com.my/wp-content/uploads/2024/02/Deluxe-Suite-3.jpg"
                  className="card-img-top"
                  alt="Deluxe Room"
                />
                <div className="card-body">
                  <h5 className="fw-bold">Deluxe Room</h5>
                  <p className="text-secondary small">
                    Spacious room with premium interiors and great ambiance.
                  </p>
                  <Link to={'/room-categories'} className="btn btn-outline-primary w-100">
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 room-card">
                <img
                  src="https://images.prismic.io/luxdeco-dev/NjlmZDU5ZDctYmFlOS00YTgyLWJiMTUtM2ZkMDQ2MzgwYTQ0_1552563901_palace-suite-kempinski-emirates-palace-the-most-expensive-hotels-rooms-around-the-world-luxdeco-style-guide.jpg?auto=compress,format&w=1200&q=100"
                  className="card-img-top"
                  alt="Suite"
                />
                <div className="card-body">
                  <h5 className="fw-bold">Luxury Suite</h5>
                  <p className="text-secondary small">
                    A premium stay experience with luxury and comfort.
                  </p>
                  <Link to={'/room-categories'} className="btn btn-outline-primary w-100">
                    View Details
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
          <h5 className="fw-bold mb-3">LuxuryStay Hotel</h5>
          <p className="mb-1">123 Luxury Street, NewYork, USA</p>
          <p className="mb-1">Phone: 03123456789</p>
          <p>Email: contact@luxurystay.com</p>
          <p className="mt-3 small text-white-50">
            © {new Date().getFullYear()} LuxuryStay Hotel. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ================= INTERNAL PAGE CSS ================= */}
      <style>{`
        .hero {
          background: url('https://assets.insuremytrip.com/wp-content/uploads/2021/11/02144544/most_affordable_5_star_hotels_us.jpg') center/cover no-repeat;
          height: 75vh;
          position: relative;
        }

        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
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
