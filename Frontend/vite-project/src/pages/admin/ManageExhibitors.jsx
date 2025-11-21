import React, { useEffect, useState } from "react";
import { Card, Button, Badge, Spinner, Alert } from "react-bootstrap";
import api from "../../api/axios";

const ManageExhibitors = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // -------------------- FETCH EXHIBITOR APPLICATIONS --------------------
    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/exhibitors/applications");

            if (data.status) {
                // Format data
                const formatted = data.exhibitors.map((ex) => ({
                    _id: ex._id,
                    firstName: ex.user?.firstName || "N/A",
                    lastName: ex.user?.lastName || "",
                    email: ex.user?.email || "N/A",
                    phone: ex.user?.phone || "N/A",
                    organization: ex.organization || "N/A",
                    boothNumber: ex.boothNumber || "Not Assigned",
                    expoName: ex.expo?.name || "Unknown Expo",
                    status: ex.status || "pending",
                    createdAt: ex.createdAt,
                }));

                setApplications(formatted);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to load exhibitor applications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // -------------------- UPDATE STATUS (APPROVE / REJECT) --------------------
    const updateStatus = async (id, status) => {
        try {
            setUpdatingId(id);
            const { data } = await api.put(`/exhibitors/${id}/status`, { status });

            if (data.status) {
                setApplications((prev) =>
                    prev.map((ex) => (ex._id === id ? { ...ex, status } : ex))
                );
            } else {
                setErrorMessage("Failed to update status.");
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Server error while updating exhibitor status.");
        } finally {
            setUpdatingId(null);
        }
    };

    // -------------------- BADGE COLORS --------------------
    const statusBadgeColor = (status) => {
        switch (status) {
            case "pending":
                return "warning";
            case "approved":
                return "success";
            case "rejected":
                return "danger";
            default:
                return "secondary";
        }
    };

    return (
        <div className="p-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <h4 className="fw-semibold text-secondary mb-0">
                    Exhibitor Applications
                </h4>

                <Button
                    variant="primary"
                    className="d-flex align-items-center"
                    onClick={fetchApplications}
                >
                    <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                </Button>
            </div>

            {/* Error Alert */}
            {errorMessage && (
                <Alert variant="danger" dismissible onClose={() => setErrorMessage("")}>
                    {errorMessage}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="text-muted mt-2">Loading exhibitor applications...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && applications.length === 0 && (
                <p className="text-center text-muted">
                    No exhibitor applications found.
                </p>
            )}

            {/* Cards Grid */}
            <div className="row g-4">
                {applications.map((ex) => (
                    <div key={ex._id} className="col-12 col-md-6 col-lg-4">
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="d-flex flex-column">

                                {/* HEADER */}
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h6 className="fw-semibold mb-1 text-dark">
                                            {ex.firstName} {ex.lastName}
                                        </h6>
                                        <p className="text-muted small mb-0">{ex.email}</p>
                                    </div>

                                    <Badge
                                        bg={statusBadgeColor(ex.status)}
                                        className="text-capitalize px-2 py-1"
                                    >
                                        {ex.status}
                                    </Badge>
                                </div>

                                {/* Organization */}
                                <p className="text-dark small mb-1">
                                    <i className="bi bi-building me-2"></i>
                                    Organization: {ex.organization}
                                </p>

                                {/* Booth Number */}
                                <p className="text-muted small mb-1">
                                    <i className="bi bi-grid-1x2 me-2"></i>
                                    Booth: {ex.boothNumber}
                                </p>

                                {/* Expo */}
                                <p className="text-secondary small mb-2">
                                    <i className="bi bi-easel3 me-2"></i>
                                    Expo: {ex.expoName}
                                </p>

                                {/* Application Date */}
                                <p className="text-muted small mb-3">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    Applied on:{" "}
                                    {new Date(ex.createdAt).toLocaleDateString("en-GB")}
                                </p>

                                {/* ACTION BUTTONS */}
                                <div className="mt-auto d-flex gap-2">
                                    {ex.status === "pending" && (
                                        <>
                                            {/* APPROVE */}
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="w-100"
                                                disabled={updatingId === ex._id}
                                                onClick={() => updateStatus(ex._id, "approved")}
                                            >
                                                {updatingId === ex._id ? (
                                                    <Spinner size="sm" animation="border" className="me-1" />
                                                ) : (
                                                    <i className="bi bi-check-circle me-1"></i>
                                                )}
                                                Approve
                                            </Button>

                                            {/* REJECT */}
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="w-100"
                                                disabled={updatingId === ex._id}
                                                onClick={() => updateStatus(ex._id, "rejected")}
                                            >
                                                {updatingId === ex._id ? (
                                                    <Spinner size="sm" animation="border" className="me-1" />
                                                ) : (
                                                    <i className="bi bi-x-circle me-1"></i>
                                                )}
                                                Reject
                                            </Button>
                                        </>
                                    )}

                                    {ex.status !== "pending" && (
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            className="w-100"
                                            disabled
                                        >
                                            <i className="bi bi-check2-all me-1"></i>
                                            {ex.status === "approved" ? "Approved" : "Rejected"}
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Styles */}
            <style>{`
        .card {
          border-radius: 14px;
          transition: all 0.25s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }
        .badge {
          font-size: 12px;
        }
        .btn {
          border-radius: 8px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
      `}</style>
        </div>
    );
};

export default ManageExhibitors;
