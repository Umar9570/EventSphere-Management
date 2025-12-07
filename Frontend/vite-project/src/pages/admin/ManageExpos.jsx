import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Spinner, Modal, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const ManageExpos = () => {
    const { user } = useContext(AuthContext);

    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedExpo, setSelectedExpo] = useState(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expoToDelete, setExpoToDelete] = useState(null);

    // Fetch expos from backend
    const fetchExpos = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/expos");
            if (data.status) setExpos(data.expos);
            else setExpos([]);
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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Add new expo
    const handleAddExpo = async (e) => {
        e.preventDefault();

        if (!user?.id) {
            alert("You must be logged in to create an expo.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                ...formData,
                organizer: user.id,
            };

            const { data } = await api.post("/expos", payload);

            if (data.status) {
                setShowAddModal(false);
                setFormData({ name: "", description: "", location: "", startDate: "", endDate: "" });
                fetchExpos();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create expo");
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
    const handleUpdateExpo = async (e) => {
        if (e) e.preventDefault();
        try {
            setSaving(true);
            const { data } = await api.put(`/expos/${selectedExpo._id}`, formData);
            if (data.status) {
                setShowEditModal(false);
                fetchExpos();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update expo");
        } finally {
            setSaving(false);
        }
    };

    // Show delete modal
    const confirmDeleteExpo = (expo) => {
        setExpoToDelete(expo);
        setShowDeleteModal(true);
    };

    // Delete expo
    const handleDeleteExpo = async () => {
        if (!expoToDelete) return;
        try {
            setDeletingId(expoToDelete._id);
            const { data } = await api.delete(`/expos/${expoToDelete._id}`);
            if (data.status) setExpos((prev) => prev.filter((e) => e._id !== expoToDelete._id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete expo");
        } finally {
            setDeletingId(null);
            setShowDeleteModal(false);
            setExpoToDelete(null);
        }
    };

    return (
        <div className="manage-expos-page">
            <div className ="grid-wrapper">
                <div className="grid-background"></div>
            </div>
        <div className="p-4" style={{ position: "relative", zIndex: 10 }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h4 className="fw-semibold text-secondary mb-0">Manage Expos</h4>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <i className="bi bi-plus-circle me-2"></i>Add Expo
                </Button>
            </div>

            {/* Error */}
            {fetchError && <Alert variant="danger" onClose={() => setFetchError("")} dismissible>{fetchError}</Alert>}

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="text-muted mt-3">Loading expos...</p>
                </div>
            )}

            {/* Empty */}
            {!loading && expos.length === 0 && <p className="text-center text-muted">No expos found.</p>}

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
                                    {new Date(expo.startDate).toLocaleDateString()} → {new Date(expo.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-muted small">
                                    <i className="bi bi-people me-2"></i>Exhibitors: {expo.exhibitors?.length || 0}
                                </p>
                                <div className="mt-auto d-flex gap-2">
                                    <Button variant="outline-primary" size="sm" onClick={() => openEditModal(expo)}>
                                        <i className="bi bi-pencil-square me-1"></i>Edit
                                    </Button>
                                    <Button variant="outline-danger" size="sm" disabled={deletingId === expo._id} onClick={() => confirmDeleteExpo(expo)}>
                                        {deletingId === expo._id ? <Spinner size="sm" animation="border" /> : <i className="bi bi-trash me-1"></i>}
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modals */}
            <ExpoModal show={showAddModal} onHide={() => setShowAddModal(false)} onSubmit={handleAddExpo} saving={saving} formData={formData} handleChange={handleChange} title="Add New Expo" />
            <ExpoModal show={showEditModal} onHide={() => setShowEditModal(false)} onSubmit={handleUpdateExpo} saving={saving} formData={formData} handleChange={handleChange} title="Edit Expo" />

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the expo <strong>{expoToDelete?.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteExpo} disabled={deletingId === expoToDelete?._id}>
                        {deletingId === expoToDelete?._id ? <Spinner size="sm" animation="border" /> : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
            </div>

            {/* Styles */}
            <style>{`
        .card {
          border-radius: 14px;
          transition: all 0.25s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }
        .btn {
          border-radius: 8px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
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

// Separate modal component
const ExpoModal = ({ show, onHide, onSubmit, saving, formData, handleChange, title }) => (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-2">
                    <Form.Label>Expo Name</Form.Label>
                    <Form.Control name="name" required value={formData.name} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" required value={formData.description} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Location</Form.Label>
                    <Form.Control name="location" required value={formData.location} onChange={handleChange} />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" name="startDate" required value={formData.startDate} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" name="endDate" required value={formData.endDate} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="text-end mt-3">
                    <Button variant="secondary" className="me-2" onClick={onHide}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={saving}>{saving ? <Spinner animation="border" size="sm" /> : "Save"}</Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>
);

export default ManageExpos;
