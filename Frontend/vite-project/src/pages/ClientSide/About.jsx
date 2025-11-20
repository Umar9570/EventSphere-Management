import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const About = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="client-about">

            {/* ================= NAVBAR ================= */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary fs-4" href="/client">
                        <i className="bi bi-building me-2"></i>LuxuryStay Hotel
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#clientNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="clientNavbar">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-4">
                            <li className="nav-item">
                                <Link to={'/'} className="nav-link fw-semibold" >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/room-categories'} className="nav-link fw-semibold" >
                                    Rooms
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/about'} className="nav-link active fw-semibold">
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
            <section className="about-hero d-flex align-items-center text-white">
                <div className="container text-center">
                    <h1 className="fw-bold display-5">About LuxuryStay</h1>
                    <p className="mt-3 fs-5 text-white-50">
                        Comfort • Luxury • Exceptional Service
                    </p>
                </div>
            </section>

            {/* ================= ABOUT CONTENT ================= */}
            <section className="py-5">
                <div className="container">
                    <div className="row align-items-center">

                        <div className="col-lg-6 mb-4">
                            <img
                                src="https://media.datahc.com/HI602463019.jpg"
                                className="img-fluid rounded"
                                alt="Hotel"
                            />
                        </div>

                        <div className="col-lg-6">
                            <h2 className="fw-bold text-primary mb-3">Welcome to LuxuryStay Hotel</h2>
                            <p className="text-secondary">
                                LuxuryStay Hotel offers premium hospitality with modern luxury, comfort,
                                and world-class service. Our mission is to provide a peaceful and elegant
                                environment where guests can relax, enjoy, and experience unforgettable
                                stays.
                            </p>
                            <p className="text-secondary">
                                From beautifully designed rooms to exceptional in-house services, every
                                corner of LuxuryStay reflects sophistication and warmth. Whether you're a
                                business traveler, a family on vacation, or a guest seeking comfort,
                                we ensure your stay is nothing short of perfect.
                            </p>
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

            {/* ================= INTERNAL CSS ================= */}
            <style>{`
        .text-primary{
          color: #1099a8ff !important;
        }

        .btn-primary{
          background-color: #1099a8ff !important;
          border-color: #1099a8ff !important;
        }

        .btn-primary:hover{
          background-color: #0d7480ff !important;
        }

        .about-hero {
          height: 40vh;
          background: url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa')
            center/cover no-repeat;
          position: relative;
        }

        .about-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
        }

        .about-hero .container {
          position: relative;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .about-hero {
            height: 30vh;
          }
        }
      `}</style>
        </div>
    );
};

export default About;
