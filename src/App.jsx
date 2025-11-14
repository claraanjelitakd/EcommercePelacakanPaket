import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./reusable/ProtectedRoute";

// Layouts
import DashboardLayout from "./layout/DashboardLayout";
import MappingUserLayout from "./layout/MappingUserLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import MappingUserRole from "./pages/MappingUserRole";

import ApplicationsPage from "./pages/Applications";
import BranchesPage from "./pages/Branches";
import RolesPage from "./pages/Roles";
import UsersPage from "./pages/Users";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mapping-user"
          element={
            <ProtectedRoute>
              <MappingUserLayout>
                <MappingUserRole />
              </MappingUserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <MappingUserLayout>
                <ApplicationsPage />
              </MappingUserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/branches"
          element={
            <ProtectedRoute>
              <MappingUserLayout>
                <BranchesPage />
              </MappingUserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/roles"
          element={
            <ProtectedRoute>
              <MappingUserLayout>
                <RolesPage />
              </MappingUserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <MappingUserLayout>
                <UsersPage />
              </MappingUserLayout>
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
