import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Search, Edit3, Trash2, Plus } from "lucide-react";
import api from "../api/api";
import Button from "../reusable/Button";
import Modal from "../reusable/Modal";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Application");
  const [currentApp, setCurrentApp] = useState({ id: null, app_name: "", app_code: "", notes: "" });

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

  const handleAddNew = () => {
    setModalTitle("Add Application");
    setCurrentApp({ id: null, app_name: "", app_code: "", notes: "" });
    setShowModal(true);
  };

  const handleEdit = (app) => {
    setModalTitle("Edit Application");
    setCurrentApp(app);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (currentApp.id) {
        await api.put(`/applications/${currentApp.id}`, currentApp);
      } else {
        await api.post("/applications", currentApp);
      }
      await fetchApplications();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error saving application:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      await fetchApplications();
    } catch (error) {
      console.error("❌ Error deleting application:", error);
    }
  };

  const filteredData = applications.filter((a) =>
    a.app_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const columns = [
    { name: "Application Name", selector: (row) => row.app_name, sortable: true, grow: 2 },
    { name: "Application Code", selector: (row) => row.app_code, sortable: true },
    { name: "Notes", selector: (row) => row.notes || "-", grow: 3 },
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

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
        <Button variant="primary" onClick={handleAddNew}>
          <Plus size={18} />
          Add New
        </Button>
      </div>

      {/* Search  */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex-1 flex items-center gap-3 w-full max-w-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 transition-all duration-150 focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-300">
          <Search className="text-gray-500 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search application name..."
            className="w-full bg-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredData}
          customStyles={customStyles}
          pagination
          highlightOnHover
          striped
        />
      </div>

      {/* Modal */}
      <Modal
        show={showModal}
        title={modalTitle}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        saveText="Simpan Perubahan"
      >
        {/* 'children' modalnya adalah form */}
        <form id="applicationForm" onSubmit={(e) => e.preventDefault()} className="space-y-4">

          {/* Form Group */}
          <div>
            <label htmlFor="app_name" className="block text-sm font-medium text-gray-700 mb-1">
              Application Name
            </label>
            <input
              id="app_name"
              type="text"
              value={currentApp.app_name}
              onChange={(e) => setCurrentApp({ ...currentApp, app_name: e.target.value })}
              placeholder="Enter application name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Form Group */}
          <div>
            <label htmlFor="app_code" className="block text-sm font-medium text-gray-700 mb-1">
              Application Code
            </label>
            <input
              id="app_code"
              type="text"
              value={currentApp.app_code}
              onChange={(e) => setCurrentApp({ ...currentApp, app_code: e.target.value })}
              placeholder="Enter application code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Form Group */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={currentApp.notes}
              onChange={(e) => setCurrentApp({ ...currentApp, notes: e.target.value })}
              placeholder="Enter notes (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

        </form>
      </Modal>
    </>
  );
};

export default Applications;