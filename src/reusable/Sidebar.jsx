// src/components/reusable/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { HouseDoor, People, Briefcase, Building } from "react-bootstrap-icons";

const Sidebar = () => {
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
        <li>
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold text-primary" : ""}`
            }
          >
            <HouseDoor className="me-2" /> Applications
          </NavLink>
        </li>
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
        <li>
          <NavLink
            to="/mapping"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "fw-bold text-primary" : ""}`
            }
          >
            <People className="me-2" /> Mapping User Role
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
