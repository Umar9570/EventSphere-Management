import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Booknow = () => {
    const { user, logout } = useContext(AuthContext);

    // If user NOT logged in → popup + redirect
    useEffect(() => {
        if (!user) {
            toast.error("Please login first to book your room!");
        }
    }, [user]);

    const [rooms, setRooms] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roomType: "",
        roomId: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 1,
        totalPrice: ""
    });

    const today = new Date().toISOString().split("T")[0];

    // Auto-fill guest fields if logged in
    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                firstName: user.firstname || user.firstName || "",
                lastName: user.lastname || user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
            }));
        }
    }, [user]);
    // Fetch rooms
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const { data } = await api.get("/rooms");
                setRooms(data);
            } catch (err) {
                console.log("Error fetching rooms:", err);
            }
        };
        fetchRooms();
    }, []);

    // Filter available rooms
    useEffect(() => {
        if (formData.roomType) {
            const filtered = rooms.filter(
                (r) => r.roomType === formData.roomType && r.status === "available"
            );
            setAvailableRooms(filtered);
        } else {
            setAvailableRooms([]);
        }
    }, [formData.roomType, rooms]);

    // Calculate total price
    useEffect(() => {
        if (formData.checkInDate && formData.checkOutDate && formData.roomId) {
            const room = rooms.find((r) => r._id === formData.roomId);

            const checkIn = new Date(formData.checkInDate);
            const checkOut = new Date(formData.checkOutDate);

            const nights = Math.max(
                1,
                Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
            );

            setFormData((prev) => ({
                ...prev,
                totalPrice: room ? nights * room.pricePerNight : ""
            }));
        }
    }, [formData.checkInDate, formData.checkOutDate, formData.roomId]);

    // Handle inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Submit booking
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                guestId: user.id,
                roomId: formData.roomId,
                checkInDate: formData.checkInDate,
                checkOutDate: formData.checkOutDate,
                numberOfGuests: formData.numberOfGuests
            };

            const { data } = await api.post("/bookings", payload);

            if (data?.booking) {
                toast.success("Booking successful!");
                window.location.href = "/";
            } else {
                toast.error(data.message || "Failed to create booking.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Server error while booking.");
        }
    };

    return (
        <div className="client-booking bg-light">

            {/* NAVBAR */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
                <div className="container">
                    <a className="navbar-brand fw-bold text-primary fs-4">
                        <i className="bi bi-building me-2"></i>LuxuryStay Hotel
                    </a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#clientNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="clientNavbar">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-4">
                            <li className="nav-item"><Link to="/" className="nav-link fw-semibold">Home</Link></li>
                            <li className="nav-item"><Link to="/room-categories" className="nav-link fw-semibold">Rooms</Link></li>
                            <li className="nav-item"><Link to="/about" className="nav-link fw-semibold">About</Link></li>
                            <li className="nav-item"><Link to="/contact" className="nav-link fw-semibold">Contact Us</Link></li>

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
                                <Link to="/booknow" className="btn btn-primary px-3 fw-semibold">Book Now</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* HEADER */}
            <section className="py-5 text-center">
                <div className="container">
                    <h1 className="fw-bold text-primary">Book Your Stay</h1>
                    <p className="text-secondary mt-2">
                        Fill out the form below to reserve your perfect room at LuxuryStay.
                    </p>
                </div>
            </section>

            {/* BOOKING FORM */}
            <div className="container my-5">
                <div className="card shadow-sm border-0 p-4">

                    {/* GUEST INFO */}
                    <h4 className="fw-bold text-secondary mb-4">Guest Information</h4>
                    {!user ? (
                        <h5 className="text-success text-center mb-5 fs-small">Please login first to book your room</h5>
                    ) : ("")}

                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">First Name</label>
                                <input type="text" className="form-control" value={formData.firstName} readOnly />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Last Name</label>
                                <input type="text" className="form-control" value={formData.lastName} readOnly />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" value={formData.email} readOnly />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Phone</label>
                                <input type="text" className="form-control" value={formData.phone} readOnly />
                            </div>
                        </div>

                    {/* ROOM SELECTION */}
                    <h4 className="fw-bold text-secondary mb-3">Room Selection</h4>

                    <form onSubmit={handleSubmit}>

                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Room Type</label>
                                <select
                                    className="form-select"
                                    name="roomType"
                                    value={formData.roomType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select room type</option>
                                    {[...new Set(rooms.map((r) => r.roomType))].map((type) => (
                                        <option key={type} value={type}>{type.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Available Rooms</label>
                                <select
                                    className="form-select"
                                    name="roomId"
                                    value={formData.roomId}
                                    onChange={handleChange}
                                    disabled={!availableRooms.length}
                                    required
                                >
                                    <option value="">
                                        {availableRooms.length ? "Select Room" : "No rooms available"}
                                    </option>

                                    {availableRooms.map((room) => (
                                        <option key={room._id} value={room._id}>
                                            Room {room.roomNumber} — ${room.pricePerNight}/night
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* BOOKING DETAILS */}
                        <h4 className="fw-bold text-secondary mb-3">Booking Details</h4>

                        <div className="row mb-4">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Check-In Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="checkInDate"
                                    min={today}
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Check-Out Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="checkOutDate"
                                    min={formData.checkInDate || today}
                                    value={formData.checkOutDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Number of Guests</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="numberOfGuests"
                                    min="1"
                                    value={formData.numberOfGuests}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Total Price ($)</label>
                                <input type="text" className="form-control" readOnly value={formData.totalPrice} />
                            </div>
                        </div>

                        <div className="text-end">
                            <button type="submit" className="btn btn-success px-4 fw-semibold">
                                <i className="bi bi-check2-circle me-2"></i>Confirm Booking
                            </button>
                        </div>

                    </form>
                </div>
            </div>

            {/* FOOTER */}
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

            <style>{`
                .text-primary { color: #1099a8ff !important; }
                .btn-primary, .btn-success { border-radius: 8px; }
                .btn-primary { background-color: #1099a8ff !important; border-color: #1099a8ff !important; }
                .btn-primary:hover { background-color: #0d7480ff !important; }
                .form-control, .form-select { border-radius: 8px; }
                .card { border-radius: 14px; }
            `}</style>
        </div>
    );
};

export default Booknow;
