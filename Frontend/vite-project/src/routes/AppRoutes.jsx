// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import Index from "../pages/ClientSide/Index";
import Register from "../pages/Auth/Register";

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
