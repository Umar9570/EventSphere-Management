import React, { useEffect, useState, useContext } from "react";
import {
    Card,
    Button,
    Spinner,
    Modal,
    Form,
    Row,
    Col,
    Alert,
    Badge,
} from "react-bootstrap";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext"; // import AuthContext

const ManageExpos = () => {
    const { user } = useContext(AuthContext); // get logged-in user

    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedExpo, setSelectedExpo] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Expo form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
    });

    // Fetch expos
    const fetchExpos = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/expos");

            if (data.status) {
                setExpos(data.expos);
            }
        } catch (err) {
            setFetchError("Failed to load expos.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpos();
    }, []);

    // Handle form change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Add new expo
    const handleAddExpo = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);

            // include organizer from logged-in user
            const { data } = await api.post("/expos", {
                ...formData,
                organizer: user?._id,
            });

            if (data.status) {
                setShowAddModal(false);
                setFormData({
                    name: "",
                    description: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                });
                fetchExpos();
            }
        } catch (err) {
            alert("Failed to create expo");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Open edit modal
    const openEditModal = (expo) => {
        setSelectedExpo(expo);
        setFormData({
            name: expo.name,
            description: expo.description,
            location: expo.location,
            startDate: expo.startDate?.slice(0, 10),
            endDate: expo.endDate?.slice(0, 10),
        });
        setShowEditModal(true);
    };

    // Update expo
    const handleUpdateExpo = async () => {
        try {
            setSaving(true);
            const { data } = await api.put(`/expos/${selectedExpo._id}`, formData);

            if (data.status) {
                setShowEditModal(false);
                fetchExpos();
            }
        } catch (err) {
            alert("Failed to update expo");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    // Delete expo
    const handleDeleteExpo = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expo?")) return;

        try {
            setDeletingId(id);
            const { data } = await api.delete(`/expos/${id}`);

            if (data.status) {
                setExpos((prev) => prev.filter((e) => e._id !== id));
            }
        } catch (err) {
            alert("Failed to delete expo");
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h4 className="fw-semibold text-secondary mb-0">Manage Expos</h4>

                <Button
                    variant="primary"
                    className="d-flex align-items-center"
                    onClick={() => setShowAddModal(true)}
                >
                    <i className="bi bi-plus-circle me-2"></i>Add Expo
                </Button>
            </div>

            {/* Error */}
            {fetchError && (
                <Alert variant="danger" onClose={() => setFetchError("")} dismissible>
                    {fetchError}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="text-muted mt-3">Loading expos...</p>
                </div>
            )}

            {/* Empty */}
            {!loading && expos.length === 0 && (
                <p className="text-center text-muted">No expos found.</p>
            )}

            {/* Expo Cards */}
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

                                <p className="text-muted small">
                                    <i className="bi bi-people me-2"></i>
                                    Exhibitors: {expo.exhibitors?.length || 0}
                                </p>

                                <div className="mt-auto d-flex gap-2">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => openEditModal(expo)}
                                    >
                                        <i className="bi bi-pencil-square me-1"></i>Edit
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        disabled={deletingId === expo._id}
                                        onClick={() => handleDeleteExpo(expo._id)}
                                    >
                                        {deletingId === expo._id ? (
                                            <Spinner size="sm" animation="border" />
                                        ) : (
                                            <i className="bi bi-trash me-1"></i>
                                        )}
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

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

            {/* Add Expo Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Expo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Expo Name</Form.Label>
                            <Form.Control name="name" value={formData.name} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Location</Form.Label>
                            <Form.Control name="location" value={formData.location} onChange={handleChange} />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-2">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-2">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-end mt-3">
                            <Button variant="secondary" className="me-2" onClick={() => setShowAddModal(false)}>
                                Cancel
                            </Button>

                            <Button variant="primary" onClick={handleAddExpo} disabled={saving}>
                                {saving ? <Spinner animation="border" size="sm" /> : "Add Expo"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Expo Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Expo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Expo Name</Form.Label>
                            <Form.Control name="name" value={formData.name} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Location</Form.Label>
                            <Form.Control name="location" value={formData.location} onChange={handleChange} />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-2">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-2">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-end mt-3">
                            <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>

                            <Button variant="primary" onClick={handleUpdateExpo} disabled={saving}>
                                {saving ? <Spinner animation="border" size="sm" /> : "Update Expo"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ManageExpos;
