// src/components/layout/DashboardLayout.jsx
import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../Navbars/Sidebar/Sidebar"; // Admin sidebar
import ExhibitorSidebar from "../Navbars/Sidebar/ExhibitorSidebar"; // Exhibitor sidebar
import Topbar from "../Navbars/Topbar/Topbar";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // <-- import context

const DashboardLayout = () => {
  const { user } = useContext(AuthContext); // get user from context
  const [showMenu, setShowMenu] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1030);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1030);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    if (isMobile) setShowMenu(false);
    else setShowMenu(true);
  }, [isMobile]);

  const toggleMenu = () => setShowMenu(!showMenu);

  // Decide which sidebar to show based on role
  const SidebarComponent =
    user?.role === "exhibitor" ? ExhibitorSidebar : Sidebar;

  return (
    <div className="dashboard-layout d-flex position-relative">
      {/* Sidebar */}
      <div
        className={`sidebar-wrapper ${showMenu ? "sidebar-open" : ""
          } ${isMobile ? "sidebar-overlay" : "sidebar-desktop"}`}
      >
        <SidebarComponent showMenu={showMenu} toggleMenu={toggleMenu} />
      </div>

      {/* Backdrop for overlay mode */}
      {isMobile && showMenu && (
        <div
          className="sidebar-backdrop"
          onClick={toggleMenu}
          aria-label="Close sidebar"
        ></div>
      )}

      {/* Main Content */}
      <div
        className="main-content flex-grow-1 bg-light min-vh-100 d-flex flex-column"
        style={{
          transition: "margin-left 0.3s ease",
          marginLeft: !isMobile && showMenu ? "260px" : "0",
        }}
      >
        <Topbar toggleSidebar={toggleMenu} />

        <Container fluid className="p-4 flex-grow-1">
          <Outlet />
        </Container>
        {/* FOOTER */}
        <footer className="footer mt-5 mb-3 text-dark">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 text-center">
                {new Date().getFullYear()} © EventSphere - Made by <b>Umar</b>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Inline CSS */}
      <style>{`
        /* Sidebar base */
        .sidebar-wrapper {
          height: 100vh;
          transition: all 0.3s ease;
          z-index: 1040;
        }

        /* Desktop sidebar (pushes content) */
        .sidebar-desktop {
          position: fixed;
          left: 0;
          top: 0;
          width: 260px;
        }

        /* Overlay sidebar (mobile/tablet) */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: -260px;
          width: 260px;
          height: 100vh;
          z-index: 1050;
          transition: left 0.3s ease;
        }

        .sidebar-overlay.sidebar-open {
          left: 0;
        }

        /* Backdrop */
        .sidebar-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter:blur(3px);
          z-index: 1040;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Adjust content when sidebar visible */
        @media (min-width: 1030px) {
          .main-content {
            margin-left: 260px;
          }
          .sidebar-overlay {
            display: none !important;
          }
        }

        @media (max-width: 1029px) {
          .main-content {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
