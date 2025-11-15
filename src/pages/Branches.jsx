// --- 1. Impor yang Diperbarui ---
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import api from "../api/api";
import Button from "../reusable/Button";
import Modal from "../reusable/Modal";

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

  // Handler
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

  const handleEdit = (branch) => {
    setModalTitle("Edit Branch");
    setCurrentBranch(branch);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!currentBranch.name || !currentBranch.code) {
      alert("Please fill all fields!");
      return;
    }
    try {
      if (currentBranch.id) {
        await api.put(`/branches/${currentBranch.id}`, currentBranch);
      } else {
        await api.post("/branches", currentBranch);
      }
      fetchBranches();
      setShowModal(false);
    } catch (err) {
      console.error("❌ Error saving branch:", err);
      alert("Failed to save branch!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this branch?")) return;
    try {
      await api.delete(`/branches/${id}`);
      fetchBranches();
    } catch (err) {
      console.error("❌ Error deleting branch:", err);
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
    { name: "Branch Name", selector: (row) => row.name, sortable: true, grow: 2 },
    { name: "Code", selector: (row) => row.code, sortable: true },
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

  const conditionalAppRowStyles = [
    {
      when: (row) => row.id === selectedApp?.id,
      style: { backgroundColor: "#E0E7FF", color: "#1F2937", fontWeight: "600" },
    },
  ];


  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Branch / Site</h1>
        <Button
          variant="primary"
          onClick={handleAddNew}
          disabled={!selectedApp}
          title={!selectedApp ? "Pilih aplikasi terlebih dahulu" : "Tambah branch baru"}
        >
          <Plus size={18} />
          Add New Branch
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


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Table Aplikasi */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <DataTable
              columns={appColumns}
              data={filteredApps}
              customStyles={customStyles}
              highlightOnHover
              pointerOnHover
              onRowClicked={(row) => setSelectedApp(row)}
              conditionalRowStyles={conditionalAppRowStyles}
            />
          </div>
        </div>

        {/* Table Cabang */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
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
              <p className="p-4 text-gray-500 text-sm">
                Pilih Aplikasi di tabel kiri untuk melihat daftar cabang.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        title={modalTitle}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      >
        <form id="branchForm" onSubmit={(e) => e.preventDefault()} className="space-y-4">

          <div>
            <label htmlFor="branch_name" className="block text-sm font-medium text-gray-700 mb-1">
              Branch Name
            </label>
            <input
              id="branch_name"
              type="text"
              value={currentBranch.name || ""}
              onChange={(e) =>
                setCurrentBranch({ ...currentBranch, name: e.target.value })
              }
              placeholder="Enter branch name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="branch_code" className="block text-sm font-medium text-gray-700 mb-1">
              Branch Code
            </label>
            <input
              id="branch_code"
              type="text"
              value={currentBranch.code || ""}
              onChange={(e) =>
                setCurrentBranch({ ...currentBranch, code: e.target.value })
              }
              placeholder="Enter branch code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

        </form>
      </Modal>
    </>
  );
};

export default Branches;