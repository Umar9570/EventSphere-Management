import React, { useState, useEffect } from "react";
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
import api from "../../api/axios";
import { toast } from "react-toastify";

const ManageAttendees = () => {
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEditModal, setShowEditModal] = useState(false);
    const [currentAttendee, setCurrentAttendee] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [attendeeToDelete, setAttendeeToDelete] = useState(null);

    // ------------------ FETCH ALL ------------------
    const fetchAttendees = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/attendees");

            const normalized = data.attendees.map((a) => ({
                _id: a._id,
                firstName: a.user?.firstName,
                lastName: a.user?.lastName,
                email: a.user?.email,
                phone: a.user?.phone,
                status: a.user?.status || "Not Attended",
                createdAt: a.createdAt,
                attendedEvents: a.attendedEvents || 0,
            }));

            setAttendees(normalized);
        } catch (err) {
            toast.error("Failed to load attendees");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ------------------ EDIT ------------------
    const openEditModal = (att) => {
        setCurrentAttendee(att);
        setFormData(att);
        setShowEditModal(true);
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await api.put(`/attendees/${currentAttendee._id}`, formData);

            if (data.status) {
                toast.success("Attendee updated");
                setShowEditModal(false);
                fetchAttendees();
            }
        } catch {
            toast.error("Error updating attendee");
        }
    };

    // ------------------ DELETE ------------------
    const openDeleteModal = (att) => {
        setAttendeeToDelete(att);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const { data } = await api.delete(`/attendees/${attendeeToDelete._id}`);

            if (data.status) {
                toast.success("Attendee deleted");
                fetchAttendees();
            }
        } catch {
            toast.error("Error deleting attendee");
        }
        setShowDeleteModal(false);
    };

    if (loading)
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading attendees...</p>
            </div>
        );

    return (
        <div className="manage-attendee-page">
            <div className="grid-wrapper">
                <div className="grid-background"></div>
            </div>
            <div className="p-4" style={{ position: "relative", zIndex: 10 }}>
                <h4 className="fw-semibold mb-4">All Attendees</h4>

                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                    {attendees.map((att) => (
                        <Col key={att._id}>
                            <Card className="shadow-sm border-0 h-100 attendee-card">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6 className="fw-bold">
                                            {att.firstName} {att.lastName}
                                        </h6>

                                        <Badge bg={att.status === "Attended" ? "success" : "secondary"}>
                                            {att.status}
                                        </Badge>
                                    </div>

                                    <p className="text-muted small mb-1">
                                        <i className="bi bi-envelope me-1"></i>
                                        {att.email}
                                    </p>

                                    <p className="text-muted small mb-1">
                                        <i className="bi bi-telephone me-1"></i>
                                        {att.phone}
                                    </p>

                                    <p className="text-muted small mb-1">
                                        <i className="bi bi-ticket-detailed me-1"></i>
                                        Events Attended: {att.attendedEvents}
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
            <style>{`
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

export default ManageAttendees;
