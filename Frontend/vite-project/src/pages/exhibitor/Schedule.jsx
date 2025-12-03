// src/pages/exhibitor/Schedule.jsx
import React, { useEffect, useState, useContext } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
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
            <div className="col-sm-12 mb-5">
                <div
                    className="profile-bg-picture"
                    style={{
                        backgroundImage: "url('https://media.istockphoto.com/id/1353476783/vector/abstract-teal-circles-background.jpg?s=612x612&w=0&k=20&c=twp8lq5iWEUJ3Wzkp4HGnF89WxDKG--ZKTofQtFop7M=')",
                    }}
                >
                    <span className="picture-bg-overlay"></span>

                    <div className="centered-title fs-1">
                        Stay Updated
                    </div>
                </div>
            </div>
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
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedule.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.title}</td>
                                    <td>{item.description || "-"}</td>
                                    <td>{new Date(item.date).toLocaleDateString()}</td>
                                    <td>{item.startTime} - {item.endTime}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            <style>{`
        .exhibitor-schedule h4 { color: #0f172a; }
        .table-responsive { margin-bottom: 1rem; }
        table { border-radius: 14px; overflow: hidden; }
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
      `}</style>
        </div>
    );
};

export default ExhibitorSchedule;
