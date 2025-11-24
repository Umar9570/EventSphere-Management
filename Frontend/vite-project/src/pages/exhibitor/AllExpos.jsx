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
        <div className="p-4">
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

            <style>{`
                .expo-card {
                    border-radius: 14px;
                    transition: all 0.25s ease;
                }
                .expo-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
                }
            `}</style>
        </div>
    );
};

export default AllExpos;
