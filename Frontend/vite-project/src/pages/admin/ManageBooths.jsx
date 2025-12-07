import React, { useEffect, useState } from "react";
import {
    Card,
    Button,
    Modal,
    Form,
    Spinner,
    Badge,
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

    const [updatingId, setUpdatingId] = useState(null);

    // ---------------- FETCH BOOTHS & EXPO ----------------
    const fetchAll = async () => {
        try {
            setLoading(true);

            const boothRes = await api.get("/booths");
            const expoRes = await api.get("/expos");

            if (boothRes.data.status) setBooths(boothRes.data.booths || []);
            if (expoRes.data.status) setExpos(expoRes.data.expos || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch booths or expos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // ---------------- HANDLE FORM CHANGE ----------------
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // If expo changes, fetch exhibitors for that expo
        if (name === "expo") {
            setFormData(prev => ({ ...prev, assignedTo: "" })); // reset assignedTo
            if (value) {
                try {
                    const { data } = await api.get(`/exhibitors/expo/${value}`);
                    if (data.status) {
                        // Only approved exhibitors
                        const approvedExhibitors = data.exhibitors.filter(ex => ex.status === "approved");
                        setExhibitors(approvedExhibitors);
                    }
                } catch (err) {
                    console.error(err);
                    toast.error("Failed to fetch exhibitors for selected expo.");
                    setExhibitors([]);
                }
            } else {
                setExhibitors([]);
            }
        }
    };

    // ---------------- ADD BOOTH ----------------
    const handleAddBooth = async (e) => {
        e.preventDefault();
        try {
            setUpdatingId("add");
            const payload = {
                ...formData,
                assignedTo: formData.assignedTo || null,
            };
            const { data } = await api.post("/booths", payload);
            if (data.status) {
                toast.success("Booth created successfully!");
                setShowAddModal(false);
                setFormData({ boothNumber: "", location: "", expo: "", assignedTo: "" });
                setExhibitors([]);
                fetchAll();
            } else {
                toast.error(data.message || "Failed to create booth");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while adding booth.");
        } finally {
            setUpdatingId(null);
        }
    };

    // ---------------- OPEN EDIT MODAL ----------------
    const openEditModal = async (booth) => {
        setCurrentBooth(booth);
        setFormData({
            boothNumber: booth.boothNumber,
            location: booth.location,
            expo: booth.expo?._id || "",
            assignedTo: booth.assignedTo?._id || "",
        });

        // fetch approved exhibitors for this expo
        if (booth.expo?._id) {
            try {
                const { data } = await api.get(`/exhibitors/expo/${booth.expo._id}`);
                if (data.status) {
                    const approvedExhibitors = data.exhibitors.filter(ex => ex.status === "approved");
                    setExhibitors(approvedExhibitors);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch exhibitors for selected expo.");
                setExhibitors([]);
            }
        } else {
            setExhibitors([]);
        }

        setShowEditModal(true);
    };

    // ---------------- EDIT BOOTH ----------------
    const handleEditBooth = async (e) => {
        e.preventDefault();
        try {
            setUpdatingId(currentBooth._id);
            const payload = {
                ...formData,
                assignedTo: formData.assignedTo || null,
            };
            const { data } = await api.put(`/booths/${currentBooth._id}`, payload);
            if (data.status) {
                toast.success("Booth updated successfully!");
                setShowEditModal(false);
                setExhibitors([]);
                fetchAll();
            } else {
                toast.error(data.message || "Failed to update booth");
            }
        } catch (err) {
            console.error(err);
            toast.error("Server error while updating booth.");
        } finally {
            setUpdatingId(null);
        }
    };

    // ---------------- DELETE BOOTH ----------------
    const handleDeleteBooth = async () => {
        if (!currentBooth) return;
        try {
            setUpdatingId(currentBooth._id);
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
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="text-muted mt-2">Loading booths...</p>
            </div>
        );
    }

    return (
        <div className="manage-booths-page">
            <div className="grid-wrapper">
                <div className="grid-background"></div>
            </div>
            <div className="p-4" style={{ position: "relative", zIndex: 10 }}>
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 className="fw-semibold text-secondary mb-0">Manage Booths</h4>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus-circle me-2"></i> Add Booth
                    </Button>
                </div>

                {/* EMPTY STATE */}
                {booths.length === 0 && <p className="text-center text-muted">No booths found.</p>}

                {/* BOOTHS GRID */}
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
                                    <p className="text-muted small mt-2"><i className="bi bi-geo-alt me-2"></i>{b.location}</p>
                                    <p className="text-muted small mb-1"><i className="bi bi-shop me-2"></i>Expo: {b.expo?.name || "N/A"}</p>
                                    {b.assignedTo && <p className="text-muted small"><i className="bi bi-person-check me-2"></i>{b.assignedTo.organization}</p>}

                                    {/* ACTION BUTTONS */}
                                    <div className="mt-auto d-flex justify-content-between">
                                        <Button variant="outline-primary" size="sm" onClick={() => openEditModal(b)}>
                                            <i className="bi bi-pencil"></i>
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => { setCurrentBooth(b); setShowDeleteModal(true); }}
                                            disabled={updatingId === b._id}
                                        >
                                            {updatingId === b._id ? <Spinner size="sm" animation="border" /> : <i className="bi bi-trash"></i>}
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* ADD MODAL */}
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Booth</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleAddBooth}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Booth Number</Form.Label>
                                <Form.Control name="boothNumber" value={formData.boothNumber} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Control name="location" value={formData.location} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Select Expo</Form.Label>
                                <Form.Select name="expo" value={formData.expo} onChange={handleChange} required>
                                    <option value="">Select Expo</option>
                                    {expos.map((expo) => <option key={expo._id} value={expo._id}>{expo.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Assign Exhibitor (approved only)</Form.Label>
                                <Form.Select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                                    <option value="">No assignment</option>
                                    {exhibitors.map((ex) => <option key={ex._id} value={ex._id}>{ex.organization}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={updatingId === "add"}>{updatingId === "add" ? "Adding..." : "Add Booth"}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                {/* EDIT MODAL */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Booth</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleEditBooth}>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Label>Booth Number</Form.Label>
                                <Form.Control name="boothNumber" value={formData.boothNumber} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Location</Form.Label>
                                <Form.Control name="location" value={formData.location} onChange={handleChange} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Select Expo</Form.Label>
                                <Form.Select name="expo" value={formData.expo} onChange={handleChange} required>
                                    <option value="">Select Expo</option>
                                    {expos.map((expo) => <option key={expo._id} value={expo._id}>{expo.name}</option>)}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Assign Exhibitor (approved only)</Form.Label>
                                <Form.Select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                                    <option value="">No assignment</option>
                                    {exhibitors.map((ex) => <option key={ex._id} value={ex._id}>{ex.organization}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={updatingId === currentBooth?._id}>
                                {updatingId === currentBooth?._id ? "Updating..." : "Save Changes"}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>

                {/* DELETE MODAL */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Booth</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete booth <strong>{currentBooth?.boothNumber}</strong>?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteBooth} disabled={updatingId === currentBooth?._id}>
                            {updatingId === currentBooth?._id ? "Deleting..." : "Delete"}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <style>{`
                .booth-card {
                  border-radius: 14px;
                  transition: all 0.25s ease;
                }
                .booth-card:hover {
                  transform: translateY(-4px);
                  box-shadow: 0 4px 14px rgba(54, 21, 21, 0.08);
                }
                .btn {
                  border-radius: 8px;
                  transition: all 0.25s ease;
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
            `}</style>
        </div>
    );
};

export default ManageBooths;
