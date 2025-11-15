import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Search, Plus, Edit3, Trash2, KeyRound } from "lucide-react";
import api from "../api/api";
import Button from "../reusable/Button";
import Modal from "../reusable/Modal";

const StatusToggle = ({ isActive, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={isActive}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${isActive ? 'bg-purple-600' : 'bg-gray-300'
        }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'
          }`}
      />
    </button>
  );
};


const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ userName: "", fullName: "", email: "", status: true });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  // Handler
  const filteredUsers = users.filter(user =>
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setShowAdd(true);
    setNewUser({ userName: '', fullName: '', email: '', password: '', status: true });
  };

  const handleSaveAdd = async () => {
    if (!newUser.userName || !newUser.fullName || !newUser.email || !newUser.password) {
      alert('Semua field wajib diisi!');
      return;
    }
    try {
      await api.post("/users", newUser);
      await fetchUsers();
      setShowAdd(false);
    } catch (error) {
      console.error("❌ Error adding user:", error);
      alert("Gagal menambahkan user!");
    }
  };

  const handleEdit = user => {
    setEditUser(user);
    setShowEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/users/${editUser.id}`, editUser);
      await fetchUsers();
      setShowEdit(false);
    } catch (error) {
      console.error("❌ Error updating user:", error);
      alert("Gagal mengedit user!");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/users/${user.id}`, { ...user, status: !user.status });
      await fetchUsers();
    } catch (error) {
      console.error("❌ Error toggling status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      alert("Gagal menghapus user!");
    }
  };

  const handleResetClick = user => {
    setSelectedUser(user);
    setShowReset(true);
  };

  const handleConfirmReset = async () => {
    try {
      await api.post(`/users/reset/${selectedUser.id}`);
      alert(`Password untuk ${selectedUser.fullName} telah direset menjadi 12345678.`);
      setShowReset(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      alert("Gagal mereset password!");
    }
  };

  // Styling & Columns
  const columns = [
    { name: 'UserName', selector: row => row.userName, sortable: true, grow: 1 },
    { name: 'FullName', selector: row => row.fullName, sortable: true, grow: 1.5 },
    { name: 'Email', selector: row => row.email, sortable: true, grow: 1.5 },
    {
      name: 'Status',
      cell: row => (
        <StatusToggle
          isActive={row.status}
          onChange={() => handleToggleStatus(row)}
        />
      ),
      center: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="flex justify-center gap-1">
          <Button
            variant="ghost"
            isIconOnly={true}
            onClick={() => handleResetClick(row)}
            className="text-yellow-600 hover:text-yellow-800"
            title="Reset Password"
          >
            <KeyRound size={18} />
          </Button>
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
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#7C3AED',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#374151",
      },
    },
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <Button variant="primary" onClick={handleAddNew}>
          <Plus size={18} />
          Add New User
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex-1 flex items-center gap-3 w-full max-w-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 transition-all duration-150 focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-300">
          <Search className="text-gray-500 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by username, fullname, or email..."
            className="w-full bg-transparent outline-none text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredUsers}
            pagination
            highlightOnHover
            striped
            customStyles={customStyles}
          />
        </div>
      </div>

      {/* Modal Add */}
      <Modal
        show={showAdd}
        title="Add New User"
        onClose={() => setShowAdd(false)}
        onSave={handleSaveAdd}
        saveText="Simpan User"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UserName</label>
            <input
              type="text"
              value={newUser.userName}
              onChange={e => setNewUser({ ...newUser, userName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={newUser.fullName}
              onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Modal Edit */}
      {editUser && (
        <Modal
          show={showEdit}
          title="Edit User"
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UserName</label>
              <input
                type="text"
                value={editUser.userName}
                onChange={e => setEditUser({ ...editUser, userName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={editUser.fullName}
                onChange={e => setEditUser({ ...editUser, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editUser.email}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <StatusToggle
                isActive={editUser.status}
                onChange={() =>
                  setEditUser({ ...editUser, status: !editUser.status })
                }
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Reset Password */}
      {selectedUser && (
        <Modal
          show={showReset}
          title="Reset Password"
          onClose={() => setShowReset(false)}
          onSave={handleConfirmReset}
          saveText="Ya, Reset"
          cancelText="Batal"
        >
          <div>
            <p>
              Apakah Anda yakin ingin mereset password untuk user{' '}
              <strong className="text-gray-900">{selectedUser.fullName}</strong>
              (<span className="font-mono">{selectedUser.userName}</span>)?
            </p>
            <p className="text-red-600 font-medium text-sm mt-2">
              Password akan diubah menjadi '12345678'.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Users;