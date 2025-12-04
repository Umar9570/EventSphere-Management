import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../api/axios";

const Attendance = () => {
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success"); // success / danger / info
    const [scanning, setScanning] = useState(false);
    const [loading, setLoading] = useState(false);
    const qrCodeRegionId = "qr-reader";
    const html5QrCodeRef = useRef(null);

    // Start scanning
    const startScanner = async () => {
        setMessage("");
        setMessageType("success");
        setScanning(true);

        const config = { fps: 10, qrbox: 250 };
        html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

        try {
            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                config,
                async (decodedText, decodedResult) => {
                    // decodedText is the attendee ID
                    handleScan(decodedText);
                },
                (errorMessage) => {
                    // ignore scanning errors
                }
            );
        } catch (err) {
            console.error("QR scanner error:", err);
            setMessage("Unable to start camera. Please check permissions.");
            setMessageType("danger");
            setScanning(false);
        }
    };

    const stopScanner = async () => {
        if (html5QrCodeRef.current) {
            await html5QrCodeRef.current.stop();
            html5QrCodeRef.current.clear();
            setScanning(false);
        }
    };

    const handleScan = async (attendeeId) => {
        setLoading(true);
        try {
            const { data } = await api.put(`/attendance/mark/${attendeeId}`);
            if (data.status) {
                setMessage(`✅ ${data.message}`);
                setMessageType("success");
            } else {
                setMessage(`⚠️ ${data.message}`);
                setMessageType("info");
            }
        } catch (err) {
            console.error(err);
            setMessage("❌ Error marking attendance. Try again.");
            setMessageType("danger");
        } finally {
            setLoading(false);
        }
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
            <div className="p-4" style={{ position: "relative", zIndex: 10 }}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h4 className="fw-semibold text-secondary mb-0">Attendance Scanner</h4>
                    {scanning ? (
                        <Button variant="danger" onClick={stopScanner}>
                            Stop Scanner
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={startScanner}>
                            Start Scanner
                        </Button>
                    )}
                </div>

                {message && (
                    <Alert variant={messageType} onClose={() => setMessage("")} dismissible>
                        {message}
                    </Alert>
                )}

                <Card className="shadow-sm border-0">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                        {loading && (
                            <Spinner animation="border" className="mb-3" />
                        )}
                        <div id={qrCodeRegionId} style={{ width: "100%", maxWidth: "400px" }}></div>
                        {!scanning && !loading && (
                            <p className="text-muted mt-3">
                                Click "Start Scanner" to scan attendee QR codes
                            </p>
                        )}
                    </Card.Body>
                </Card>
            </div>

            <style>{`
        #qr-reader {
          border: 2px dashed #1099a8;
          border-radius: 12px;
          overflow: hidden;
        }
        .card {
          border-radius: 12px;
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

export default Attendance;
