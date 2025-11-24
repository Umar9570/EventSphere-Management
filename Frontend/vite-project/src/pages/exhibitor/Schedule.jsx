// src/pages/exhibitor/Schedule.jsx
import React, { useEffect, useState, useContext } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const ExhibitorSchedule = () => {
    const { user } = useContext(AuthContext);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSchedule = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Get exhibitor profile
            const exRes = await api.get(`/exhibitors/user/${user.id}`);
            if (!exRes.data.status || !exRes.data.exhibitor) {
                setSchedule([]);
                return;
            }

            const exhibitor = exRes.data.exhibitor;

            if (exhibitor.status !== "approved") {
                setError("You are not approved for any expo yet.");
                setSchedule([]);
                return;
            }

            if (!exhibitor.expo) {
                setError("No expo assigned yet.");
                setSchedule([]);
                return;
            }

            const expoId = exhibitor.expo._id; // populated expo

            // Fetch all schedules
            const schRes = await api.get("/schedule");
            if (!schRes.data.status) {
                setError(schRes.data.message || "Failed to fetch schedule.");
                setSchedule([]);
                return;
            }

            // Filter schedules for this expo
            const expoSchedule = schRes.data.schedule.filter(
                (item) =>
                    item.expo && String(item.expo._id) === String(expoId)
            );

            setSchedule(expoSchedule);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch schedule.");
            setSchedule([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [user]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2">Loading schedule...</p>
            </div>
        );
    }

    return (
        <div className="exhibitor-schedule">
            <h4 className="fw-semibold text-secondary mb-4">Expo Schedule</h4>

            {error && (
                <Alert variant="danger" onClose={() => setError("")} dismissible>
                    {error}
                </Alert>
            )}

            {!schedule.length && !error && (
                <p className="text-center text-muted">No schedule available.</p>
            )}

            {schedule.length > 0 && (
                <div className="row g-4">
                    {schedule.map((item) => (
                        <div key={item._id} className="col-12 col-md-6 col-lg-4">
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body>
                                    <h6 className="fw-semibold mb-1">{item.title}</h6>
                                    {item.description && (
                                        <p className="text-secondary small mb-2">{item.description}</p>
                                    )}
                                    <p className="text-muted small mb-0">
                                        <strong>Date:</strong>{" "}
                                        {new Date(item.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-muted small mb-0">
                                        <strong>Time:</strong> {item.startTime} - {item.endTime}
                                    </p>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        .exhibitor-schedule h4 { color: #0f172a; }
        .card { border-radius: 14px; }
      `}</style>
        </div>
    );
};

export default ExhibitorSchedule;
