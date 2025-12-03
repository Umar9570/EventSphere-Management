import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import api from "../../api/axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalExpos: 0,
        totalExhibitors: 0,
        totalAttendees: 0,
        attendeesThisMonth: 0,
    });

    const [attendeeChartData, setAttendeeChartData] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1️⃣ Fetch expos
                const { data: exposData } = await api.get("/expos");
                const expos = exposData.expos || [];

                // 2️⃣ Fetch exhibitors
                const { data: exhibitorsData } = await api.get("/exhibitors");
                const exhibitors = exhibitorsData.exhibitors || [];

                // 3️⃣ Fetch attendees
                const { data: attendeesData } = await api.get("/attendees");
                const attendees = attendeesData.attendees || [];

                // 4️⃣ Compute attendees per month
                const attendeesByMonth = {};
                attendees.forEach((a) => {
                    const month = new Date(a.createdAt).toLocaleString("default", {
                        month: "short",
                    });
                    attendeesByMonth[month] = (attendeesByMonth[month] || 0) + 1;
                });

                const chartDataFormatted = Object.entries(attendeesByMonth).map(
                    ([month, count]) => ({ month, count })
                );

                // 5️⃣ Recent activity
                const recent = [
                    ...expos.slice(-2).map((e) => `📢 New Expo created: ${e.name}`),
                    ...exhibitors.slice(-2).map(
                        (ex) => `🏢 Exhibitor registered: ${ex.companyName}`
                    ),
                    ...attendees.slice(-2).map(
                        (a) =>
                            `🧍 New Attendee registered: ${a.user?.firstName} ${a.user?.lastName}`
                    ),
                ];

                // 6️⃣ Stats
                setStats({
                    totalExpos: expos.length,
                    totalExhibitors: exhibitors.length,
                    totalAttendees: attendees.length,
                    attendeesThisMonth:
                        attendeesByMonth[
                        new Date().toLocaleString("default", { month: "short" })
                        ] || 0,
                });

                setAttendeeChartData(chartDataFormatted);
                setRecentActivity(recent);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p className="mt-2">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="col-sm-12 mb-5">
                <div
                    className="profile-bg-picture"
                    style={{
                        backgroundImage: "url('https://media.istockphoto.com/id/1353476783/vector/abstract-teal-circles-background.jpg?s=612x612&w=0&k=20&c=twp8lq5iWEUJ3Wzkp4HGnF89WxDKG--ZKTofQtFop7M=')",
                    }}
                >
                    <span className="picture-bg-overlay"></span>

                    <div className="centered-title fs-1">
                        Welcome to Dashboard!
                    </div>
                </div>
            </div>
            {/* === TOP STATS === */}
            <Row className="g-3 mb-4">
                {[
                    {
                        title: "Total Expos",
                        value: stats.totalExpos,
                        icon: "bi-calendar-event",
                    },
                    {
                        title: "Total Exhibitors",
                        value: stats.totalExhibitors,
                        icon: "bi-shop-window",
                    },
                    {
                        title: "Total Attendees",
                        value: stats.totalAttendees,
                        icon: "bi-people-fill",
                    },
                    {
                        title: "Attendees This Month",
                        value: stats.attendeesThisMonth,
                        icon: "bi-bar-chart-line",
                    },
                ].map((item, index) => (
                    <Col key={index} xs={12} sm={6} lg={3}>
                        <Card className="stat-card shadow-sm border-0 h-100">
                            <Card.Body className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h6 className="text-muted small mb-1">{item.title}</h6>
                                    <h4 className="fw-bold mb-0">{item.value}</h4>
                                </div>
                                <i
                                    className={`bi ${item.icon} text-primary opacity-75`}
                                    style={{ fontSize: "28px" }}
                                ></i>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* === CHART + RECENT ACTIVITY === */}
            <Row className="g-3">
                <Col xs={12} lg={8}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-white border-bottom fw-semibold">
                            Monthly Attendee Growth
                        </Card.Header>
                        <Card.Body style={{ height: "300px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={attendeeChartData}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        bottom: 0,
                                        left: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar
                                        dataKey="count"
                                        fill="#1099a8"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={4}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-white border-bottom fw-semibold">
                            Recent Activity
                        </Card.Header>
                        <Card.Body className="p-0">
                            <ul className="list-group list-group-flush">
                                {recentActivity.length ? (
                                    recentActivity.map((item, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item small"
                                        >
                                            {item}
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item small text-muted">
                                        No recent activity
                                    </li>
                                )}
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Inline styles */}
            <style>{`
        .stat-card {
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }
        .stat-card i{
          color: #1099a8ff !important;
        }
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

export default AdminDashboard;
