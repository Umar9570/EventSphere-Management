import React, { useEffect, useState } from "react";
import {
    Card,
    Button,
    Modal,
    Form,
    Row,
    Col,
    Spinner,
    Badge,
    Alert,
} from "react-bootstrap";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ManageBooths = () => {
    const [booths, setBooths] = useState([]);
    const [expos, setExpos] = useState([]);
    const [exhibitors, setExhibitors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [currentBooth, setCurrentBooth] = useState(null);

    const [formData, setFormData] = useState({
        boothNumber: "",
        location: "",
        expo: "",
        assignedTo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    // ===================== FETCH BOOTHS =====================
    const fetchAll = async () => {
        try {
            setLoading(true);

            const [boothRes, expoRes, exhibRes] = await Promise.all([
                api.get("/booths"),
                api.get("/expo"),
                api.get("/exhibitors"),
            ]);

            setBooths(boothRes.data.booths || []);
            setExpos(expoRes.data.expos || []);
            setExhibitors(exhibRes.data.exhibitors || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch booths.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // ===================== ADD BOOTH =====================
    const handleAddBooth = async (e) => {
        e.preventDefault();

        try {
            const { data } = await api.post("/booths", formData);

            if (data.status) {
                toast.success("Booth created successfully!");
                setShowAddModal(false);
                fetchAll();
                setFormData({
                    boothNumber: "",
                    location: "",
                    expo: "",
                    assignedTo: "",
                });
            } else {
                toast.error(data.message || "Failed to create booth");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while adding booth.");
        }
    };

    // ===================== OPEN EDIT =====================
    const openEdit = (booth) => {
        setCurrentBooth(booth);
        setFormData({
            boothNumber: booth.boothNumber,
            location: booth.location,
            expo: booth.expo?._id || "",
            assignedTo: booth.assignedTo?._id || "",
        });
        setShowEditModal(true);
    };

    // ===================== UPDATE BOOTH =====================
    const handleEditBooth = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put(`/booths/${currentBooth._id}`, formData);

            if (data.status) {
                toast.success("Booth updated successfully!");
                setShowEditModal(false);
                fetchAll();
            } else {
                toast.error(data.message || "Failed to update booth");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while updating booth.");
        }
    };

    // ===================== DELETE BOOTH =====================
    const handleDeleteBooth = async () => {
        try {
            const { data } = await api.delete(`/booths/${currentBooth._id}`);

            if (data.status) {
                toast.success("Booth deleted successfully.");
                setShowDeleteModal(false);
                fetchAll();
            } else {
                toast.error(data.message || "Failed to delete booth");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while deleting booth.");
        }
    };

    // ===================== UI LOADING =====================
    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="text-muted mt-2">Loading booths...</p>
            </div>
        );
    }

    return (
        <div className="p-4">

            {/* ========== HEADER ========== */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h4 className="fw-semibold text-secondary mb-0">Manage Booths</h4>

                <Button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <i className="bi bi-plus-circle me-2"></i>Add Booth
                </Button>
            </div>

            {/* ========== EMPTY STATE ========== */}
            {booths.length === 0 && (
                <p className="text-center text-muted">No booths found.</p>
            )}

            {/* ========== BOOTHS GRID ========== */}
            <div className="row g-4">
                {booths.map((b) => (
                    <div className="col-12 col-md-6 col-lg-4" key={b._id}>
                        <Card className="shadow-sm border-0 h-100 booth-card">
                            <Card.Body className="d-flex flex-column">
                                <div className="d-flex justify-content-between">
                                    <h5 className="fw-semibold">Booth {b.boothNumber}</h5>

                                    <Badge bg={b.assignedTo ? "success" : "secondary"}>
                                        {b.assignedTo ? "Assigned" : "Unassigned"}
                                    </Badge>
                                </div>

                                <p className="text-muted small mt-2">
                                    <i className="bi bi-geo-alt me-2"></i>
                                    {b.location}
                                </p>

                                <p className="text-muted small mb-1">
                                    <i className="bi bi-shop me-2"></i>
                                    Expo: {b.expo?.title || "N/A"}
                                </p>

                                {b.assignedTo && (
                                    <p className="text-muted small">
                                        <i className="bi bi-person-check me-2"></i>
                                        {b.assignedTo.firstName} {b.assignedTo.lastName}
                                    </p>
                                )}

                                {/* ACTION BUTTONS */}
                                <div className="mt-auto d-flex justify-content-between">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => openEdit(b)}
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => {
                                            setCurrentBooth(b);
                                            setShowDeleteModal(true);
                                        }}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* ===================================================
          ADD BOOTH MODAL
      =================================================== */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Booth</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddBooth}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Booth Number</Form.Label>
                            <Form.Control
                                name="boothNumber"
                                value={formData.boothNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Select Expo</Form.Label>
                            <Form.Select
                                name="expo"
                                value={formData.expo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select expo</option>
                                {expos.map((e) => (
                                    <option key={e._id} value={e._id}>
                                        {e.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Assign Exhibitor (optional)</Form.Label>
                            <Form.Select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                            >
                                <option value="">No assignment</option>
                                {exhibitors.map((ex) => (
                                    <option key={ex._id} value={ex._id}>
                                        {ex.firstName} {ex.lastName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Add Booth
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ===================================================
          EDIT BOOTH MODAL
      =================================================== */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Booth</Modal.Title>
                </Modal.Header>

                <Form onSubmit={handleEditBooth}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Booth Number</Form.Label>
                            <Form.Control
                                name="boothNumber"
                                value={formData.boothNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Select Expo</Form.Label>
                            <Form.Select
                                name="expo"
                                value={formData.expo}
                                onChange={handleChange}
                                required
                            >
                                {expos.map((e) => (
                                    <option key={e._id} value={e._id}>
                                        {e.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Assign Exhibitor</Form.Label>
                            <Form.Select
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                            >
                                <option value="">No assignment</option>
                                {exhibitors.map((ex) => (
                                    <option key={ex._id} value={ex._id}>
                                        {ex.firstName} {ex.lastName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ===================================================
          DELETE MODAL
      =================================================== */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Booth</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete booth{" "}
                    <strong>{currentBooth?.boothNumber}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteBooth}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ========== CSS ========== */}
            <style>{`
        .booth-card {
          border-radius: 14px;
          transition: all 0.25s ease;
        }
        .booth-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }
        .btn {
          border-radius: 8px;
        }
        .btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
        </div>
    );
};

export default ManageBooths;
