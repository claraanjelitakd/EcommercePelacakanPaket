import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Container, Row, Col, Form } from "react-bootstrap";
import PageHeader from "../reusable/PageHeader";
import ActionButtons from "../reusable/ActionButtons";
import CustomModal from "../reusable/CustomModal";
import api from "../api/api";

const Branches = () => {
  const [applications, setApplications] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Branch");
  const [currentBranch, setCurrentBranch] = useState({
    id: null,
    applicationId: "",
    name: "",
    code: "",
  });

  useEffect(() => {
    fetchApplications();
    fetchBranches();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await api.get("/branches");
      setBranches(res.data);
    } catch (error) {
      console.error("❌ Error fetching branches:", error);
    }
  };

  // 🔍 Filter aplikasi
  const filteredApps = applications.filter(
    (app) =>
      app.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.app_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔧 Style DataTable
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

  // 📊 Kolom
  const appColumns = [
    { name: "Application", selector: (row) => `${row.app_name} (${row.app_code})` },
  ];

  const branchColumns = [
    { name: "Branch Name", selector: (row) => row.name, sortable: true },
    { name: "Code", selector: (row) => row.code, sortable: true },
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

  // ➕ Add
  const handleAddNew = () => {
    if (!selectedApp) return alert("Please select an application first!");
    setModalTitle("Add Branch");
    setCurrentBranch({
      id: null,
      applicationId: selectedApp.id,
      name: "",
      code: "",
    });
    setShowModal(true);
  };

  // ✏️ Edit
  const handleEdit = (branch) => {
    setModalTitle("Edit Branch");
    setCurrentBranch(branch);
    setShowModal(true);
  };

  // 💾 Save (Add or Update)
  const handleSave = async () => {
    if (!currentBranch.name || !currentBranch.code) {
      alert("Please fill all fields!");
      return;
    }

    try {
      if (currentBranch.id) {
        // update
        await api.put(`/branches/${currentBranch.id}`, currentBranch);
      } else {
        // create
        await api.post("/branches", currentBranch);
      }
      fetchBranches();
      setShowModal(false);
    } catch (err) {
      console.error("❌ Error saving branch:", err);
      alert("Failed to save branch!");
    }
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this branch?")) return;
    try {
      await api.delete(`/branches/${id}`);
      fetchBranches();
    } catch (err) {
      console.error("❌ Error deleting branch:", err);
    }
  };

  // 📋 Filter branches berdasarkan aplikasi terpilih
  const filteredBranches = branches.filter(
    (b) => b.applicationId === selectedApp?.id
  );

  return (
    <Container
      fluid
      className="p-4 vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif", minWidth: "1080px" }}
    >
      <PageHeader title="Branch / Site" onAddNew={handleAddNew} />

      {/* 🔍 Search */}
      <Form.Control
        type="text"
        placeholder="Search Application..."
        className="mb-3 w-25"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Row>
        {/* 🧱 Applications */}
        <Col md={6} lg={5}>
          <h6 className="fw-bold mb-2">Applications</h6>
          <DataTable
            columns={appColumns}
            data={filteredApps}
            customStyles={customStyles}
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => setSelectedApp(row)}
            conditionalRowStyles={[
              {
                when: (row) => row.id === selectedApp?.id,
                style: { backgroundColor: "#cfe2ff", color: "#000" },
              },
            ]}
          />
        </Col>

        {/* 🧩 Branches */}
        <Col md={6} lg={7}>
          <h6 className="fw-bold mb-2">Branches</h6>
          {selectedApp ? (
            <DataTable
              columns={branchColumns}
              data={filteredBranches}
              customStyles={customStyles}
              highlightOnHover
              striped
              pagination
            />
          ) : (
            <p className="text-muted">Select an application to see branches.</p>
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
            <Form.Label>Branch Name</Form.Label>
            <Form.Control
              type="text"
              value={currentBranch.name || ""}
              onChange={(e) =>
                setCurrentBranch({
                  ...currentBranch,
                  name: e.target.value,
                })
              }
              placeholder="Enter branch name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Branch Code</Form.Label>
            <Form.Control
              type="text"
              value={currentBranch.code || ""}
              onChange={(e) =>
                setCurrentBranch({
                  ...currentBranch,
                  code: e.target.value,
                })
              }
              placeholder="Enter branch code"
            />
          </Form.Group>
        </Form>
      </CustomModal>
    </Container>
  );
};

export default Branches;
