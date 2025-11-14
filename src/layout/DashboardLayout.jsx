import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../reusable/Button";  // FIXED
import api from "../api/api";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-blue-600";

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow p-4 border-b">
        <div className="container mx-auto flex items-center justify-between">

          <h1 className="text-2xl font-bold text-purple-700">
            📦 Sistem Pelacakan Barang
          </h1>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/mapping-user" className={linkClass}>
              Mapping User
            </NavLink>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded text-gray-700 hover:bg-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              {open ? (
                <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex">
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-white border-t p-4 flex flex-col gap-3">
            <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>

            <NavLink to="/mapping-user" className={linkClass} onClick={() => setOpen(false)}>
              Mapping User
            </NavLink>

            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </header>

      <main className="container mx-auto p-6 flex-grow max-w-6xl">
        {children}
      </main>

      <footer className="text-center text-gray-500 text-sm py-4 border-t">
        © {new Date().getFullYear()} Sistem Pelacakan Paket
      </footer>
    </div>
  );
};

export default DashboardLayout;
