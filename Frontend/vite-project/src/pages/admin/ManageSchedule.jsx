import React, { useState, useEffect } from "react";
import {
    Table,
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

    // Filter state
    const [selectedFilter, setSelectedFilter] = useState("all");

    // Modals
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        expo: "",
        startTime: "",
        endTime: "",
    });

    const [updatingId, setUpdatingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedExpo, setSelectedExpo] = useState(null);

    // Format time for display (e.g., "09:00" -> "9:00 AM")
    const formatTime = (time) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

    // Check if expo is current or future
    const isCurrentOrFuture = (expoDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expo = new Date(expoDate);
        expo.setHours(0, 0, 0, 0);
        return expo >= today;
    };

    // ---------------- FETCH SCHEDULE ----------------
    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/schedule");
            if (data.status) {
                setScheduleList(data.schedule);
            }
            const { data: exposData } = await api.get("/expos");
            if (exposData.status) {
                // Filter only current/future expos
                const currentFutureExpos = exposData.expos.filter(expo =>
                    isCurrentOrFuture(expo.date)
                );
                setExpos(currentFutureExpos);
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

        // If expo is changed, update selected expo
        if (name === "expo") {
            const expo = expos.find(ex => ex._id === value);
            setSelectedExpo(expo);
            // Reset times when expo changes
            setFormData((prev) => ({
                ...prev,
                expo: value,
                startTime: "",
                endTime: ""
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ---------------- OPEN MODALS ----------------
    const openEditModal = (session) => {
        setCurrentSession(session);
        const expo = expos.find(ex => ex._id === session.expo?._id);
        setSelectedExpo(expo);
        setFormData({
            title: session.title,
            description: session.description,
            expo: session.expo?._id || "",
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
            startTime: "",
            endTime: "",
        });
        setSelectedExpo(null);
        setShowAddModal(true);
    };

    // ---------------- ADD SESSION ----------------
    const handleAddSession = async (e) => {
        e.preventDefault();

        // Validate times are within expo range
        if (selectedExpo) {
            if (formData.startTime < selectedExpo.startTime || formData.endTime > selectedExpo.endTime) {
                toast.error(`Session times must be between ${formatTime(selectedExpo.startTime)} and ${formatTime(selectedExpo.endTime)}`);
                return;
            }
            if (formData.startTime >= formData.endTime) {
                toast.error("End time must be after start time");
                return;
            }
        }

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

        // Validate times are within expo range
        if (selectedExpo) {
            if (formData.startTime < selectedExpo.startTime || formData.endTime > selectedExpo.endTime) {
                toast.error(`Session times must be between ${formatTime(selectedExpo.startTime)} and ${formatTime(selectedExpo.endTime)}`);
                return;
            }
            if (formData.startTime >= formData.endTime) {
                toast.error("End time must be after start time");
                return;
            }
        }

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

    // ---------------- FILTER AND GROUP SCHEDULES ----------------
    const getFilteredSchedules = () => {
        // Filter schedules by expo (only current/future expos)
        const currentFutureSchedules = scheduleList.filter(session => {
            const expo = expos.find(e => e._id === session.expo?._id);
            return expo && isCurrentOrFuture(expo.date);
        });

        if (selectedFilter === "all") {
            return currentFutureSchedules;
        }
        return currentFutureSchedules.filter(session => session.expo?._id === selectedFilter);
    };

    const groupSchedulesByExpo = () => {
        const filteredSchedules = getFilteredSchedules();
        const grouped = {};

        filteredSchedules.forEach(session => {
            const expoId = session.expo?._id;
            if (!grouped[expoId]) {
                grouped[expoId] = {
                    expo: session.expo,
                    sessions: []
                };
            }
            grouped[expoId].sessions.push(session);
        });

        // Sort sessions within each group by start time
        Object.values(grouped).forEach(group => {
            group.sessions.sort((a, b) => a.startTime.localeCompare(b.startTime));
        });

        return grouped;
    };

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="text-muted mt-2">Loading schedule...</p>
            </div>
        );

    const groupedSchedules = groupSchedulesByExpo();
    const filteredSchedules = getFilteredSchedules();

    return (
        <div className="manage-schedule-page">
            <div className="grid-wrapper">
                <div className="grid-background"></div>
            </div>
            <div className="p-4" style={{ position: "relative", zIndex: 10 }}>
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

                {/* Filter Section */}
                <div className="mb-4">
                    <Row className="align-items-center">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="fw-semibold text-muted">Filter by Expo</Form.Label>
                                <Form.Select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="shadow-sm"
                                >
                                    <option value="all">All Expos</option>
                                    {expos.map((expo) => (
                                        <option key={expo._id} value={expo._id}>
                                            {expo.name} - {new Date(expo.date).toLocaleDateString()}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={8} className="text-md-end mt-3 mt-md-0">
                            <Badge bg="secondary" className="px-3 py-2">
                                Total Sessions: {filteredSchedules.length}
                            </Badge>
                        </Col>
                    </Row>
                </div>

                {/* Schedules Tables Grouped by Expo */}
                {Object.keys(groupedSchedules).length === 0 ? (
                    <Alert variant="info" className="text-center">
                        <i className="bi bi-info-circle me-2"></i>
                        No sessions scheduled for current or upcoming expos.
                    </Alert>
                ) : (
                    Object.values(groupedSchedules).map((group) => (
                        <div key={group.expo._id} className="mb-5">
                            {/* Expo Header */}
                            <div className="expo-header-card shadow-sm p-3 mb-3">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div>
                                        <h5 className="fw-bold mb-1 text-dark">
                                            <i className="bi bi-calendar-event me-2 text-primary"></i>
                                            {group.expo.name}
                                        </h5>
                                        <p className="text-muted small mb-0">
                                            <i className="bi bi-geo-alt me-1"></i>
                                            {group.expo.location} • {" "}
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {new Date(group.expo.date).toLocaleDateString("en-US", {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })} • {" "}
                                            <i className="bi bi-clock me-1"></i>
                                            {formatTime(group.expo.startTime)} - {formatTime(group.expo.endTime)}
                                        </p>
                                    </div>
                                    <Badge bg="primary" className="px-3 py-2">
                                        {group.sessions.length} {group.sessions.length === 1 ? 'Session' : 'Sessions'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Sessions Table */}
                            <div className="table-container shadow-sm">
                                <Table hover responsive className="session-table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ minWidth: '200px' }}>Session Title</th>
                                            <th style={{ minWidth: '250px' }}>Description</th>
                                            <th style={{ minWidth: '180px' }}>Time</th>
                                            <th style={{ minWidth: '120px' }} className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.sessions.map((session) => (
                                            <tr key={session._id}>
                                                <td>
                                                    <strong className="text-dark">{session.title}</strong>
                                                </td>
                                                <td>
                                                    <span className="text-muted small">
                                                        {session.description || "-"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Badge bg="info" className="px-2 py-1">
                                                        <i className="bi bi-clock me-1"></i>
                                                        {formatTime(session.startTime)} - {formatTime(session.endTime)}
                                                    </Badge>
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex gap-1 justify-content-center">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => openEditModal(session)}
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            onClick={() => openDeleteModal(session)}
                                                            title="Delete"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    ))
                )}

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
                                            {expo.name} - {expo.date ? new Date(expo.date).toLocaleDateString() : ""}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {selectedExpo && (
                                <Alert variant="info" className="mb-3">
                                    <small>
                                        <i className="bi bi-info-circle me-2"></i>
                                        Expo operates from {formatTime(selectedExpo.startTime)} to {formatTime(selectedExpo.endTime)}
                                    </small>
                                </Alert>
                            )}

                            <Row>
                                <Form.Group className="mb-3 col-6">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        min={selectedExpo?.startTime || ""}
                                        max={selectedExpo?.endTime || ""}
                                        disabled={!formData.expo}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-6">
                                    <Form.Label>End Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        min={selectedExpo?.startTime || ""}
                                        max={selectedExpo?.endTime || ""}
                                        disabled={!formData.expo}
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
                                            {expo.name} - {expo.date ? new Date(expo.date).toLocaleDateString() : ""}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {selectedExpo && (
                                <Alert variant="info" className="mb-3">
                                    <small>
                                        <i className="bi bi-info-circle me-2"></i>
                                        Expo operates from {formatTime(selectedExpo.startTime)} to {formatTime(selectedExpo.endTime)}
                                    </small>
                                </Alert>
                            )}

                            <Row>
                                <Form.Group className="mb-3 col-6">
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        min={selectedExpo?.startTime || ""}
                                        max={selectedExpo?.endTime || ""}
                                        disabled={!formData.expo}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3 col-6">
                                    <Form.Label>End Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        min={selectedExpo?.startTime || ""}
                                        max={selectedExpo?.endTime || ""}
                                        disabled={!formData.expo}
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
            </div>

            {/* Styles */}
            <style>{`
            body{
                overflow-x: auto;
            }

            .expo-header-card {
                border-radius: 12px;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                border-left: 4px solid #0d6efd;
            }

            .table-container {
                border-radius: 8px;
                overflow-x: auto;
                overflow-y: visible;
                -webkit-overflow-scrolling: touch;
                width: 70vw !important;
                background: white;
            }

            .session-table {
                margin-bottom: 0 !important;
                width: 100%;
            }

            .session-table thead th {
                font-weight: 600;
                color: #495057;
                border-bottom: 2px solid #dee2e6;
                padding: 12px;
                white-space: nowrap;
                background-color: #f8f9fa;
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .session-table tbody td {
                padding: 12px;
                vertical-align: middle;
                white-space: nowrap;
            }

            .session-table tbody tr:hover {
                background-color: #f8f9fa;
            }

            /* Make description text wrap */
            .session-table tbody td:nth-child(2) span {
                white-space: normal;
                display: block;
                max-width: 250px;
            }

            .badge {
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
            }
            
            .btn {
                transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
                border-radius: 6px;
            }
            
            .btn:hover {
                transform: translateY(-2px);
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

            /* Custom scrollbar for table */
            .table-container::-webkit-scrollbar {
                height: 8px;
            }

            .table-container::-webkit-scrollbar-track {
                background: #f1f1f1 !important;
                border-radius: 10px;
            }

            .table-container::-webkit-scrollbar-thumb {
                background: #888 !important;
                border-radius: 10px;
            }

            .table-container::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            @media (max-width: 768px) {
                .expo-header-card h5 {
                    font-size: 1rem;
                }
                
                .session-table {
                    font-size: 0.875rem;
                }

                .session-table thead th,
                .session-table tbody td {
                    padding: 8px;
                    font-size: 0.85rem;
                }
                .table-container{
                    width: 90vw !important;
                }
            }

            @media (max-width: 576px) {
                .session-table {
                    font-size: 0.8rem;
                }

                .session-table thead th,
                .session-table tbody td {
                    padding: 6px;
                    font-size: 0.75rem;
                }

                .session-table tbody td:nth-child(2) span {
                    max-width: 150px;
                }
                .table-container{
                    width: 80vw !important;
                }
            }
        `}</style>
        </div>
    );
};

export default ManageSchedule;