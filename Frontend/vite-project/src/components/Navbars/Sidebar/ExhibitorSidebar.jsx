import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import "bootstrap/dist/css/bootstrap.min.css";
import "simplebar-react/dist/simplebar.min.css";
import { AuthContext } from "../../../context/AuthContext";
import api from '../../../api/axios';


const EXHIBITOR_ROUTE = 'exhibitor-chat';

const ExhibitorSidebar = ({ showMenu, toggleMenu }) => {
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const { user } = useContext(AuthContext);

    // Initialize with null to signify loading state
    const [currentExpoId, setCurrentExpoId] = useState(null);

    // Get the user's ID from context
    const userId = user?.id;

    // --- Fetch Expo ID on load ---
    useEffect(() => {
        if (userId && user?.role === 'exhibitor') {
            const fetchApprovedExpo = async () => {
                try {
                    // Use the new API endpoint
                    const response = await api.get(`/expos/approved-expo/${userId}`);

                    if (response.data.status && response.data.expo) {
                        // Set the ID from the fetched expo object
                        setCurrentExpoId(response.data.expo._id);
                    } else {
                        // Handle case where no approved expo is found
                        setCurrentExpoId('no-expo-selected');
                    }
                } catch (error) {
                    console.error("Error fetching approved expo ID:", error);
                    setCurrentExpoId('no-expo-selected');
                }
            };
            fetchApprovedExpo();
        } else {
            // Default if user/role is missing or not an exhibitor
            setCurrentExpoId('no-expo-selected');
        }
    }, [userId, user?.role]); // Re-run when userId or role changes

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

    // --- Derived State for Chat Link ---
    // isChatEnabled is true only if a valid ID (not null, not the placeholder) is found
    const isChatEnabled = currentExpoId !== null && currentExpoId !== 'no-expo-selected';
    // The path is the real path or '#' (a safe no-op)
    const chatPath = isChatEnabled ? `/${EXHIBITOR_ROUTE}/${currentExpoId}` : '#';
    // Loading state is true only when currentExpoId is still null
    const isLoading = currentExpoId === null;
    // Check if the current location is any chat path
    const isChatActive = location.pathname.includes(`/${EXHIBITOR_ROUTE}`);

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


                    {/* All Expos */}
                    <li className="nav-item mb-1">
                        <Link
                            to="/all-expos"
                            className={`nav-link d-flex align-items-center px-3 py-2 rounded ${location.pathname === "/all-expos"
                                ? "active-link bg-light fw-semibold"
                                : "text-secondary"
                                }`}
                            onClick={() => isMobile && handleToggle()}
                        >
                            <i className="bi bi-building me-2 nav-icon"></i>
                            All Expos
                        </Link>
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
                            <i className="bi bi-shop-window me-2 nav-icon"></i>
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

                    {/* Chat (Updated Logic) */}
                    <li className="nav-item mb-1">
                        <Link
                            // Use the conditional chatPath: either the real URL or '#'
                            to={chatPath}
                            onClick={(e) => {
                                // Prevent default navigation if chat is not enabled
                                if (!isChatEnabled) {
                                    e.preventDefault();
                                    if (!isLoading) {
                                        console.log("Chat is disabled: Exhibitor is not approved for an expo.");
                                    }
                                }
                                if (isMobile) handleToggle();
                            }}
                            className={`nav-link d-flex align-items-center px-3 py-2 rounded ${isChatActive
                                    ? "active-link bg-light fw-semibold"
                                    : "text-secondary"
                                } ${!isChatEnabled ? 'disabled-link' : ''}`} // Apply disabled class if not enabled
                        >
                            <i className="bi bi-chat me-2 nav-icon"></i>
                            {/* Dynamic Text to show status */}
                            Chat {isLoading ? "(Loading...)" : isChatEnabled ? "" : "(Not Approved)"}
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
        /* New styles for disabled link */
        .disabled-link {
            opacity: 0.6; 
            pointer-events: none; /* Prevents clicks on the link entirely */
            cursor: not-allowed !important;
        }
        .disabled-link:hover {
             background-color: #dfdfdf36 !important; /* Retain default background when disabled */
        }
      `}</style>
        </>
    );
};

export default ExhibitorSidebar;