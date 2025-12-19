import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Search, Plus, Edit3, Trash2, Shield, Lock } from "lucide-react"; // Tambah ikon Lock/Shield
import api from "../api/api";
import Button from "../reusable/Button";
import Modal from "../reusable/Modal";

const SYSTEM_ROLE_IDS = [1, 2, 3, 4];

const Roles = () => {
  const getUserData = () => {
    const savedData = localStorage.getItem("user");
    if (savedData) return JSON.parse(savedData);
    return null;
  };

  const userData = getUserData();
  const isSuperAdmin = userData?.role?.name === "Super Admin";

  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Role");
  const [currentRole, setCurrentRole] = useState({
    id: null,
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("❌ Error fetching roles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoles = roles.filter((role) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = role.name.toLowerCase().includes(searchLower);
    const descMatch = role.description && role.description.toLowerCase().includes(searchLower);
    return nameMatch || descMatch;
  });

  // Handler
  const handleAddNew = () => {
    setModalTitle("Add Role");
    setCurrentRole({ id: null, name: "", description: "" });
    setShowModal(true);
  };

  const handleEdit = (role) => {
    if (SYSTEM_ROLE_IDS.includes(role.id)) {
      alert("Role bawaan sistem tidak boleh diedit.");
      return;
    }
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
      alert(err.response?.data?.message || "Failed to save role!");
    }
  };

  const handleDelete = async (id) => {
    if (SYSTEM_ROLE_IDS.includes(id)) {
      alert("Role bawaan sistem tidak boleh dihapus.");
      return;
    }
    if (!window.confirm("Are you sure want to delete this role?")) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (err) {
      console.error("❌ Error deleting role:", err);
      alert(err.response?.data?.message || "Gagal menghapus role.");
    }
  };

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

  const roleColumns = [
    {
      name: "Role",
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div className="flex items-center gap-2 font-medium">
          {SYSTEM_ROLE_IDS.includes(row.id) && <Shield size={14} className="text-purple-600" fill="currentColor" />}
          {row.name}
        </div>
      )
    },
    { name: "Description", selector: (row) => row.description || "-", grow: 2 },
    {
      name: "Action",
      cell: (row) => {
        const isSystemRole = SYSTEM_ROLE_IDS.includes(row.id);

        if (!isSuperAdmin) return null;

        return (
          <div className="flex justify-center gap-1">
            {isSystemRole ? (
              <span className="text-gray-400 flex items-center gap-1 text-xs italic px-2 py-1 bg-gray-100 rounded">
                <Lock size={12} /> Protected
              </span>
            ) : (
              <>
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
              </>
            )}
          </div>
        );
      },
      center: true,
      width: "150px",
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Roles Management</h1>

        {isSuperAdmin && (
          <Button
            variant="primary"
            onClick={handleAddNew}
          >
            <Plus size={18} />
            Add New Role
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex-1 flex items-center gap-3 w-full max-w-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 transition-all duration-150 focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-300">
          <Search className="text-gray-500 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search role..."
            className="w-full bg-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table Roles */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={roleColumns}
            data={filteredRoles}
            customStyles={customStyles}
            highlightOnHover
            striped
            pagination
            progressPending={isLoading}
            persistTableHead
            noDataComponent={
              <div className="p-10 text-center text-gray-500">
                No roles found.
              </div>
            }
          />
        </div>
      </div>

      {/* Modal - Hanya Render jika Super Admin (Security Layer) */}
      {isSuperAdmin && (
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
                autoFocus
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
      )}
    </>
  );
};

export default Roles;