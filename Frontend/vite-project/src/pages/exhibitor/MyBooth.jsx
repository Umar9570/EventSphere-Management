// src/pages/exhibitor/MyBooth.jsx
import React, { useEffect, useState, useContext } from "react";
import { Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const MyBooth = () => {
    const { user } = useContext(AuthContext);
    const [booth, setBooth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBooth = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // First get exhibitor profile
            const exRes = await api.get(`/exhibitors/user/${user.id}`);

            if (!exRes.data.status || !exRes.data.exhibitor) {
                setBooth(null);
                return;
            }

            const exhibitorId = exRes.data.exhibitor._id;

            // Now fetch booth assigned to this exhibitor
            const boothRes = await api.get(`/booths/exhibitor/${exhibitorId}`);

            if (boothRes.data.status && boothRes.data.booth) {
                setBooth(boothRes.data.booth);
            } else {
                setBooth(null);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load booth data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooth();
    }, [user]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2">Loading your booth...</p>
            </div>
        );
    }

    if (!booth) {
        return (
            <p className="text-center text-muted">
                You have not been assigned a booth yet.
            </p>
        );
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
                    <h5 className="fw-bold mb-3">
                        {booth.expo?.name || "Expo Information"}
                    </h5>

                    <Row className="mb-2">
                        <Col md={6}>
                            <strong>Booth Number:</strong>
                            <p>{booth.boothNumber || "-"}</p>
                        </Col>
                        <Col md={6}>
                            <strong>Location:</strong>
                            <p>{booth.location || "-"}</p>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={6}>
                            <strong>Expo Location:</strong>
                            <p>{booth.expo?.location || "-"}</p>
                        </Col>
                        <Col md={6}>
                            <strong>Expo Dates:</strong>
                            <p>
                                {booth.expo
                                    ? `${new Date(booth.expo.startDate).toLocaleDateString()} - ${new Date(booth.expo.endDate).toLocaleDateString()}`
                                    : "-"}
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <style>{`
                .my-booth-page h4 { color: #0f172a; }
                .card { border-radius: 14px; }
            `}</style>
        </div>
    );
};

export default MyBooth;
