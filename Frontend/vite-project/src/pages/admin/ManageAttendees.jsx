import React, { useState, useEffect, useContext } from "react";
import {
    Badge,
    Card,
    Row,
    Col,
    Button,
    Modal,
    Form,
    Spinner,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ManageAttendees = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAttendee, setCurrentAttendee] = useState(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    // Delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [attendeeToDelete, setAttendeeToDelete] = useState(null);

    // ------------------ FETCH ALL ATTENDEES ------------------
    const fetchAttendees = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/attendees");

            // Normalize
            const normalized = data.map((a) => ({
                ...a,
                _id: a._id || a.id,
            }));

            setAttendees(normalized);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load attendees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendees();
    }, []);

    // ------------------ FORM HANDLERS ------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ------------------ OPEN EDIT MODAL ------------------
    const openEditModal = (att) => {
        setCurrentAttendee(att);
        setFormData({
            firstName: att.firstName,
            lastName: att.lastName,
            email: att.email,
            phone: att.phone,
        });
        setShowEditModal(true);
    };

    // ------------------ SUBMIT EDIT ------------------
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const { _id } = currentAttendee;
            const { data } = await api.put(`/attendees/${_id}`, formData);

            if (data.status || data.success) {
                toast.success("Attendee updated");
                setShowEditModal(false);
                fetchAttendees();
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while updating attendee");
        }
    };

    // ------------------ DELETE ATTENDEE ------------------
    const openDeleteModal = (att) => {
        setAttendeeToDelete(att);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const { _id } = attendeeToDelete;
            const { data } = await api.delete(`/attendees/${_id}`);

            if (data.status || data.success) {
                toast.success("Attendee deleted");
                setShowDeleteModal(false);
                fetchAttendees();
            } else {
                toast.error(data.message || "Delete failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while deleting attendee");
        }
    };

    // UI LOADING
    if (loading)
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p className="mt-2">Loading attendees...</p>
            </div>
        );

    return (
        <div className="p-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="fw-semibold text-secondary mb-0">All Attendees</h4>
            </div>

            {/* Attendee Cards */}
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                {attendees.map((att) => (
                    <Col key={att._id}>
                        <Card className="border-0 shadow-sm attendee-card h-100">
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <h6 className="fw-semibold mb-0 text-dark">
                                        {att.firstName} {att.lastName}
                                    </h6>

                                    <Badge
                                        bg={att.status === "Attended" ? "success" : "secondary"}
                                        className="status-badge"
                                    >
                                        {att.status}
                                    </Badge>
                                </div>

                                <p className="mb-1 text-muted small">
                                    <i className="bi bi-envelope me-2"></i>
                                    {att.email}
                                </p>

                                <p className="mb-1 text-muted small">
                                    <i className="bi bi-telephone me-2"></i>
                                    {att.phone || "N/A"}
                                </p>

                                <p className="mb-2 text-muted small">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    Joined: {new Date(att.createdAt).toLocaleDateString()}
                                </p>

                                <p className="mb-0 text-muted small">
                                    <i className="bi bi-ticket-detailed me-2"></i>
                                    Events Attended: {att.attendedEvents || 0}
                                </p>

                                <div className="d-flex justify-content-end mt-3">
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="me-2"
                                        onClick={() => openEditModal(att)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => openDeleteModal(att)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* ------------------ EDIT MODAL ------------------ */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Attendee</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleEdit}>
                    <Modal.Body>
                        <Row>
                            <Form.Group className="mb-3 col-6">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 col-6">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Update Attendee
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ------------------ DELETE MODAL ------------------ */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Attendee</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to delete{" "}
                    <strong>
                        {attendeeToDelete?.firstName} {attendeeToDelete?.lastName}
                    </strong>{" "}
                    ?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Card Hover Styles */}
            <style>{`
        .attendee-card {
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1),
                      box-shadow 0.25s cubic-bezier(0.4,0,0.2,1);
          border-radius: 14px;
        }
        .attendee-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
        .status-badge {
          font-size: 11px;
          padding: 4px 8px;
        }
      `}</style>
        </div>
    );
};

export default ManageAttendees;
