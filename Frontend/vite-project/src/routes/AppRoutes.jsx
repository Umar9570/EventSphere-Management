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
import MyBooth from "../pages/exhibitor/MyBooth";
import ExhibitorSchedule from "../pages/exhibitor/Schedule";
import AllExpos from "../pages/exhibitor/AllExpos";
import ExhibitorChat from "../pages/exhibitor/ExhibitorChat";
import { AuthContext } from "../context/AuthContext"; // <-- import context
import OrganizerChat from "../pages/admin/OrganizerChat";
import Profile from "../pages/admin/Profile";
import About from "../pages/ClientSide/About";
import Contact from "../pages/ClientSide/Contact";
import Booknow from "../pages/ClientSide/BookNow";
import Rooms from "../pages/ClientSide/Rooms";


const AppRoutes = () => (
  <Routes>
    {/* ---------------- Public Routes ---------------- */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<Index />} />
    <Route path="/home" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/booknow" element={<Booknow />} />
    <Route path="/rooms" element={<Rooms />} />


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
          <ProtectedRoute roles={["organizer"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="attendees"
        element={
          <ProtectedRoute roles={["organizer"]}>
            <ManageAttendees />
          </ProtectedRoute>
        }
      />
      <Route
        path="exhibitors"
        element={
          <ProtectedRoute roles={["organizer"]}>
            <ManageExhibitors />
          </ProtectedRoute>
        }
      />
      <Route
        path="expos"
        element={
          <ProtectedRoute roles={["organizer"]}>
            <ManageExpos />
          </ProtectedRoute>
        }
      />
      <Route
        path="booths"
        element={
          <ProtectedRoute roles={["organizer"]}>
            <ManageBooths />
          </ProtectedRoute>
        }
      />
      <Route
        path="schedule"
        element={
          <ProtectedRoute roles={["organizer"]}>
            <ManageSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="chat"
        element={
          <ProtectedRoute roles={["organizer"]}>
            <OrganizerChat/> 
          </ProtectedRoute>
        }
      />
      <Route
        path="attendance"
        element={
          <ProtectedRoute roles={["organizer"]}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute roles={["organizer", "exhibitor"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Exhibitors */}

      <Route
        path="mybooth"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <MyBooth />
          </ProtectedRoute>
        }
      />
      <Route
        path="exhibitor-schedule"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <ExhibitorSchedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="all-expos"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <AllExpos />
          </ProtectedRoute>
        }
      />
      <Route
        path="exhibitor-chat/:expoId"
        element={
          <ProtectedRoute roles={["exhibitor"]}>
            <ExhibitorChat/> 
          </ProtectedRoute>
        }
      />
    </Route>

  </Routes>
);

export default AppRoutes;
