import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HouseDoor, People, Briefcase, Building, BoxArrowRight, Kanban, X } from "react-bootstrap-icons";
import api from '../api/api';

const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive
      ? 'bg-purple-600 text-white font-medium'
      : 'text-gray-300 hover:bg-purple-800 hover:text-white'
    }`;

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      />

      <div
        className={`fixed inset-y-0 left-0 z-30 flex h-full w-[240px] flex-col bg-purple-900 text-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full' // Logika buka/tutup mobile
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-purple-800">
          <h4 className="text-center font-bold text-lg">Admin Panel</h4>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 text-gray-300 hover:text-white"
            aria-label="Tutup menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink to="/dashboard" className={linkClass}>
                <HouseDoor size={18} /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/applications" className={linkClass}>
                <Kanban size={18} /> Applications
              </NavLink>
            </li>
            <li>
              <NavLink to="/branches" className={linkClass}>
                <Building size={18} /> Branches
              </NavLink>
            </li>
            <li>
              <NavLink to="/roles" className={linkClass}>
                <Briefcase size={18} /> Roles
              </NavLink>
            </li>
            <li>
              <NavLink to="/mapping-user" className={linkClass}>
                <People size={18} /> Mapping User
              </NavLink>
            </li>
            <li>
              <NavLink to="/users" className={linkClass}>
                <People size={18} /> Users
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="p-3 border-t border-purple-800">
          <button
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700"
            onClick={handleLogout}
          >
            <BoxArrowRight size={18} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;