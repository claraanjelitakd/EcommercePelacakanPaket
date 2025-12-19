import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Search, Plus, Edit3, Trash2, KeyRound, Eye, EyeOff, ShieldAlert, User, Mail, UserCheck } from "lucide-react";
import api from "../api/api";
import Button from "../reusable/Button";
import Modal from "../reusable/Modal";

// Komponen Toggle Status (Support Disabled Mode)
const StatusToggle = ({ isActive, onChange, disabled }) => {
  return (
    <button
      type="button"
      onClick={!disabled ? onChange : undefined}
      role="switch"
      aria-checked={isActive}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-purple-600' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
  // --- 1. Cek Role & User Login ---
  const getUserData = () => {
    const savedData = localStorage.getItem("user");
    if (savedData) return JSON.parse(savedData);
    return null;
  };
  const currentUser = getUserData();
  const userRole = currentUser?.role?.name || "";
  const currentUserId = currentUser?.id;

  // Hak Akses: Super Admin & Owner boleh kelola user
  const canManage = userRole === "Super Admin" || userRole === "Owner";

  // State
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReset, setShowReset] = useState(false);

  // Form Data
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ userName: "", fullName: "", email: "", password: "", status: true });
  // STATE BARU: Untuk menyimpan error validasi email
  const [emailError, setEmailError] = useState("");

  const [editUser, setEditUser] = useState(null);

  // --- LOGIKA VALIDASI EMAIL ---
  const allowedDomains = [
    "gmail.com", "yahoo.com", "yahoo.co.id", "outlook.com", "hotmail.com"
  ];

  const validateEmailDomain = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return false;
    const domain = email.split("@")[1];
    return allowedDomains.includes(domain);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter
  const filteredUsers = users.filter(user =>
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sanitasi Input
  const sanitizeInput = (input) => {
    return input.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 30); // Hanya huruf, angka, underscore
  };

  // --- Handlers ---

  const handleAddNew = () => {
    setShowAdd(true);
    setNewUser({ userName: '', fullName: '', email: '', password: '', status: true });
    setEmailError(""); // Reset error saat buka modal baru
  };

  const handleSaveAdd = async () => {
    if (!newUser.userName || !newUser.fullName || !newUser.email || !newUser.password) {
      alert('Semua field wajib diisi!');
      return;
    }

    // CEK VALIDASI EMAIL SEBELUM SAVE
    if (!validateEmailDomain(newUser.email)) {
      alert("Email tidak valid! Gunakan domain umum (Gmail, Yahoo, dll).");
      return;
    }

    try {
      await api.post("/users", newUser);
      await fetchUsers();
      setShowAdd(false);
    } catch (error) {
      console.error("❌ Error adding user:", error);
      alert(error.response?.data?.message || "Gagal menambahkan user!");
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
    if (user.id === currentUserId) {
      alert("Anda tidak bisa menonaktifkan akun Anda sendiri saat sedang login.");
      return;
    }

    try {
      await api.put(`/users/${user.id}`, { ...user, status: !user.status });
      await fetchUsers();
    } catch (error) {
      console.error("❌ Error toggling status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUserId) {
      alert("Anda tidak bisa menghapus akun Anda sendiri.");
      return;
    }

    if (!window.confirm("Yakin ingin menghapus user ini?")) return;
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      alert(error.response?.data?.message || "Gagal menghapus user!");
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

  const columns = [
    {
      name: 'User',
      selector: row => row.userName,
      sortable: true,
      grow: 2,
      cell: row => (
        <div className="flex flex-col py-2">
          <div className="font-medium text-gray-900 flex items-center gap-2">
            <User size={16} className="text-purple-500" />
            {row.userName}
          </div>
          <div className="text-xs text-gray-500">{row.fullName}</div>
        </div>
      )
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      grow: 2,
      cell: row => (
        <div className="flex items-center gap-2 text-gray-600">
          <Mail size={14} /> {row.email}
        </div>
      )
    },
    {
      name: 'Status',
      cell: row => (
        <div className="flex items-center gap-2">
          <StatusToggle
            isActive={row.status}
            onChange={() => handleToggleStatus(row)}
            disabled={!canManage}
          />
          <span className={`text-xs font-medium ${row.status ? 'text-green-600' : 'text-gray-400'}`}>
            {row.status ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
      center: true,
    },
    {
      name: 'Action',
      cell: row => {
        if (!canManage) return null;

        return (
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
        );
      },
      center: true,
      width: "180px",
    },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
          {!canManage && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ShieldAlert size={14} /> View Only Mode
            </p>
          )}
        </div>

        {canManage && (
          <Button variant="primary" onClick={handleAddNew}>
            <Plus size={18} />
            Add New User
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-200">
        <div className="flex-1 flex items-center gap-3 w-full max-w-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 transition-all duration-150 focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-300">
          <Search className="text-gray-500 w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search username, name, email..."
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
            progressPending={isLoading}
          />
        </div>
      </div>

      {/* Modal Add (Hanya Render jika Admin) */}
      {showAdd && canManage && (
        <Modal
          show={showAdd}
          title="Add New User"
          onClose={() => setShowAdd(false)}
          onSave={handleSaveAdd}
          saveText="Simpan User"
          // Disable tombol simpan jika ada error email
          disabled={!!emailError}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={newUser.userName}
                  onChange={e => setNewUser({ ...newUser, userName: sanitizeInput(e.target.value) })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="john_doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={newUser.fullName}
                onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            {/* INPUT EMAIL DENGAN VALIDASI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => {
                    const val = e.target.value;
                    setNewUser({ ...newUser, email: val });

                    // Logic Validasi Real-time
                    if (val && !validateEmailDomain(val)) {
                      setEmailError("Gunakan email umum (Gmail, Yahoo, dll)");
                    } else {
                      setEmailError("");
                    }
                  }}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:outline-none ${emailError
                      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                    }`}
                  placeholder="john@example.com"
                />
              </div>
              {/* Pesan Error di bawah input */}
              {emailError && (
                <p className="text-xs text-red-600 mt-1 ml-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Edit (Hanya Render jika Admin) */}
      {editUser && canManage && (
        <Modal
          show={showEdit}
          title="Edit User"
          onClose={() => setShowEdit(false)}
          onSave={handleSaveEdit}
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
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
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <UserCheck size={18} /> Status Akun
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${editUser.status ? 'text-green-600' : 'text-gray-500'}`}>
                  {editUser.status ? 'Aktif' : 'Non-Aktif'}
                </span>
                <StatusToggle
                  isActive={editUser.status}
                  onChange={() => setEditUser({ ...editUser, status: !editUser.status })}
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Reset Password */}
      {selectedUser && canManage && (
        <Modal
          show={showReset}
          title="Reset Password"
          onClose={() => setShowReset(false)}
          onSave={handleConfirmReset}
          saveText="Ya, Reset"
          cancelText="Batal"
        >
          <div className="text-center py-2">
            <div className="mx-auto w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-3">
              <KeyRound size={24} />
            </div>
            <p className="text-gray-700 mb-1">
              Apakah Anda yakin ingin mereset password untuk:
            </p>
            <p className="text-lg font-bold text-gray-900 mb-3">{selectedUser.fullName}</p>

            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-700">
              ⚠️ Password akan diubah menjadi default: <strong>12345678</strong>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Users;