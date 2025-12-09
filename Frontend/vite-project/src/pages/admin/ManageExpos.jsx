import React, { useEffect, useState, useContext } from "react";
import { Card, Button, Spinner, Modal, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { FaImage, FaCloudUploadAlt } from "react-icons/fa";

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
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        image: "",
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [expoToDelete, setExpoToDelete] = useState(null);

    // Cloudinary configuration
    const CLOUDINARY_UPLOAD_PRESET = "EventManagement"; // Replace with your preset
    const CLOUDINARY_CLOUD_NAME = "dlsnlocky"; // Replace with your cloud name

    // Format time for display (e.g., "09:00" -> "9:00 AM")
    const formatTime = (time) => {
        if (!time) return "";
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    };

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

    // Upload image to Cloudinary
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("Image size should be less than 5MB");
            return;
        }

        setUploading(true);

        try {
            const formDataCloud = new FormData();
            formDataCloud.append("file", file);
            formDataCloud.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formDataCloud,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                setFormData({ ...formData, image: data.secure_url });
            } else {
                alert("Failed to upload image. Please try again.");
            }
        } catch (err) {
            console.error("Image upload error:", err);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    // Remove image
    const handleRemoveImage = () => {
        setFormData({ ...formData, image: "" });
    };

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
                setFormData({ name: "", description: "", location: "", date: "", startTime: "", endTime: "", image: "" });
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
            date: expo.date?.slice(0, 10),
            startTime: expo.startTime,
            endTime: expo.endTime,
            image: expo.image || "",
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

    // Close modal and reset form
    const closeAddModal = () => {
        setShowAddModal(false);
        setFormData({ name: "", description: "", location: "", date: "", startTime: "", endTime: "", image: "" });
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setFormData({ name: "", description: "", location: "", date: "", startTime: "", endTime: "", image: "" });
    };

    // Default expo image
    const defaultExpoImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop";

    return (
        <div className="manage-expos-page">
            <div className="grid-wrapper">
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
                                {/* Expo Image */}
                                <div className="expo-card-image-wrapper">
                                    <Card.Img 
                                        variant="top" 
                                        src={expo.image || defaultExpoImage} 
                                        alt={expo.name}
                                        className="expo-card-image"
                                        onError={(e) => {
                                            e.target.src = defaultExpoImage;
                                        }}
                                    />
                                    <div className="expo-card-overlay">
                                        <Badge bg="primary">{expo.location}</Badge>
                                    </div>
                                </div>
                                <Card.Body className="d-flex flex-column">
                                    <h5 className="fw-bold text-dark">{expo.name}</h5>
                                    <p className="text-muted mt-2 small">{expo.description}</p>
                                    <p className="text-muted small mb-1">
                                        <i className="bi bi-calendar-event me-2"></i>
                                        {new Date(expo.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-muted small mb-1">
                                        <i className="bi bi-clock me-2"></i>
                                        {formatTime(expo.startTime)} - {formatTime(expo.endTime)}
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
                <ExpoModal 
                    show={showAddModal} 
                    onHide={closeAddModal} 
                    onSubmit={handleAddExpo} 
                    saving={saving} 
                    formData={formData} 
                    handleChange={handleChange}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    uploading={uploading}
                    title="Add New Expo" 
                />
                <ExpoModal 
                    show={showEditModal} 
                    onHide={closeEditModal} 
                    onSubmit={handleUpdateExpo} 
                    saving={saving} 
                    formData={formData} 
                    handleChange={handleChange}
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    uploading={uploading}
                    title="Edit Expo" 
                />

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
                    overflow: hidden;
                }
                .card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
                }
                .btn {
                    border-radius: 8px;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .expo-card-image-wrapper {
                    position: relative;
                    height: 180px;
                    overflow: hidden;
                }

                .expo-card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .expo-card:hover .expo-card-image {
                    transform: scale(1.05);
                }

                .expo-card-overlay {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                }

                .image-upload-wrapper {
                    border: 2px dashed #dee2e6;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: #f8f9fa;
                }

                .image-upload-wrapper:hover {
                    border-color: #1099a8;
                    background: rgba(16, 153, 168, 0.05);
                }

                .image-preview-wrapper {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .image-preview {
                    width: 100%;
                    max-height: 200px;
                    object-fit: cover;
                    border-radius: 12px;
                }

                .image-remove-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
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

// Separate modal component with image upload
const ExpoModal = ({ 
    show, 
    onHide, 
    onSubmit, 
    saving, 
    formData, 
    handleChange, 
    handleImageUpload, 
    handleRemoveImage, 
    uploading, 
    title 
}) => (
    <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={onSubmit}>
                {/* Image Upload Section */}
                <Form.Group className="mb-3">
                    <Form.Label>Expo Image</Form.Label>
                    {formData.image ? (
                        <div className="image-preview-wrapper">
                            <img 
                                src={formData.image} 
                                alt="Expo preview" 
                                className="image-preview"
                            />
                            <Button 
                                variant="danger" 
                                size="sm" 
                                className="image-remove-btn"
                                onClick={handleRemoveImage}
                                disabled={uploading}
                            >
                                <i className="bi bi-x-lg"></i>
                            </Button>
                        </div>
                    ) : (
                        <div className="image-upload-wrapper">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                                id="expo-image-upload"
                                disabled={uploading}
                            />
                            <label htmlFor="expo-image-upload" style={{ cursor: 'pointer', margin: 0 }}>
                                {uploading ? (
                                    <div>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Uploading...
                                    </div>
                                ) : (
                                    <div>
                                        <FaCloudUploadAlt size={40} className="text-muted mb-2" />
                                        <p className="text-muted mb-0">Click to upload image</p>
                                        <small className="text-muted">JPEG, PNG, WebP or GIF (Max 5MB)</small>
                                    </div>
                                )}
                            </label>
                        </div>
                    )}
                </Form.Group>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-2">
                            <Form.Label>Expo Name</Form.Label>
                            <Form.Control name="name" required value={formData.name} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-2">
                            <Form.Label>Location</Form.Label>
                            <Form.Control name="location" required value={formData.location} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" name="description" required value={formData.description} onChange={handleChange} rows={3} />
                </Form.Group>

                <Form.Group className="mb-2">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" name="date" required value={formData.date} onChange={handleChange} />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control type="time" name="startTime" required value={formData.startTime} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-2">
                            <Form.Label>End Time</Form.Label>
                            <Form.Control type="time" name="endTime" required value={formData.endTime} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                </Row>

                <div className="text-end mt-3">
                    <Button variant="secondary" className="me-2" onClick={onHide}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={saving || uploading}>
                        {saving ? <Spinner animation="border" size="sm" /> : "Save"}
                    </Button>
                </div>
            </Form>
        </Modal.Body>
    </Modal>
);

export default ManageExpos;