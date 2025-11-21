// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import Index from "../pages/ClientSide/Index";
import Register from "../pages/Auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageAttendees from "../pages/admin/ManageAttendees";
import ManageExhibitors from "../pages/admin/ManageExhibitors";
import ManageExpos from "../pages/admin/ManageExpos";
import ManageBooths from "../pages/admin/ManageBooths";
import ManageSchedule from "../pages/admin/ManageSchedule";
import Attendance from "../pages/admin/Attendance";

const AppRoutes = () => (
  <Routes>
    {/* ---------------- Public Routes ---------------- */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    {/* <Route path="/" element={<Index />} /> */}
    {/* <Route path="/home" element={<Index />} /> */}

    {/* ---------------- Protected Dashboard Routes ---------------- */}
    <Route
      path="/"
      element={
        <ProtectedRoute roles={["organizer", "exhibitor"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >


      {/* Protected Routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="attendees"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <ManageAttendees />
          </ProtectedRoute>
        }
      />
      <Route
        path="exhibitors"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <ManageExhibitors />
          </ProtectedRoute>
        }
      />
      <Route
        path="expos"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <ManageExpos />
          </ProtectedRoute>
        }
      />
      <Route
        path="booths"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <ManageBooths />
          </ProtectedRoute>
        }
      />
      <Route
        path="schedule"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <ManageSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="attendance"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="apply"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <Index />
          </ProtectedRoute>
        }
      />
      
    </Route>

  </Routes>
);

export default AppRoutes;
