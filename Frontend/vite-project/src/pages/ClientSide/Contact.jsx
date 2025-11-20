import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Contact = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="client-contact">

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
                                <Link to={'/about'} className="nav-link fw-semibold">
                                    About
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={'/contact'} className="nav-link active fw-semibold">
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
            <section className="contact-hero d-flex align-items-center text-white">
                <div className="container text-center">
                    <h1 className="fw-bold display-5">Contact Us</h1>
                    <p className="mt-3 fs-5 text-white-50">
                        We're here to assist you anytime.
                    </p>
                </div>
            </section>

            {/* ================= CONTACT DETAILS ================= */}
            <section className="py-5">
                <div className="container text-center">
                    <h2 className="fw-bold text-primary mb-4">Get In Touch</h2>
                    <p className="text-secondary mb-5">
                        For bookings, inquiries or support, feel free to reach out.
                    </p>

                    <div className="row justify-content-center g-4">

                        <div className="col-md-4">
                            <div className="p-4 shadow-sm rounded bg-white">
                                <i className="bi bi-telephone-fill text-primary fs-2"></i>
                                <h5 className="fw-bold mt-3">Phone</h5>
                                <p className="text-secondary">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="p-4 shadow-sm rounded bg-white">
                                <i className="bi bi-telephone-forward-fill text-primary fs-2"></i>
                                <h5 className="fw-bold mt-3">Telephone</h5>
                                <p className="text-secondary">011 - 2345 6789</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="p-4 shadow-sm rounded bg-white">
                                <i className="bi bi-envelope-fill text-primary fs-2"></i>
                                <h5 className="fw-bold mt-3">Email</h5>
                                <p className="text-secondary">contact@royalstay.com</p>
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

        .contact-hero {
          height: 40vh;
          background: url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267')
            center/cover no-repeat;
          position: relative;
        }

        .contact-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
        }

        .contact-hero .container {
          position: relative;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .contact-hero {
            height: 30vh;
          }
        }
      `}</style>
        </div>
    );
};

export default Contact;
