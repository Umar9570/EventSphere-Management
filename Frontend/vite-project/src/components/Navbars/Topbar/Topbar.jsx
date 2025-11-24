// src/components/navbars/topbar/Topbar.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

const Topbar = ({ toggleSidebar, user }) => {
  const { logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);


  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        showNotifications
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        showProfileMenu
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showProfileMenu]);
  return (
    <nav
      className="navbar navbar-expand bg-white border-bottom shadow-sm px-3 py-2 sticky-top"
      style={{ zIndex: 1050, height: "64px" }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between flex-nowrap">
        {/* LEFT SIDE: Sidebar Toggle + Brand */}
        <div className="d-flex align-items-center flex-nowrap">
          <button
            className="btn btn-light border-0 shadow-sm rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{
              width: "38px",
              height: "38px",
              backgroundColor: "#f1f5f9",
            }}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FaBars className="text-secondary" size={18} />
          </button>

          <a
            href="#"
            className="navbar-brand fw-semibold text-dark mb-0"
            style={{ fontSize: "18px", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}
          >
            EventSphere
          </a>
        </div>

        {/* RIGHT SIDE: Notifications + Profile */}
        <ul
          className="navbar-nav ms-auto align-items-center flex-row flex-nowrap gap-3"
          style={{ whiteSpace: "nowrap" }}
        >
          {/* Notifications */}
          <li className="nav-item dropdown position-relative" ref={notifRef}>
            <button
              className="btn btn-link nav-link text-dark position-relative p-1"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              aria-expanded={showNotifications}
              style={{ lineHeight: 1 }}
            >
              <FaBell size={20} />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{
                  fontSize: "10px",
                  transform: "translate(-40%, -40%)",
                }}
              >
                3
              </span>
            </button>

            {/* Animated dropdown — always rendered, CSS controls visibility */}
            <div
              className={`dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 p-0 dropdown-animated ${
                showNotifications ? "show-dropdown" : "hide-dropdown"
              }`}
              style={{
                width: "280px",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#ffffff",
                right: "0",
                left: "auto",
                position: "absolute",
              }}
            >
              <div className="p-3 border-bottom fw-semibold text-secondary small">
                Notifications
              </div>
              <div
                className="list-group list-group-flush"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                <button className="list-group-item list-group-item-action py-2 small">
                  New booking received
                </button>
                <button className="list-group-item list-group-item-action py-2 small">
                  Room 301 maintenance update
                </button>
                <button className="list-group-item list-group-item-action py-2 small">
                  Guest feedback received
                </button>
              </div>
              <div className="p-2 text-center border-top small">
                <a href="#" className="text-decoration-none text-primary">
                  View all
                </a>
              </div>
            </div>
          </li>

          {/* Profile Dropdown */}
          <li className="nav-item dropdown position-relative" ref={profileRef}>
            <button
              className="btn btn-link nav-link d-flex align-items-center text-dark p-1"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              aria-expanded={showProfileMenu}
              style={{ lineHeight: 1 }}
            >
              <FaUserCircle size={28} className="me-2 text-secondary" />
              <span className="d-none d-md-inline fw-medium text-secondary">
                {user?.name || "User"}
              </span>
            </button>

            {/* Animated dropdown — always rendered, CSS controls visibility */}
            <ul
              className={`dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 dropdown-animated ${
                showProfileMenu ? "show-dropdown" : "hide-dropdown"
              }`}
              style={{
                borderRadius: "10px",
                minWidth: "180px",
                fontSize: "14px",
                overflow: "hidden",
                right: 0,
                left: "auto",
                position: "absolute",
              }}
            >
              <li>
                <button className="dropdown-item py-2">Profile</button>
              </li>
              <li>
                <button className="dropdown-item py-2">Settings</button>
              </li>
              <li>
                <hr className="dropdown-divider my-1" />
              </li>
              <li>
                <button className="dropdown-item text-danger py-2 hover-danger" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* Inline styles — animation uses opacity + transform (no display toggling) */}
      <style>{`
        .dropdown-item:hover {
          background-color: #f8fafc !important;
        }
        .navbar-brand:hover {
          color: #0f172a !important;
        }
        .list-group-item:hover {
          background-color: #f1f5f9 !important;
        }

        /* Prevent wrapping on small screens */
        .navbar-nav {
          flex-wrap: nowrap !important;
        }

        /* Dropdown animation (fade + slide) */
        .dropdown-animated {
          box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px !important;
          display: block; /* keep in DOM so we can animate */
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition: opacity 200ms cubic-bezier(0.4,0,0.2,1), transform 200ms cubic-bezier(0.4,0,0.2,1);
          will-change: opacity, transform;
        }
        .dropdown-animated.show-dropdown {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .dropdown-animated.hide-dropdown {
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
        }
        .hover-danger:hover{
          background-color: #b600001c !important;
          border-radius: 5px;
        }
      `}</style>
    </nav>
  );
};

export default Topbar;
