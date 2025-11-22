// src/pages/exhibitor/Schedule.jsx
import React, { useEffect, useState } from "react";
import { Card, Spinner, Table, Alert } from "react-bootstrap";
import api from "../../api/axios";

const ExhibitorSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/schedule"); // Admin schedule API
            if (data.status) {
                setSchedule(data.schedule);
            } else {
                setFetchError(data.message || "Failed to fetch schedule.");
            }
        } catch (err) {
            console.error(err);
            setFetchError("Failed to fetch schedule.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

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
            <h4 className="fw-semibold text-secondary mb-4">Event Schedule</h4>

            {fetchError && (
                <Alert variant="danger" onClose={() => setFetchError("")} dismissible>
                    {fetchError}
                </Alert>
            )}

            {!schedule.length && !fetchError && (
                <p className="text-center text-muted">No schedule available.</p>
            )}

            {schedule.length > 0 && (
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <Table striped bordered hover responsive className="mb-0">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Event</th>
                                    <th>Location</th>
                                    <th>Expo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            {new Date(item.startTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}{" "}
                                            -{" "}
                                            {new Date(item.endTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>{item.title}</td>
                                        <td>{item.location}</td>
                                        <td>{item.expo?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {/* Inline styles */}
            <style>{`
        .exhibitor-schedule h4 {
          color: #0f172a;
        }
        .card {
          border-radius: 14px;
        }
        table th, table td {
          vertical-align: middle;
        }
      `}</style>
        </div>
    );
};

export default ExhibitorSchedule;
