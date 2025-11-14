import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Container, Form } from "react-bootstrap";
import PageHeader from "../reusable/PageHeader";
import ActionButtons from "../reusable/ActionButtons";
import CustomModal from "../reusable/CustomModal";
import api from "../api/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Application");
  const [currentApp, setCurrentApp] = useState({ id: null, app_name: "", app_code: "", notes: "" });

  // 📦 Ambil data dari backend
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
    }
  };

  // ➕ Tambah baru
  const handleAddNew = () => {
    setModalTitle("Add Application");
    setCurrentApp({ id: null, app_name: "", app_code: "", notes: "" });
    setShowModal(true);
  };

  // ✏️ Edit
  const handleEdit = (app) => {
    setModalTitle("Edit Application");
    setCurrentApp(app);
    setShowModal(true);
  };

  // 💾 Simpan data
  const handleSave = async () => {
    try {
      if (currentApp.id) {
        await api.put(`/applications/${currentApp.id}`, currentApp);
      } else {
        console.log("🔍 Data dikirim ke server:", currentApp);
        await api.post("/applications", currentApp);
      }
      await fetchApplications();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error saving application:", error);
    }
  };

  // 🗑️ Hapus
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      await fetchApplications();
    } catch (error) {
      console.error("❌ Error deleting application:", error);
    }
  };

  // 🔍 Pencarian
  const filteredData = applications.filter((a) =>
    a.app_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎨 Styling tabel
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

  const columns = [
    { name: "Application Name", selector: (row) => row.app_name, sortable: true },
    { name: "Application Code", selector: (row) => row.app_code, sortable: true },
    { name: "Notes", selector: (row) => row.notes || "-" },
    {
      name: "Action",
      cell: (row) => (
        <ActionButtons onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row.id)} />
      ),
      right: true,
    },
  ];

  return (
    <Container
      fluid
      className="p-4 vh-100 bg-light"
      style={{ fontFamily: "Poppins, sans-serif", minWidth: "980px" }}
    >
      <PageHeader title="Applications" onAddNew={handleAddNew} />

      {/* 🔍 Search bar */}
      <Form.Control
        type="text"
        placeholder="Search..."
        className="mb-3 w-25"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 📋 DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        customStyles={customStyles}
        pagination
        highlightOnHover
        striped
      />

      {/* 🧩 Modal */}
      <CustomModal
        show={showModal}
        title={modalTitle}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Application Name</Form.Label>
            <Form.Control
              type="text"
              value={currentApp.app_name}
              onChange={(e) => setCurrentApp({ ...currentApp, app_name: e.target.value })}
              placeholder="Enter application name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Application Code</Form.Label>
            <Form.Control
              type="text"
              value={currentApp.app_code}
              onChange={(e) => setCurrentApp({ ...currentApp, app_code: e.target.value })}
              placeholder="Enter application code"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={currentApp.notes}
              onChange={(e) => setCurrentApp({ ...currentApp, notes: e.target.value })}
              placeholder="Enter notes (optional)"
            />
          </Form.Group>
        </Form>
      </CustomModal>
    </Container>
  );
};

export default Applications;
