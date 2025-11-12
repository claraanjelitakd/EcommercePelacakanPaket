import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";


const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-gray-700">Pelacakan Paket</h1>
        </div>
        <nav className="space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-500">
            Dashboard
          </Link>
          <Link to="/scan-masuk" className="text-gray-600 hover:text-blue-500">
            Scan Masuk
          </Link>
          <Link to="/scan-keluar" className="text-gray-600 hover:text-blue-500">
            Scan Keluar
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">{children}</main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-3 border-t">
        © {new Date().getFullYear()} Sistem Pelacakan Paket
      </footer>
    </div>
  );
};

export default MainLayout;
