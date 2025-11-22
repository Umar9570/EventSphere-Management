// src/pages/exhibitor/MyBooth.jsx
import React, { useEffect, useState, useContext } from "react";
import { Card, Spinner, Button, Form, Row, Col, Alert } from "react-bootstrap";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const MyBooth = () => {
    const { user } = useContext(AuthContext);
    const [booth, setBooth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        boothNumber: "",
        location: "",
    });

    // Fetch exhibitor's booth
    const fetchBooth = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data } = await api.get(`/booths/exhibitor/${user._id}`);
            if (data.status && data.booth) {
                setBooth(data.booth);
                setFormData({
                    boothNumber: data.booth.boothNumber,
                    location: data.booth.location,
                });
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch booth data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooth();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            const { data } = await api.put(`/booths/${booth._id}`, formData);
            if (data.status) {
                setBooth(data.booth);
                alert("Booth updated successfully!");
            } else {
                alert(data.message || "Failed to update booth.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update booth.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2">Loading your booth...</p>
            </div>
        );
    }

    if (!booth) {
        return <p className="text-center text-muted">You have not been assigned a booth yet.</p>;
    }

    return (
        <div className="my-booth-page">
            <h4 className="fw-semibold text-secondary mb-4">My Booth</h4>

            {error && (
                <Alert variant="danger" onClose={() => setError("")} dismissible>
                    {error}
                </Alert>
            )}

            <Card className="shadow-sm border-0">
                <Card.Body>
                    <h5 className="fw-bold mb-3">{booth.expo?.name || "Expo Info"}</h5>

                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Booth Number</Form.Label>
                                    <Form.Control
                                        name="boothNumber"
                                        value={formData.boothNumber}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="text-end">
                            <Button variant="primary" onClick={handleUpdate} disabled={saving}>
                                {saving ? <Spinner size="sm" animation="border" /> : "Update Booth"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {/* Inline styles */}
            <style>{`
        .my-booth-page h4 {
          color: #0f172a;
        }
        .card {
          border-radius: 14px;
        }
      `}</style>
        </div>
    );
};

export default MyBooth;
