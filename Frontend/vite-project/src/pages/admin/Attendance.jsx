import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Alert, Spinner, Row, Col, Badge } from "react-bootstrap";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../api/axios";
import { 
    FaUserCheck, 
    FaCalendarAlt, 
    FaMapMarkerAlt, 
    FaClock, 
    FaEnvelope, 
    FaPhone,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaHourglassHalf,
    FaQrcode,
    FaUserAlt
} from "react-icons/fa";

const Attendance = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const qrCodeRegionId = "qr-reader";
    const html5QrCodeRef = useRef(null);

    // Start scanning
    const startScanner = async () => {
        setMessage("");
        setMessageType("success");
        setScanResult(null);
        setScanning(true);

        const config = { 
            fps: 30, 
            qrbox: { width: 350, height: 550 },
            aspectRatio: 1.0
        };

        html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

        try {
            // Get available cameras
            const cameras = await Html5Qrcode.getCameras();
            
            // Find the main back camera (usually the one without "wide" in the name)
            let selectedCameraId = null;
            
            if (cameras && cameras.length > 0) {
                // Try to find a back camera that's not ultra-wide
                const backCamera = cameras.find(camera => {
                    const label = camera.label.toLowerCase();
                    return (label.includes('back') || label.includes('rear')) && 
                        !label.includes('wide') && 
                        !label.includes('ultra');
                });
                
                // If found, use it; otherwise use the last camera (usually main back camera)
                if (backCamera) {
                    selectedCameraId = backCamera.id;
                } else {
                    // Fallback: use the last back camera in the list (usually main)
                    const anyBackCamera = cameras.find(camera => {
                        const label = camera.label.toLowerCase();
                        return label.includes('back') || label.includes('rear') || label.includes('0');
                    });
                    selectedCameraId = anyBackCamera ? anyBackCamera.id : cameras[cameras.length - 1].id;
                }
            }

            // Camera constraints with zoom
            const cameraConstraints = selectedCameraId 
                ? { deviceId: { exact: selectedCameraId } }
                : {
                    facingMode: "environment",
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 },
                    advanced: [
                        { zoom: 1.0 },
                        { focusMode: "continuous" }
                    ]
                };

            await html5QrCodeRef.current.start(
                selectedCameraId || cameraConstraints,
                config,
                async (decodedText) => {
                    // Stop scanner first to prevent multiple scans
                    await stopScanner();
                    handleScan(decodedText);
                },
                (errorMessage) => {
                    // Ignore scanning errors
                }
            );

            // Try to apply zoom after camera starts
            try {
                const videoElement = document.querySelector(`#${qrCodeRegionId} video`);
                if (videoElement && videoElement.srcObject) {
                    const track = videoElement.srcObject.getVideoTracks()[0];
                    const capabilities = track.getCapabilities();
                    
                    if (capabilities.zoom) {
                        const minZoom = capabilities.zoom.min;
                        const maxZoom = capabilities.zoom.max;
                        // Apply 2x zoom or max available
                        const targetZoom = Math.min(4.0, maxZoom);
                        await track.applyConstraints({
                            advanced: [{ zoom: targetZoom }]
                        });
                    }
                }
            } catch (zoomError) {
                console.log("Zoom not supported or failed:", zoomError);
            }

        } catch (err) {
            console.error("QR scanner error:", err);
            setMessage("Unable to start camera. Please check permissions.");
            setMessageType("danger");
            setScanning(false);
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current.clear();
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
            setScanning(false);
        }
    };

    const handleScan = async (qrCode) => {
        setLoading(true);
        setScanResult(null);

        try {
            const { data } = await api.post("/event-registration/mark-attendance", { qrCode });
            setScanResult(data);

            if (data.status && data.type === "success") {
                setMessage("Attendance marked successfully!");
                setMessageType("success");
            } else if (data.type === "already_attended") {
                setMessage("Attendance was already marked.");
                setMessageType("info");
            } else {
                setMessage(data.message);
                setMessageType(data.type === "early" || data.type === "future" ? "warning" : "danger");
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Error scanning QR code. Please try again.";
            setMessage(errorMsg);
            setMessageType("danger");
            setScanResult({
                status: false,
                type: "error",
                message: errorMsg
            });
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setMessage("");
        startScanner();
    };

    // Get status icon based on type
    const getStatusIcon = (type) => {
        switch (type) {
            case "success":
                return <FaCheckCircle size={60} className="text-success" />;
            case "already_attended":
                return <FaUserCheck size={60} className="text-info" />;
            case "early":
            case "future":
                return <FaHourglassHalf size={60} className="text-warning" />;
            case "ended":
                return <FaTimesCircle size={60} className="text-secondary" />;
            case "invalid":
            case "error":
            default:
                return <FaExclamationTriangle size={60} className="text-danger" />;
        }
    };

    // Get status badge
    const getStatusBadge = (type) => {
        switch (type) {
            case "success":
                return <Badge bg="success" className="px-3 py-2">CHECKED IN</Badge>;
            case "already_attended":
                return <Badge bg="info" className="px-3 py-2">ALREADY ATTENDED</Badge>;
            case "early":
                return <Badge bg="warning" className="px-3 py-2">TOO EARLY</Badge>;
            case "future":
                return <Badge bg="warning" className="px-3 py-2">FUTURE EVENT</Badge>;
            case "ended":
                return <Badge bg="secondary" className="px-3 py-2">EVENT ENDED</Badge>;
            case "invalid":
                return <Badge bg="danger" className="px-3 py-2">INVALID QR</Badge>;
            default:
                return <Badge bg="danger" className="px-3 py-2">ERROR</Badge>;
        }
    };

    // Format attended time
    const formatAttendedTime = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Cleanup scanner on unmount
    useEffect(() => {
        return () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().catch(() => { });
            }
        };
    }, []);

    return (
        <div className="attendance-page">
            <div className="grid-wrapper">
                <div className="grid-background"></div>
            </div>
            <div className="p-0 p-sm-4" style={{ position: "relative", zIndex: 10 }}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 className="fw-semibold text-secondary mb-0">
                        <FaQrcode className="me-2" />
                        Attendance Scanner
                    </h4>
                    {!scanResult && (
                        scanning ? (
                            <Button variant="danger" onClick={stopScanner}>
                                <i className="bi bi-stop-circle me-2"></i>
                                Stop Scanner
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={startScanner}>
                                <i className="bi bi-qr-code-scan me-2"></i>
                                Start Scanner
                            </Button>
                        )
                    )}
                    {scanResult && (
                        <Button variant="primary" onClick={resetScanner}>
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Scan Another
                        </Button>
                    )}
                </div>

                {message && !scanResult && (
                    <Alert variant={messageType} onClose={() => setMessage("")} dismissible>
                        {message}
                    </Alert>
                )}

                {/* Scanner Card */}
                {!scanResult && (
                    <Card className="shadow-sm border-0 scanner-card">
                        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                            {loading && (
                                <div className="text-center mb-3">
                                    <Spinner animation="border" variant="primary" />
                                    <p className="text-muted mt-2">Processing QR Code...</p>
                                </div>
                            )}
                            <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "400px" }}></div>
                            {!scanning && !loading && (
                                <div className="text-center mt-3">
                                    <FaQrcode size={48} className="text-muted mb-3" />
                                    <p className="text-muted">
                                        Click "Start Scanner" to scan attendee QR codes
                                    </p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                )}

                {/* Scan Result Card */}
                {scanResult && (
                    <Row className="g-4">
                        {/* Status Card */}
                        <Col lg={12}>
                            <Card className={`shadow-sm border-0 status-card status-${scanResult.type}`}>
                                <Card.Body className="text-center py-4">
                                    <div className="status-icon mb-3">
                                        {getStatusIcon(scanResult.type)}
                                    </div>
                                    {getStatusBadge(scanResult.type)}
                                    <h4 className="mt-3 mb-2">{scanResult.message}</h4>
                                    {scanResult.attendedAt && scanResult.type !== "success" && (
                                        <p className="text-muted mb-0">
                                            <FaClock className="me-1" />
                                            Previously attended: {formatAttendedTime(scanResult.attendedAt)}
                                        </p>
                                    )}
                                    {scanResult.type === "success" && (
                                        <p className="text-muted mb-0">
                                            <FaClock className="me-1" />
                                            Checked in at: {formatAttendedTime(scanResult.attendedAt)}
                                        </p>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* User Info Card */}
                        {scanResult.userInfo && (
                            <Col md={6}>
                                <Card className="shadow-sm border-0 h-100 info-card">
                                    <Card.Header className="bg-primary text-white">
                                        <h5 className="mb-0">
                                            <FaUserAlt className="me-2" />
                                            Attendee Information
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="info-item">
                                            <div className="info-icon">
                                                <FaUserAlt />
                                            </div>
                                            <div className="info-content">
                                                <small className="text-muted">Full Name</small>
                                                <h5 className="mb-0">{scanResult.userInfo.name}</h5>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="info-item">
                                            <div className="info-icon">
                                                <FaEnvelope />
                                            </div>
                                            <div className="info-content">
                                                <small className="text-muted">Email</small>
                                                <p className="mb-0">{scanResult.userInfo.email}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="info-item">
                                            <div className="info-icon">
                                                <FaPhone />
                                            </div>
                                            <div className="info-content">
                                                <small className="text-muted">Phone</small>
                                                <p className="mb-0">{scanResult.userInfo.phone}</p>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}

                        {/* Expo Info Card */}
                        {scanResult.expoInfo && (
                            <Col md={6}>
                                <Card className="shadow-sm border-0 h-100 info-card">
                                    <Card.Header className="bg-info text-white">
                                        <h5 className="mb-0">
                                            <FaCalendarAlt className="me-2" />
                                            Expo Information
                                        </h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="info-item">
                                            <div className="info-icon">
                                                <FaCalendarAlt />
                                            </div>
                                            <div className="info-content">
                                                <small className="text-muted">Event Name</small>
                                                <h5 className="mb-0">{scanResult.expoInfo.name}</h5>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="info-item">
                                            <div className="info-icon">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <div className="info-content">
                                                <small className="text-muted">Location</small>
                                                <p className="mb-0">{scanResult.expoInfo.location}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="info-item">
                                            <div className="info-icon">
                                                <FaCalendarAlt />
                                            </div>
                                            <div className="info-content">
                                                <small className="text-muted">Date</small>
                                                <p className="mb-0">{scanResult.expoInfo.date}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="info-item">
                                            <div className="info-icon">
                                                <FaClock />
                                            </div>
                                            <div className="info-content">
                                                <small className="text-muted">Time</small>
                                                <p className="mb-0">{scanResult.expoInfo.time}</p>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )}

                        {/* Additional Info for Early/Future */}
                        {(scanResult.type === "early" || scanResult.type === "future") && (
                            <Col lg={12}>
                                <Alert variant="warning" className="d-flex align-items-center">
                                    <FaHourglassHalf className="me-3" size={24} />
                                    <div>
                                        {scanResult.type === "early" && (
                                            <p className="mb-0">
                                                Please wait <strong>{scanResult.minutesUntilStart} minutes</strong> for the expo to start.
                                                You can check in 30 minutes before the event begins.
                                            </p>
                                        )}
                                        {scanResult.type === "future" && (
                                            <p className="mb-0">
                                                This event is scheduled for <strong>{scanResult.expoInfo?.date}</strong>.
                                                Please come back on the event day.
                                            </p>
                                        )}
                                    </div>
                                </Alert>
                            </Col>
                        )}
                    </Row>
                )}
            </div>

            <style>{`
                .scanner-card {
                    border-radius: 16px;
                    overflow: hidden;
                }

                #qr-reader {
                    border: 3px dashed #1099a8;
                    border-radius: 16px;
                    overflow: hidden;
                }

                .status-card {
                    border-radius: 16px;
                    overflow: hidden;
                }

                .status-success {
                    background: linear-gradient(135deg, #d4edda 0%, #ffffff 100%);
                    border-left: 5px solid #28a745 !important;
                }

                .status-already_attended {
                    background: linear-gradient(135deg, #d1ecf1 0%, #ffffff 100%);
                    border-left: 5px solid #17a2b8 !important;
                }

                .status-early, .status-future {
                    background: linear-gradient(135deg, #fff3cd 0%, #ffffff 100%);
                    border-left: 5px solid #ffc107 !important;
                }

                .status-ended {
                    background: linear-gradient(135deg, #e2e3e5 0%, #ffffff 100%);
                    border-left: 5px solid #6c757d !important;
                }

                .status-invalid, .status-error {
                    background: linear-gradient(135deg, #f8d7da 0%, #ffffff 100%);
                    border-left: 5px solid #dc3545 !important;
                }

                .status-icon {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }

                .info-card {
                    border-radius: 16px;
                    overflow: hidden;
                }

                .info-card .card-header {
                    border: none;
                    padding: 15px 20px;
                }

                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 15px;
                }

                .info-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: rgba(16, 153, 168, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #1099a8;
                    flex-shrink: 0;
                }

                .info-content {
                    flex: 1;
                }

                .info-content small {
                    display: block;
                    margin-bottom: 2px;
                }

                .card {
                    border-radius: 16px;
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

                @media (max-width: 768px) {
                    .info-item {
                        gap: 10px;
                    }

                    .info-icon {
                        width: 35px;
                        height: 35px;
                    }

                    .status-card h4 {
                        font-size: 1.1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Attendance;