import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { HouseDoor, People, Briefcase, Building, BoxArrowRight, Kanban } from "react-bootstrap-icons";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      className="bg-dark text-white d-flex flex-column p-3"
      style={{
        width: "240px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <h4 className="text-center mb-4">Admin Panel</h4>

      <ul className="nav flex-column gap-2">

        {/* 🔹 DASHBOARD */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold text-primary" : ""}`
            }
          >
            <HouseDoor className="me-2" /> Dashboard
          </NavLink>
        </li>

        {/* 🔹 APPLICATIONS */}
        <li>
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold text-primary" : ""}`
            }
          >
            <Kanban className="me-2" /> Applications
          </NavLink>
        </li>

        {/* 🔹 BRANCHES */}
        <li>
          <NavLink
            to="/branches"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold text-primary" : ""}`
            }
          >
            <Building className="me-2" /> Branches
          </NavLink>
        </li>

        {/* 🔹 ROLES */}
        <li>
          <NavLink
            to="/roles"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold text-primary" : ""}`
            }
          >
            <Briefcase className="me-2" /> Roles
          </NavLink>
        </li>

        {/* 🔹 USERS */}
        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold text-primary" : ""}`
            }
          >
            <People className="me-2" /> Users
          </NavLink>
        </li>

        {/* 🔹 MAPPING USER ROLE */}
        <li>
          <NavLink
            to="/mapping-user"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold text-primary" : ""}`
            }
          >
            <People className="me-2" /> Mapping User Role
          </NavLink>
        </li>
      </ul>

      {/* 🔹 LOGOUT BUTTON */}
      <button
        className="btn btn-danger mt-auto"
        onClick={handleLogout}
      >
        <BoxArrowRight className="me-2" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
