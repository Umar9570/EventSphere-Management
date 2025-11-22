import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import "bootstrap/dist/css/bootstrap.min.css";
import "simplebar-react/dist/simplebar.min.css";

const ExhibitorSidebar = ({ showMenu, toggleMenu }) => {
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const [localShow, setLocalShow] = useState(true);
    const isVisible = showMenu !== undefined ? showMenu : localShow;
    const handleToggle = () => {
        if (toggleMenu) toggleMenu();
        else setLocalShow(!localShow);
    };

    const [openDropdown, setOpenDropdown] = useState("");
    const toggleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? "" : menu);
    };

    return (
        <>
            <div
                className={`sidebar border-end d-flex flex-column bg-white shadow-sm ${isVisible ? "show" : "hide"
                    }`}
                style={{
                    width: isVisible ? "260px" : "0",
                    minHeight: "100vh",
                    position: isMobile ? "fixed" : "sticky",
                    top: 0,
                    left: 0,
                    zIndex: 1040,
                    overflowX: "hidden",
                    transition: "all 0.3s ease",
                }}
            >
                {/* Sidebar Header */}
                <div className="sidebar-header border-bottom p-3">
                    <div className="sidebar-brand fw-semibold text-secondary fs-5 d-flex align-items-center justify-content-between">
                        <span>EventSphere</span>
                        {isMobile && (
                            <button
                                className="btn btn-sm btn-light ms-2 border-0"
                                onClick={handleToggle}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar Nav */}
                <ul className="sidebar-nav list-unstyled flex-grow-1 px-2 mt-3">
                    <li className="nav-title text-muted text-uppercase small fw-semibold px-3 mb-2">
                        Main Navigation
                    </li>


                    {/* Booth Management */}
                    <li className="nav-item mb-1">
                        <Link
                            to="/mybooth"
                            className={`nav-link d-flex align-items-center px-3 py-2 rounded ${location.pathname === "/mybooth"
                                ? "active-link bg-light fw-semibold"
                                : "text-secondary"
                                }`}
                            onClick={() => isMobile && handleToggle()}
                        >
                            <i className="bi bi-buildings me-2 nav-icon"></i>
                            My Booth
                        </Link>
                    </li>

                    {/* Schedule / Meetings */}
                    <li className="nav-item mb-1">
                        <Link
                            to="/exhibitor-schedule"
                            className={`nav-link d-flex align-items-center px-3 py-2 rounded ${location.pathname === "/exhibitor-schedule"
                                ? "active-link bg-light fw-semibold"
                                : "text-secondary"
                                }`}
                            onClick={() => isMobile && handleToggle()}
                        >
                            <i className="bi bi-calendar-week me-2 nav-icon"></i>
                            Schedule
                        </Link>
                    </li>
                </ul>

                {/* Sidebar Footer */}
                <div className="sidebar-footer border-top p-3 d-flex justify-content-center">
                    <button
                        className="sidebar-toggler btn btn-outline-light border-0"
                        onClick={handleToggle}
                    >
                        <i
                            className={`bi ${isVisible ? "bi-chevron-left" : "bi-chevron-right"
                                } text-secondary`}
                        ></i>
                    </button>
                </div>
            </div>

            {/* Overlay for Mobile */}
            {isMobile && isVisible && (
                <div
                    className="sidebar-overlay"
                    onClick={handleToggle}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.3)",
                        zIndex: 1030,
                    }}
                />
            )}

            {/* Inline Styles */}
            <style>{`
        .nav-link {
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 15px;
          font-weight: 500;
          background-color: #dfdfdf36 !important;
          border-radius: 7px !important;
        }
        .nav-link i{
          color: #1099a8ff;
          font-size: 17px;
        }
        .nav-link:hover {
          background-color: #dde7f198 !important;
          text-decoration: none;
        }
        .active-link {
          color: #0f172a !important;
          font-weight: 600 !important;
          background-color: #f1f5f9 !important;
        }
        .nav-title {
          color: #94a3b8;
          letter-spacing: 0.5px;
        }
        .sidebar-toggler {
          border-radius: 50%;
          width: 36px;
          height: 36px;
          background-color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sidebar-toggler:hover {
          background-color: #d1d4d8ff;
        }
      `}</style>
        </>
    );
};

export default ExhibitorSidebar;
