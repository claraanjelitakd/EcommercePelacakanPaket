import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Container, Row, Col, Form } from "react-bootstrap";
import PageHeader from "../reusable/PageHeader";
import ActionButtons from "../reusable/ActionButtons";
import CustomModal from "../reusable/CustomModal";
import api from "../api/api";

const Roles = () => {
  const [applications, setApplications] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);

  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Role");
  const [currentRole, setCurrentRole] = useState({
    id: null,
    branchId: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchApplications();
    fetchBranches();
    fetchRoles();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (err) {
      console.error("❌ Error fetching applications:", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get("/branches");
      setBranches(res.data);
    } catch (err) {
      console.error("❌ Error fetching branches:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("❌ Error fetching roles:", err);
    }
  };

  // 🔍 Filter aplikasi
  const filteredApps = applications.filter(
    (app) =>
      app.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.app_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✨ Tabel Style
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#3b50ce",
        color: "#fff",
        fontWeight: 600,
        fontFamily: "Poppins, sans-serif",
        fontSize: "15px",
      },
    },
    cells: {
      style: {
        fontFamily: "Poppins, sans-serif",
        fontSize: "14px",
        color: "#333",
      },
    },
  };

  // 📋 Kolom DataTable
  const appColumns = [
    { name: "Application", selector: (row) => `${row.app_name} (${row.app_code})` },
  ];

  const branchColumns = [
    { name: "Branch", selector: (row) => `${row.name} (${row.code})` },
  ];

  const roleColumns = [
    { name: "Role", selector: (row) => row.name, sortable: true },
    { name: "Description", selector: (row) => row.description || "-" },
    {
      name: "Action",
      cell: (row) => (
        <ActionButtons
          onEdit={() => handleEdit(row)}
          onDelete={() => handleDelete(row.id)}
        />
      ),
    },
  ];

  // ➕ Tambah Role
  const handleAddNew = () => {
    if (!selectedBranch) return alert("Please select a branch first!");
    setModalTitle("Add Role");
    setCurrentRole({
      id: null,
      branchId: selectedBranch.id,
      name: "",
      description: "",
    });
    setShowModal(true);
  };

  // ✏️ Edit Role
  const handleEdit = (role) => {
    setModalTitle("Edit Role");
    setCurrentRole(role);
    setShowModal(true);
  };

  // 💾 Simpan Role
  const handleSave = async () => {
    if (!currentRole.name.trim()) {
      alert("Please fill role name!");
      return;
    }

    try {
      if (currentRole.id) {
        await api.put(`/roles/${currentRole.id}`, currentRole);
      } else {
        await api.post("/roles", currentRole);
      }
      fetchRoles();
      setShowModal(false);
    } catch (err) {
      console.error("❌ Error saving role:", err);
      alert("Failed to save role!");
    }
  };

  // 🗑️ Hapus Role
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this role?")) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (err) {
      console.error("❌ Error deleting role:", err);
    }
  };


  const filteredBranches = branches.filter(
    (b) => b.applicationId === selectedApp?.id
  );

  const filteredRoles = roles.filter(
    (r) => r.branchId === selectedBranch?.id
  );

  return (
    <Container
      fluid
      className="p-4 vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif", minWidth: "1080px" }}
    >
      <PageHeader title="Roles Management" onAddNew={handleAddNew} />

      {/* 🔍 Search Bar */}
      <Form.Control
        type="text"
        placeholder="Search Application"
        className="mb-3 w-25"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Row>
        {/* 🧱 Applications */}
        <Col md={4}>
          <h6 className="fw-bold mb-2">Applications</h6>
          <DataTable
            columns={appColumns}
            data={filteredApps}
            customStyles={customStyles}
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => {
              setSelectedApp(row);
              setSelectedBranch(null);
            }}
            conditionalRowStyles={[
              {
                when: (row) => row.id === selectedApp?.id,
                style: { backgroundColor: "#cfe2ff", color: "#000" },
              },
            ]}
          />
        </Col>

        {/* 🧩 Branches */}
        <Col md={4}>
          <h6 className="fw-bold mb-2">Branches</h6>
          {selectedApp ? (
            <DataTable
              columns={branchColumns}
              data={filteredBranches}
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
              onRowClicked={(row) => setSelectedBranch(row)}
              conditionalRowStyles={[
                {
                  when: (row) => row.id === selectedBranch?.id,
                  style: { backgroundColor: "#cfe2ff", color: "#000" },
                },
              ]}
            />
          ) : (
            <p className="text-muted">Select an application first.</p>
          )}
        </Col>

        {/* 🎯 Roles */}
        <Col md={4}>
          <h6 className="fw-bold mb-2">Roles</h6>
          {selectedBranch ? (
            <DataTable
              columns={roleColumns}
              data={filteredRoles}
              customStyles={customStyles}
              highlightOnHover
              striped
              pagination
            />
          ) : (
            <p className="text-muted">Select a branch to see roles.</p>
          )}
        </Col>
      </Row>

      {/* 🪟 Modal Add/Edit */}
      <CustomModal
        show={showModal}
        title={modalTitle}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Role Name</Form.Label>
            <Form.Control
              type="text"
              value={currentRole.name || ""}
              onChange={(e) =>
                setCurrentRole({ ...currentRole, name: e.target.value })
              }
              placeholder="Enter role name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={currentRole.description || ""}
              onChange={(e) =>
                setCurrentRole({ ...currentRole, description: e.target.value })
              }
              placeholder="Optional description"
            />
          </Form.Group>
        </Form>
      </CustomModal>
    </Container>
  );
};

export default Roles;
