import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import api from "../api/api";
import Button from "../reusable/Button";
import Modal from "../reusable/Modal";

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

  // Handler
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

  const handleEdit = (role) => {
    setModalTitle("Edit Role");
    setCurrentRole(role);
    setShowModal(true);
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this role?")) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (err) {
      console.error("❌ Error deleting role:", err);
    }
  };

  // Filter
  const filteredApps = applications.filter(
    (app) =>
      app.app_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.app_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBranches = branches.filter(
    (b) => b.applicationId === selectedApp?.id
  );

  const filteredRoles = roles.filter(
    (r) => r.branchId === selectedBranch?.id
  );

  // Styling
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#7C3AED",
        color: "#fff",
        fontWeight: 600,
        fontSize: "14px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#374151",
      },
    },
  };

  const appColumns = [
    { name: "Application", selector: (row) => `${row.app_name} (${row.app_code})`, sortable: true },
  ];

  const branchColumns = [
    { name: "Branch", selector: (row) => `${row.name} (${row.code})`, sortable: true },
  ];

  const roleColumns = [
    { name: "Role", selector: (row) => row.name, sortable: true, grow: 1 },
    { name: "Description", selector: (row) => row.description || "-", grow: 2 },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            isIconOnly={true}
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <Edit3 size={18} />
          </Button>
          <Button
            variant="ghost"
            isIconOnly={true}
            onClick={() => handleDelete(row.id)}
            className="text-red-500 hover:text-red-700"
            title="Hapus"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ),
      center: true,
      width: "120px",
    },
  ];

  const conditionalRowStyles = (selectedRow) => [
    {
      when: (row) => row.id === selectedRow?.id,
      style: { backgroundColor: "#E0E7FF", color: "#1F2937", fontWeight: "600" },
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Roles Management</h1>
        <Button
          variant="primary"
          onClick={handleAddNew}
          disabled={!selectedBranch}
          title={!selectedBranch ? "Pilih aplikasi & cabang dulu" : "Tambah role baru"}
        >
          <Plus size={18} />
          Add New Role
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex-1 flex items-center gap-3 w-full max-w-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 transition-all duration-150 focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-300">
          <Search className="text-gray-500 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Application..."
            className="w-full bg-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Table Applications */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
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
              conditionalRowStyles={conditionalRowStyles(selectedApp)}
            />
          </div>
        </div>

        {/* Table Branches */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {selectedApp ? (
              <DataTable
                columns={branchColumns}
                data={filteredBranches}
                customStyles={customStyles}
                highlightOnHover
                pointerOnHover
                onRowClicked={(row) => setSelectedBranch(row)}
                conditionalRowStyles={conditionalRowStyles(selectedBranch)}
              />
            ) : (
              <p className="p-4 text-gray-500 text-sm">
                Pilih Aplikasi...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Table Roles */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
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
            <p className="p-4 text-gray-500 text-sm">
              Pilih Cabang...
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        title={modalTitle}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <form id="roleForm" onSubmit={(e) => e.preventDefault()} className="space-y-4">

          <div>
            <label htmlFor="role_name" className="block text-sm font-medium text-gray-700 mb-1">
              Role Name
            </label>
            <input
              id="role_name"
              type="text"
              value={currentRole.name || ""}
              onChange={(e) =>
                setCurrentRole({ ...currentRole, name: e.target.value })
              }
              placeholder="Enter role name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="role_desc" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="role_desc"
              rows={2}
              value={currentRole.description || ""}
              onChange={(e) =>
                setCurrentRole({ ...currentRole, description: e.target.value })
              }
              placeholder="Optional description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

        </form>
      </Modal>
    </>
  );
};

export default Roles;