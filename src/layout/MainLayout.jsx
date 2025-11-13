import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-medium"
      : "text-gray-600 hover:text-blue-500";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-700">
          📦 Sistem Pelacakan Barang
        </h1>

          {/* Desktop nav
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/scan-masuk" className={linkClass}>
              Scan Masuk
            </NavLink>
            <NavLink to="/scan-keluar" className={linkClass}>
              Scan Keluar
            </NavLink>
          </nav> */}

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((s) => !s)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden border-t bg-white">
            <div className="flex flex-col container mx-auto p-4 gap-3">
              <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/scan-masuk" className={linkClass} onClick={() => setOpen(false)}>
                Scan Masuk
              </NavLink>
              <NavLink to="/scan-keluar" className={linkClass} onClick={() => setOpen(false)}>
                Scan Keluar
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto max-w-6xl p-6">{children}</main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-3 border-t">
        © {new Date().getFullYear()} Sistem Pelacakan Paket
      </footer>
    </div>
  );
};

export default MainLayout;
