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
            <div className ="grid-wrapper">
                <div className="grid-background"></div>
            </div>
            <div className="col-sm-12 mb-5" style={{ position: "relative", zIndex: 10 }}>
                <div
                    className="profile-bg-picture"
                    style={{
                        backgroundImage: "url('https://media.istockphoto.com/id/1353476783/vector/abstract-teal-circles-background.jpg?s=612x612&w=0&k=20&c=twp8lq5iWEUJ3Wzkp4HGnF89WxDKG--ZKTofQtFop7M=')",
                    }}
                >
                    <span className="picture-bg-overlay"></span>

                    <div className="centered-title fs-1">
                        See Your Booth
                    </div>
                </div>
            </div>
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
                .my-booth-page h4 { color: #0f172a; }
                .card { border-radius: 14px; }
                .profile-bg-picture {
                    height: 260px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }

                .picture-bg-overlay {
                    background: rgba(0,0,0,0.4);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }                
                .centered-title {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: 700;
                    z-index: 2;
                    text-align: center;
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

export default MyBooth;
