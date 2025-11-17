import React from "react";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./reusable/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import MappingUserRole from "./pages/MappingUserRole";
import ApplicationsPage from "./pages/Applications";
import BranchesPage from "./pages/Branches";
import RolesPage from "./pages/Roles";
import UsersPage from "./pages/Users";

const App = () => {
  // === AUTO LOGOUT KETIKA TEKAN TOMBOL BACK ===
  useEffect(() => {
    const handleBack = () => {
      // hapus token supaya ProtectedRoute menganggap not-login
      localStorage.removeItem("token");
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);
  // === END AUTO LOGOUT ===
  return (
    <BrowserRouter>
      <Routes>
        {/* === RUTE PUBLIK === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* === RUTE TERLINDUNGI === */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {" "}
              <Dashboard />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/mapping-user"
          element={
            <ProtectedRoute>
              {" "}
              <MappingUserRole />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              {" "}
              <ApplicationsPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/branches"
          element={
            <ProtectedRoute>
              {" "}
              <BranchesPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              {" "}
              <RolesPage />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              {" "}
              <UsersPage />{" "}
            </ProtectedRoute>
          }
        />

        {/* Rute Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
