import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Spinner, Modal, Form, Alert, Badge } from "react-bootstrap";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const AllExpos = () => {
    const { user } = useContext(AuthContext);

    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [selectedExpo, setSelectedExpo] = useState(null);
    const [applying, setApplying] = useState(false);

    const [applicationData, setApplicationData] = useState({
        organization: "",
        bio: "",
    });

    const [userApplications, setUserApplications] = useState([]); // <-- stores user's applied expos

    // Fetch expos
    const fetchExpos = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/expos");
            if (data.status) {
                const sorted = data.expos.sort(
                    (a, b) => new Date(a.startDate) - new Date(b.startDate)
                );
                setExpos(sorted);
            }
        } catch (err) {
            setFetchError("Failed to load expos.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch all exhibitor applications (we filter for logged-in user)
    const fetchApplications = async () => {
        if (!user?.id) return;

        try {
            const { data } = await api.get("/exhibitors/applications");

            if (data.status) {
                const myApps = data.exhibitors.filter(
                    (app) => app.user?._id === user.id
                );

                setUserApplications(myApps);
            }
        } catch (err) {
            console.error("Failed to fetch applications");
        }
    };

    useEffect(() => {
        fetchExpos();
        fetchApplications();
    }, [user]);

    const handleChange = (e) =>
        setApplicationData({ ...applicationData, [e.target.name]: e.target.value });

    const openApplyModal = (expo) => {
        setSelectedExpo(expo);
        setApplicationData({ organization: "", bio: "" });
        setShowApplyModal(true);
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            alert("You must be logged in to apply.");
            return;
        }
        try {
            setApplying(true);

            const payload = {
                user: user.id,
                expo: selectedExpo._id,
                organization: applicationData.organization,
                bio: applicationData.bio,
            };

            const { data } = await api.post("/exhibitors/apply", payload);

            if (data.status) {
                alert("Application submitted successfully!");
                setShowApplyModal(false);
                fetchApplications();
            } else {
                alert(data.message || "Failed to submit application.");
            }
        } catch (err) {
            alert("Failed to submit application.");
        } finally {
            setApplying(false);
        }
    };

    // Check if user applied
    const hasApplied = (expoId) => {
        return userApplications.some((app) => app.expo?._id === expoId);
    };

    // Get status for this expo
    const getStatus = (expoId) => {
        const app = userApplications.find((app) => app.expo?._id === expoId);
        return app ? app.status : null;
    };

    // Get color based on status
    const statusColor = (status) => {
        if (status === "approved") return "success";
        if (status === "rejected") return "danger";
        return "warning"; // pending
    };

    return (
        <div className="all-expos-page">
            <div className ="grid-wrapper">
                <div className="grid-background"></div>
            </div>
            <div className="p-4" style={{ position: "relative", zIndex: 10 }}>
                <div className="col-sm-12 mb-5">
                    <div
                        className="profile-bg-picture"
                        style={{
                            backgroundImage: "url('https://media.istockphoto.com/id/1353476783/vector/abstract-teal-circles-background.jpg?s=612x612&w=0&k=20&c=twp8lq5iWEUJ3Wzkp4HGnF89WxDKG--ZKTofQtFop7M=')",
                        }}
                    >
                        <span className="picture-bg-overlay"></span>

                        <div className="centered-title fs-1">
                            Welcome to EventSphere!
                        </div>
                    </div>
                </div>
                <h4 className="fw-semibold text-secondary mb-4">All Available Expos</h4>

                {fetchError && (
                    <Alert variant="danger" onClose={() => setFetchError("")} dismissible>
                        {fetchError}
                    </Alert>
                )}

                {loading && (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                        <p className="text-muted mt-3">Loading expos...</p>
                    </div>
                )}

                {!loading && expos.length === 0 && (
                    <p className="text-center text-muted">No expos available.</p>
                )}

                <div className="row g-4">
                    {expos.map((expo) => {
                        const applied = hasApplied(expo._id);
                        const status = getStatus(expo._id);

                        return (
                            <div key={expo._id} className="col-12 col-md-6 col-lg-4">
                                <Card className="shadow-sm border-0 expo-card h-100">
                                    <Card.Body className="d-flex flex-column">

                                        <div className="d-flex justify-content-between align-items-start">
                                            <h5 className="fw-bold text-dark">{expo.name}</h5>

                                            {applied && (
                                                <Badge bg={statusColor(status)}>
                                                    {status.toUpperCase()}
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-muted mt-2 small">{expo.description}</p>
                                        <p className="text-muted mt-2 small"><i className="bi bi-geo-alt me-2"></i>{expo.location}</p>

                                        <p className="text-muted small mb-1">
                                            <i className="bi bi-calendar-event me-2"></i>
                                            {new Date(expo.startDate).toLocaleDateString()} →{" "}
                                            {new Date(expo.endDate).toLocaleDateString()}
                                        </p>

                                        <div className="mt-auto d-flex justify-content-end">
                                            <Button
                                                variant={applied ? "secondary" : "primary"}
                                                size="sm"
                                                onClick={() => !applied && openApplyModal(expo)}
                                                disabled={applied}
                                            >
                                                {applied ? "Already Applied" : "Apply"}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        );
                    })}
                </div>
                {/* FOOTER */}
                    <footer className="footer mt-5 pt-5">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 text-center">
                                    {new Date().getFullYear()} © EventSphere - Made by <b>Umar</b>
                                </div>
                            </div>
                        </div>
                    </footer>

                {/* Apply Modal */}
                <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Apply for {selectedExpo?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleApply}>
                            <Form.Group className="mb-2">
                                <Form.Label>Organization</Form.Label>
                                <Form.Control
                                    name="organization"
                                    value={applicationData.organization}
                                    onChange={handleChange}
                                    placeholder="Organization's name"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="bio"
                                    value={applicationData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Add complete details about your organization."
                                    required
                                />
                            </Form.Group>

                            <div className="text-end mt-3">
                                <Button
                                    variant="secondary"
                                    className="me-2"
                                    onClick={() => setShowApplyModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={applying}>
                                    {applying ? <Spinner animation="border" size="sm" /> : "Apply"}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>

            <style>{`
                .expo-card {
                    border-radius: 14px;
                    transition: all 0.25s ease;
                }
                .expo-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
                }
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
        </div>
    );
};

export default AllExpos;
