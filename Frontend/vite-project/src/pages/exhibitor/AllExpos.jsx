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

    // Fetch all expos
    const fetchExpos = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/expos");
            if (data.status) {
                // Sort by startDate ascending
                const sorted = data.expos.sort(
                    (a, b) => new Date(a.startDate) - new Date(b.startDate)
                );
                setExpos(sorted);
            } else {
                setExpos([]);
            }
        } catch (err) {
            console.error(err);
            setFetchError("Failed to load expos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpos();
    }, []);

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
            } else {
                alert(data.message || "Failed to submit application.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to submit application.");
        } finally {
            setApplying(false);
        }
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
                {expos.map((expo) => (
                    <div key={expo._id} className="col-12 col-md-6 col-lg-4">
                        <Card className="shadow-sm border-0 expo-card h-100">
                            <Card.Body className="d-flex flex-column">
                                <div className="d-flex justify-content-between">
                                    <h5 className="fw-bold text-dark">{expo.name}</h5>
                                    <Badge bg="secondary">{expo.location}</Badge>
                                </div>
                                <p className="text-muted mt-2 small">{expo.description}</p>
                                <p className="text-muted small mb-1">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    {new Date(expo.startDate).toLocaleDateString()} →{" "}
                                    {new Date(expo.endDate).toLocaleDateString()}
                                </p>
                                <div className="mt-auto d-flex justify-content-end">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => openApplyModal(expo)}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
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
                                onChange={handleChange} placeholder="Organization's name"
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
                                rows={3} placeholder="Add Complete details about what your organization do, what do you want to exhibit, your goals etc."
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

            {/* Styles */}
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
