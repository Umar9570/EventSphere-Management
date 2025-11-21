import React, { useState, useEffect } from "react";
import {
    Card,
    Button,
    Badge,
    Spinner,
    Modal,
    Form,
    Row,
    Col,
    Alert,
} from "react-bootstrap";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ManageSchedule = () => {
    const [scheduleList, setScheduleList] = useState([]);
    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        expo: "",
        date: "",
        startTime: "",
        endTime: "",
    });

    const [updatingId, setUpdatingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // ---------------- FETCH SCHEDULE ----------------
    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/schedule"); // GET all sessions
            if (data.status) {
                setScheduleList(data.schedule);
            }
            const { data: exposData } = await api.get("/expos"); // GET expos for dropdown
            if (exposData.status) {
                setExpos(exposData.expos);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to fetch schedule.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    // ---------------- HANDLE FORM CHANGE ----------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ---------------- OPEN MODALS ----------------
    const openEditModal = (session) => {
        setCurrentSession(session);
        setFormData({
            title: session.title,
            description: session.description,
            expo: session.expo?._id || "",
            date: session.date?.split("T")[0] || "",
            startTime: session.startTime || "",
            endTime: session.endTime || "",
        });
        setShowEditModal(true);
    };

    const openAddModal = () => {
        setFormData({
            title: "",
            description: "",
            expo: "",
            date: "",
            startTime: "",
            endTime: "",
        });
        setShowAddModal(true);
    };

    // ---------------- ADD SESSION ----------------
    const handleAddSession = async (e) => {
        e.preventDefault();
        try {
            setUpdatingId("add");
            const { data } = await api.post("/schedule", formData);
            if (data.status) {
                toast.success("Session added successfully");
                setShowAddModal(false);
                fetchSchedule();
            } else {
                toast.error(data.message || "Failed to add session");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while adding session");
        } finally {
            setUpdatingId(null);
        }
    };

    // ---------------- EDIT SESSION ----------------
    const handleEditSession = async (e) => {
        e.preventDefault();
        try {
            setUpdatingId(currentSession._id);
            const { data } = await api.put(`/schedule/${currentSession._id}`, formData);
            if (data.status) {
                toast.success("Session updated successfully");
                setShowEditModal(false);
                fetchSchedule();
            } else {
                toast.error(data.message || "Failed to update session");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while updating session");
        } finally {
            setUpdatingId(null);
        }
    };

    // ---------------- DELETE SESSION ----------------
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);

    const openDeleteModal = (session) => {
        setSessionToDelete(session);
        setShowDeleteModal(true);
    };

    const handleDeleteSession = async () => {
        try {
            setUpdatingId(sessionToDelete._id);
            const { data } = await api.delete(`/schedule/${sessionToDelete._id}`);
            if (data.status) {
                toast.success("Session deleted successfully");
                setShowDeleteModal(false);
                fetchSchedule();
            } else {
                toast.error(data.message || "Failed to delete session");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while deleting session");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="text-muted mt-2">Loading schedule...</p>
            </div>
        );

    return (
        <div className="p-4">
            {/* Page Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <h4 className="fw-semibold text-secondary mb-0">Manage Schedule</h4>
                <Button variant="primary" onClick={openAddModal}>
                    <i className="bi bi-plus-lg me-2"></i> Add Session
                </Button>
            </div>

            {/* Error Alert */}
            {errorMessage && (
                <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
                    {errorMessage}
                </Alert>
            )}

            {/* Sessions Cards */}
            <div className="row g-4">
                {scheduleList.length === 0 && (
                    <p className="text-center text-muted">No sessions added yet.</p>
                )}
                {scheduleList.map((session) => (
                    <div key={session._id} className="col-12 col-md-6 col-lg-4">
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="d-flex flex-column">
                                {/* Header */}
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 className="fw-semibold mb-1 text-dark">{session.title}</h6>
                                        <p className="text-muted small mb-0">Expo: {session.expo?.name}</p>
                                    </div>
                                    <Badge bg="info" className="text-capitalize px-2 py-1">
                                        {new Date(session.date).toLocaleDateString("en-GB")}
                                    </Badge>
                                </div>

                                {/* Description */}
                                <p className="text-secondary small mb-2">{session.description}</p>

                                {/* Time */}
                                <p className="text-muted small mb-3">
                                    {session.startTime} - {session.endTime}
                                </p>

                                {/* Action Buttons */}
                                <div className="mt-auto d-flex justify-content-between">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => openEditModal(session)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => openDeleteModal(session)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* ----------------- ADD SESSION MODAL ----------------- */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Session</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddSession}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Expo</Form.Label>
                            <Form.Select
                                name="expo"
                                value={formData.expo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Expo</option>
                                {expos.map((expo) => (
                                    <option key={expo._id} value={expo._id}>
                                        {expo.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Row>
                            <Form.Group className="mb-3 col-6">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-3">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-3">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={updatingId === "add"}>
                            {updatingId === "add" ? "Adding..." : "Add Session"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ----------------- EDIT SESSION MODAL ----------------- */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Session</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditSession}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Expo</Form.Label>
                            <Form.Select
                                name="expo"
                                value={formData.expo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Expo</option>
                                {expos.map((expo) => (
                                    <option key={expo._id} value={expo._id}>
                                        {expo.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Row>
                            <Form.Group className="mb-3 col-6">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-3">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 col-3">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={updatingId === currentSession?._id}
                        >
                            {updatingId === currentSession?._id ? "Updating..." : "Update Session"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ----------------- DELETE SESSION MODAL ----------------- */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete session "{sessionToDelete?.title}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleDeleteSession}
                        disabled={updatingId === sessionToDelete?._id}
                    >
                        {updatingId === sessionToDelete?._id ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>

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
        .badge {
          font-size: 12px;
        }
        .btn {
          transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
          border-radius: 8px;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
        </div>
    );
};

export default ManageSchedule;
