import React, { useState, useEffect } from "react";
import {
    Badge,
    Card,
    Row,
    Col,
    Button,
    Modal,
    Form,
    Spinner,
    Alert,
} from "react-bootstrap";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ManageAttendees = () => {
    const [registrations, setRegistrations] = useState([]);
    const [expos, setExpos] = useState([]);
    const [selectedExpo, setSelectedExpo] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ------------------ FETCH REGISTRATIONS ------------------
    const fetchRegistrations = async (expoFilter = 'all') => {
        try {
            setLoading(true);
            const { data } = await api.get(`/event-registration/all?expoId=${expoFilter}`);

            if (data.status) {
                setRegistrations(data.registrations);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load attendees");
            toast.error("Failed to load attendees");
        } finally {
            setLoading(false);
        }
    };

    // ------------------ FETCH EXPOS ------------------
    const fetchExpos = async () => {
        try {
            const { data } = await api.get('/expos');
            if (data.status) {
                setExpos(data.expos);
            }
        } catch (err) {
            console.error('Failed to fetch expos:', err);
        }
    };

    useEffect(() => {
        fetchExpos();
        fetchRegistrations();
    }, []);

    // Handle expo filter change
    const handleExpoFilterChange = (e) => {
        const expoId = e.target.value;
        setSelectedExpo(expoId);
        fetchRegistrations(expoId);
    };

    // Format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Group registrations by user
    const groupedByUser = registrations.reduce((acc, reg) => {
        const userId = reg.user._id;
        if (!acc[userId]) {
            acc[userId] = {
                user: reg.user,
                registrations: []
            };
        }
        acc[userId].registrations.push(reg);
        return acc;
    }, {});

    const attendeesData = Object.values(groupedByUser);

    if (loading)
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading attendees...</p>
            </div>
        );

    return (
        <div className="manage-attendee-page">
            <div className="grid-wrapper">
                <div className="grid-background"></div>
            </div>
            <div className="p-4" style={{ position: "relative", zIndex: 10 }}>
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <h4 className="fw-semibold mb-0 text-muted">All Attendees</h4>
                    
                    {/* Expo Filter */}
                    <div style={{ minWidth: '250px' }}>
                        <Form.Select 
                            value={selectedExpo} 
                            onChange={handleExpoFilterChange}
                            className="shadow-sm"
                        >
                            <option value="all">All Expos</option>
                            {expos.map((expo) => (
                                <option key={expo._id} value={expo._id}>
                                    {expo.name}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-4">
                    <p className="text-muted mb-0">
                        Showing <strong>{attendeesData.length}</strong> attendees 
                        {selectedExpo !== 'all' && ` for ${expos.find(e => e._id === selectedExpo)?.name}`}
                        <span className="ms-3">
                            Total Registrations: <strong>{registrations.length}</strong>
                        </span>
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <Alert variant="danger" onClose={() => setError('')} dismissible>
                        {error}
                    </Alert>
                )}

                {/* Attendees Grid */}
                {attendeesData.length > 0 ? (
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {attendeesData.map((attendeeGroup) => {
                            const { user, registrations: userRegs } = attendeeGroup;
                            const totalAttended = userRegs.filter(r => r.attended).length;
                            const totalRegistrations = userRegs.length;

                            return (
                                <Col key={user._id}>
                                    <Card className="shadow-sm border-0 h-100 attendee-card">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h6 className="fw-bold mb-0">
                                                    {user.firstName} {user.lastName}
                                                </h6>

                                                <Badge bg={totalAttended > 0 ? "success" : "secondary"}>
                                                    {totalAttended > 0 ? "Attended" : "Not Attended"}
                                                </Badge>
                                            </div>

                                            <p className="text-muted small mb-1">
                                                <i className="bi bi-envelope me-1"></i>
                                                {user.email}
                                            </p>

                                            <p className="text-muted small mb-2">
                                                <i className="bi bi-telephone me-1"></i>
                                                {user.phone || 'N/A'}
                                            </p>

                                            <hr className="my-2" />

                                            {/* Event Registrations */}
                                            <div className="mb-2">
                                                <small className="text-muted fw-bold">
                                                    <i className="bi bi-ticket-detailed me-1"></i>
                                                    Registered Events ({totalRegistrations})
                                                </small>
                                                <div className="mt-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                                    {userRegs.map((reg) => (
                                                        <div 
                                                            key={reg._id} 
                                                            className="d-flex justify-content-between align-items-center mb-1 p-1 rounded"
                                                            style={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                                                        >
                                                            <small className="text-truncate" style={{ maxWidth: '60%' }}>
                                                                {reg.expo.name}
                                                            </small>
                                                            <Badge 
                                                                bg={reg.attended ? "success" : "warning"} 
                                                                className="ms-1"
                                                                style={{ fontSize: '9px' }}
                                                            >
                                                                {reg.attended ? '✓ Attended' : 'Pending'}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <hr className="my-2" />

                                            {/* Stats */}
                                            <div className="d-flex justify-content-between">
                                                <small className="text-muted">
                                                    <i className="bi bi-calendar-check me-1"></i>
                                                    Attended: {totalAttended}/{totalRegistrations}
                                                </small>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-people" style={{ fontSize: '48px', color: '#ccc' }}></i>
                        <p className="text-muted mt-3">
                            {selectedExpo === 'all' 
                                ? 'No attendees found' 
                                : 'No attendees for this expo'}
                        </p>
                        {selectedExpo !== 'all' && (
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => {
                                    setSelectedExpo('all');
                                    fetchRegistrations('all');
                                }}
                            >
                                Show All Attendees
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .attendee-card {
                    border-radius: 14px;
                    transition: all 0.25s ease;
                }
                .attendee-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 14px rgba(0,0,0,0.08);
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

                /* Custom scrollbar for events list */
                .attendee-card div[style*="overflowY"] {
                    scrollbar-width: thin;
                    scrollbar-color: #ccc transparent;
                }

                .attendee-card div[style*="overflowY"]::-webkit-scrollbar {
                    width: 4px;
                }

                .attendee-card div[style*="overflowY"]::-webkit-scrollbar-track {
                    background: transparent;
                }

                .attendee-card div[style*="overflowY"]::-webkit-scrollbar-thumb {
                    background-color: #ccc;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default ManageAttendees;