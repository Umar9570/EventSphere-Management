import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { Modal, Button, Spinner } from "react-bootstrap";

export default function Profile() {
    const { user, setUser } = useContext(AuthContext);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    // NEW: Success + Error Modals
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Fetch user data on mount
    useEffect(() => {
        if (user) {
            setForm(prevForm => ({
                ...prevForm,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                password: "",
                confirmPassword: "",
            }));
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const confirmSave = () => {
        // Validation
        if (form.password && form.password !== form.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        setError("");
        setShowModal(true);
    };

    const updateUser = async () => {
        setSaveLoading(true);

        try {
            // NEW — Keep old values if empty
            const payload = {
                firstName: form.firstName.trim() === "" ? user.firstName : form.firstName,
                lastName: form.lastName.trim() === "" ? user.lastName : form.lastName,
                email: form.email.trim() === "" ? user.email : form.email,
                phone: form.phone.trim() === "" ? user.phone : form.phone,
            };

            if (form.password.trim() !== "") {
                payload.password = form.password;
            }

            const { data } = await api.put(`/auth/${user.id}`, payload);

            if (data.status) {
                setUser(prevUser => ({
                    ...prevUser,       // keep unchanged fields like role, _id
                    ...data.user       // overwrite updated fields
                }));
                localStorage.setItem("user", JSON.stringify({
                    ...user,
                    ...data.user
                }));
                setShowModal(false);
                setShowSuccessModal(true);
            }

        } catch (err) {
            console.error(err);
            setShowModal(false);
            setShowErrorModal(true);
        }

        setSaveLoading(false);
    };

    return (
        <>
            <div className="wrapper">
                <div className="grid-wrapper">
                    <div className="grid-background"></div>
                </div>
                <div className="content-page" style={{ position: "relative", zIndex: 10 }}>
                    <div className="content">

                        <div className="container-fluid">

                            {/* Background Banner */}
                            <div className="row">
                                <div className="col-sm-12">
                                    <div
                                        className="profile-bg-picture"
                                        style={{
                                            backgroundImage: "url('https://media.istockphoto.com/id/1353476783/vector/abstract-teal-circles-background.jpg?s=612x612&w=0&k=20&c=twp8lq5iWEUJ3Wzkp4HGnF89WxDKG--ZKTofQtFop7M=')",
                                        }}
                                    >
                                        <span className="picture-bg-overlay"></span>
                                        <div className="centered-title fs-1">
                                            Edit Profile
                                        </div>
                                    </div>

                                    {/* Profile floating box */}
                                    <div className="profile-user-box">
                                        <div className="row">
                                            <div className="col-sm-6 d-flex gap-3 align-items-center">
                                                <div className="info">
                                                    <h4 className="mt-1 fs-17 ellipsis text-dark">
                                                        {user?.firstName} {user?.lastName}
                                                    </h4>
                                                    <p className="text-dark">
                                                        {user?.role?.charAt(0).toUpperCase() +
                                                            user?.role?.slice(1)}
                                                    </p>
                                                    <p className="text-muted mb-0">
                                                        <small>{user?.email}</small>
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* SETTINGS */}
                            <div className="row mt-5">
                                <div className="col-sm-12">
                                    <div className="card p-0 bg-light shadow-sm">
                                        <div className="card-body p-0">
                                            <div className="profile-content">

                                                <div className="m-0 p-4">

                                                    <div className="user-profile-content">
                                                        {loading ? (
                                                            <div className="text-center p-4">
                                                                <Spinner animation="border" />
                                                            </div>
                                                        ) : (
                                                            <form onSubmit={(e) => e.preventDefault()}>
                                                                <div className="row row-cols-sm-2 row-cols-1">

                                                                    <div className="mb-2">
                                                                        <label className="form-label">
                                                                            First Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="firstName"
                                                                            className="form-control"
                                                                            value={form.firstName}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>

                                                                    <div className="mb-2">
                                                                        <label className="form-label">
                                                                            Last Name
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            name="lastName"
                                                                            className="form-control"
                                                                            value={form.lastName}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <label className="form-label">Email</label>
                                                                        <input
                                                                            type="email"
                                                                            name="email"
                                                                            className="form-control"
                                                                            value={form.email}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <label className="form-label">Phone</label>
                                                                        <input
                                                                            type="text"
                                                                            name="phone"
                                                                            className="form-control"
                                                                            value={form.phone}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <label className="form-label">Password</label>
                                                                        <input
                                                                            type="password"
                                                                            name="password"
                                                                            className="form-control"
                                                                            placeholder="Leave blank to keep old password"
                                                                            value={form.password}
                                                                            onChange={handleChange}
                                                                        />
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <label className="form-label">Confirm Password</label>
                                                                        <input
                                                                            type="password"
                                                                            name="confirmPassword"
                                                                            className="form-control"
                                                                            value={form.confirmPassword}
                                                                            onChange={handleChange}
                                                                        />
                                                                        {error && (
                                                                            <small className="text-danger">{error}</small>
                                                                        )}
                                                                    </div>

                                                                </div>

                                                                <button
                                                                    className="btn btn-primary"
                                                                    type="button"
                                                                    onClick={confirmSave}
                                                                >
                                                                    <i className="ri-save-line me-1 fs-16 lh-1"></i>
                                                                    Save Changes
                                                                </button>
                                                            </form>
                                                        )}
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========= CONFIRM MODAL ========= */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to update your profile?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateUser} disabled={saveLoading}>
                        {saveLoading ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            "Yes, Save"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ========= SUCCESS MODAL ========= */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your profile has been updated successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ========= ERROR MODAL ========= */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>Failed to update user.</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowErrorModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* === CSS DO NOT TOUCH === */}
            <style>{`
                .profile-bg-picture {
                    height: 260px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .picture-bg-overlay {
                    background: rgba(0,0,0,0.4);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .info{
                    min-width: 200px;
                    background-color: #ffffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
                                rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
                                rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
                }

                .profile-user-box {
                    position: relative;
                    margin-top: -80px;
                    padding-left: 20px;
                }
                .centered-title {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: 700;
                    z-index: 2;
                    text-align: center;
                }
                .btn-primary{
                    color: #ffffffff !important;
                    background-color: #1099a8ff !important;
                    border-color: #1099a8ff !important;
                }

                .btn-primary:hover{
                    background-color: #0d7480ff !important;
                }


                .grid-wrapper {
                min-height: 100%;
                width: 100%;
                position: relative;
                z-index: 0;
                }

                .grid-background {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 0;
                background-image: linear-gradient(to right, #e2e8f08e 1px, transparent 1px),
                    linear-gradient(to bottom, #e2e8f08e 1px, transparent 1px);
                background-size: 40px 60px;
                -webkit-mask-image: radial-gradient(
                    ellipse 70% 60% at 50% 30%,
                    #000 60%,
                    transparent 100%
                );
                mask-image: radial-gradient(
                    ellipse 70% 60% at 50% 30%,
                    #000 60%,
                    transparent 100%
                );
                }
            `}</style>
        </>
    );
}
