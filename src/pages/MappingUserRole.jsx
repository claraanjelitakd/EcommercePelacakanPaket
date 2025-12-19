import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Edit3, Trash2, ShieldAlert, ArrowRight } from "lucide-react";
import api from "../api/api";
import Button from "../reusable/Button";
import Modal from "../reusable/Modal";

// --- Components Kecil ---
const StatusToggle = ({ isActive, onChange, disabled }) => (
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

const MappingForm = ({ data, setData, applications, branches, roles, users, isOwner }) => {
  const filteredBranches = useMemo(() => {
    if (!data.applicationId) return [];
    return branches.filter(b => b.applicationId === parseInt(data.applicationId));
  }, [data.applicationId, branches]);

  const filteredRoles = useMemo(() => {
    if (isOwner) return roles.filter(r => r.id !== 1);
    return roles;
  }, [roles, isOwner]);

  const filteredUsers = useMemo(() => users.filter(u => u.status), [users]);

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Application</label>
        <select
          value={data.applicationId}
          onChange={e => setData({ ...data, applicationId: e.target.value, branchId: "", roleId: "" })}
          disabled={isOwner}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">-- Select Application --</option>
          {applications.map(app => (
            <option key={app.id} value={app.id}>{app.app_name}</option>
          ))}
        </select>
      </div>

      {/* Branch */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
        <select
          value={data.branchId}
          onChange={e => setData({ ...data, branchId: e.target.value })}
          disabled={!data.applicationId}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:bg-gray-100"
        >
          <option value="">-- Select Branch --</option>
          {filteredBranches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select
          value={data.roleId}
          onChange={e => setData({ ...data, roleId: e.target.value })}
          // Role biasanya tidak butuh branchId (kecuali role spesifik cabang), kita buka saja jika App sudah dipilih
          disabled={!data.applicationId}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:bg-gray-100"
        >
          <option value="">-- Select Role --</option>
          {filteredRoles.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* User */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
        <select
          value={data.userId}
          onChange={e => setData({ ...data, userId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:bg-gray-100"
        >
          <option value="">-- Select User --</option>
          {filteredUsers.map(u => (
            <option key={u.id} value={u.id}>{u.fullName}</option>
          ))}
        </select>
      </div>
    </form>
  );
};

// --- Main Component ---
const MappingUserRole = () => {
  const getUserData = () => {
    const savedData = localStorage.getItem("user");
    if (savedData) return JSON.parse(savedData);
    return null;
  };
  const userData = getUserData();
  const userRole = userData?.role?.name || "";

  const canManage = userRole === "Super Admin" || userRole === "Owner";
  const isOwner = userRole === "Owner";

  const [applications, setApplications] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [mappings, setMappings] = useState([]);

  // State Selection
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // State Search
  const [searchApp, setSearchApp] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchUser, setSearchUser] = useState("");

  // State Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    applicationId: "", branchId: "", roleId: "", userId: "", status: true,
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [appRes, branchRes, roleRes, userRes, mappingRes] = await Promise.all([
        api.get("/applications"),
        api.get("/branches"),
        api.get("/roles"),
        api.get("/users"),
        api.get("/mappings"),
      ]);

      const appsData = appRes.data;
      setApplications(appsData);
      setBranches(branchRes.data);
      setRoles(roleRes.data);
      setUsers(userRes.data);
      setMappings(mappingRes.data);

      if (appsData.length === 1) {
        setSelectedApp(appsData[0]);
      } else if (isOwner && userData.application) {
        const myApp = appsData.find(a => a.id === userData.application.id);
        if (myApp) setSelectedApp(myApp);
      }
    } catch (err) { console.error("❌ Error fetching data:", err); }
  };

  // --- Handlers ---
  const handleAddNew = () => {
    setFormData({
      applicationId: selectedApp ? selectedApp.id : "",
      branchId: selectedBranch ? selectedBranch.id : "",
      roleId: selectedRole ? selectedRole.id : "",
      userId: "",
      status: true
    });
    setShowAddModal(true);
  };

  const handleSaveNew = async () => {
    const { applicationId, branchId, roleId, userId } = formData;

    // Validasi sederhana (Branch boleh kosong jika role level App/Owner)
    if (!applicationId || !roleId || !userId) {
      alert("Application, Role, dan User wajib diisi!");
      return;
    }

    try {
      await api.post("/mappings", formData);
      await fetchAll();
      setShowAddModal(false);
    } catch (err) {
      console.error("❌ Gagal menambah mapping:", err);
      alert(err.response?.data?.message || "Gagal menambah data");
    }
  };

  const handleEdit = (mapping) => {
    setEditingMapping(mapping);
    setFormData({
      applicationId: mapping.applicationId,
      branchId: mapping.branchId || "",
      roleId: mapping.roleId,
      userId: mapping.userId,
      status: mapping.status,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMapping) return;
    try {
      const updated = { ...editingMapping, ...formData };
      await api.put(`/mappings/${editingMapping.id}`, updated);
      await fetchAll();
      setShowEditModal(false);
      setEditingMapping(null);
    } catch (err) {
      console.error("❌ Error updating mapping:", err);
      alert("Gagal update data");
    }
  };

  const handleToggleStatus = async (mappingId, currentStatus) => {
    try {
      await api.patch(`/mappings/${mappingId}`, { status: !currentStatus });
      await fetchAll();
    } catch (err) { console.error("❌ Gagal update status:", err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this mapping?")) return;
    try {
      await api.delete(`/mappings/${id}`);
      await fetchAll();
    } catch (err) { console.error("❌ Error deleting mapping:", err); }
  };

  // --- Filtering Logic ---
  const filteredApps = applications.filter(a =>
    a.app_name.toLowerCase().includes(searchApp.toLowerCase())
  );

  const filteredBranches = branches.filter(
    b => b.applicationId === selectedApp?.id &&
      b.name.toLowerCase().includes(searchBranch.toLowerCase())
  );

  // Tampilkan semua role, atau filter jika perlu logic khusus
  const filteredRoles = roles.filter(
    r => r.name.toLowerCase().includes(searchRole.toLowerCase())
  );

  const filteredMappings = mappings
    .filter(m =>
      m.applicationId === selectedApp?.id &&
      // Logic: Jika selectedBranch null, tampilkan semua di App tsb? 
      // Atau harus strict match? Biasanya strict match agar rapi.
      (selectedBranch ? m.branchId === selectedBranch.id : true) &&
      (selectedRole ? m.roleId === selectedRole.id : true)
    )
    .map(m => ({ ...m, user: users.find(u => u.id === m.userId) }))
    .filter(m => m.user && m.user.fullName?.toLowerCase().includes(searchUser.toLowerCase()));

  // --- Render ---
  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mapping User Role</h1>
          {!canManage && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <ShieldAlert size={14} /> View Only Mode
            </p>
          )}
        </div>

        {/* Tombol Add: Hanya jika canManage */}
        {canManage && (
          <Button
            variant="primary"
            onClick={handleAddNew}
            // Enable tombol add jika minimal App sudah dipilih
            disabled={!selectedApp}
            title={!selectedApp ? "Pilih Aplikasi dulu" : "Tambah mapping baru"}
          >
            <Plus size={18} />
            Add New Mapping
          </Button>
        )}
      </div>

      {/* Grid 4 Kolom: App -> Branch -> Role -> Users */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 h-[calc(100vh-200px)]">

        {/* 1. Table Applications */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
          <h6 className="text-lg font-semibold p-4 border-b bg-gray-50 rounded-t-xl">1. Applications</h6>
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 w-full bg-gray-50 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-purple-300">
              <Search className="text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent outline-none text-sm"
                value={searchApp}
                onChange={e => setSearchApp(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={() => {
                  setSelectedApp(app);
                  setSelectedBranch(null);
                  setSelectedRole(null);
                }}
                className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all flex justify-between items-center ${selectedApp?.id === app.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <span className="font-medium truncate">{app.app_name}</span>
                {selectedApp?.id === app.id && <ArrowRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Table Branches */}
        <div className={`bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-full transition-opacity ${!selectedApp ? 'opacity-50' : 'opacity-100'}`}>
          <h6 className="text-lg font-semibold p-4 border-b bg-gray-50 rounded-t-xl">2. Branches</h6>
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 w-full bg-gray-50 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-purple-300">
              <Search className="text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent outline-none text-sm"
                value={searchBranch}
                onChange={e => setSearchBranch(e.target.value)}
                disabled={!selectedApp}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {!selectedApp ? (
              <div className="text-center text-gray-400 text-sm mt-10">Pilih Aplikasi dulu</div>
            ) : (
              <>
                {/* Opsi All Branches (Opsional, jika ingin lihat semua user di app ini) */}
                <button
                  onClick={() => { setSelectedBranch(null); setSelectedRole(null); }}
                  className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all border-b border-dashed mb-2 ${selectedBranch === null
                      ? "bg-purple-100 text-purple-800 font-bold border-purple-300"
                      : "hover:bg-gray-100 text-gray-500 italic"
                    }`}
                >
                  -- Semua Cabang --
                </button>

                {filteredBranches.map(branch => (
                  <button
                    key={branch.id}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setSelectedRole(null);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all flex justify-between items-center ${selectedBranch?.id === branch.id
                        ? "bg-purple-600 text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <span className="truncate">{branch.name}</span>
                    {selectedBranch?.id === branch.id && <ArrowRight size={16} />}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* 3. Table Roles */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
          <h6 className="text-lg font-semibold p-4 border-b bg-gray-50 rounded-t-xl">3. Roles</h6>
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 w-full bg-gray-50 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-purple-300">
              <Search className="text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent outline-none text-sm"
                value={searchRole}
                onChange={e => setSearchRole(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-1">
            {/* Opsi All Roles */}
            <button
              onClick={() => setSelectedRole(null)}
              className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all border-b border-dashed mb-2 ${selectedRole === null
                  ? "bg-purple-100 text-purple-800 font-bold border-purple-300"
                  : "hover:bg-gray-100 text-gray-500 italic"
                }`}
            >
              -- Semua Role --
            </button>

            {filteredRoles.map(role => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-all flex justify-between items-center ${selectedRole?.id === role.id
                    ? "bg-purple-600 text-white shadow-md"
                    : "hover:bg-gray-100 text-gray-700"
                  }`}
              >
                <span>{role.name}</span>
                {selectedRole?.id === role.id && <ArrowRight size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Table Users (Result) */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col h-full">
          <h6 className="text-lg font-semibold p-4 border-b bg-gray-50 rounded-t-xl">4. Mapped Users</h6>
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 w-full bg-gray-50 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-purple-300">
              <Search className="text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search User..."
                className="w-full bg-transparent outline-none text-sm"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {!selectedApp ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                <p>Pilih Aplikasi & Cabang</p>
              </div>
            ) : filteredMappings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                <p>Tidak ada user ditemukan pada filter ini.</p>
              </div>
            ) : (
              <table className="w-full table-auto text-left">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase sticky top-0">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    {canManage && <th className="px-4 py-3 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {filteredMappings.map(m => (
                    <tr key={m.id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{m.user?.fullName}</div>
                        <div className="text-xs text-gray-500">{m.user?.userName}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusToggle
                          isActive={m.status}
                          onChange={() => handleToggleStatus(m.id, m.status)}
                          disabled={!canManage}
                        />
                      </td>
                      {canManage && (
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost" isIconOnly={true}
                              onClick={() => handleEdit(m)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit3 size={16} />
                            </Button>
                            <Button
                              variant="ghost" isIconOnly={true}
                              onClick={() => handleDelete(m.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Modal Add */}
      <Modal
        show={showAddModal}
        title="Add New Mapping"
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNew}
        saveText="Simpan Mapping"
      >
        <MappingForm
          data={formData}
          setData={setFormData}
          applications={applications}
          branches={branches}
          roles={roles}
          users={users}
          isOwner={isOwner}
        />
      </Modal>

      {/* Modal Edit */}
      {editingMapping && (
        <Modal
          show={showEditModal}
          title="Edit Mapping"
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          saveText="Update Mapping"
        >
          <MappingForm
            data={formData}
            setData={setFormData}
            applications={applications}
            branches={branches}
            roles={roles}
            users={users}
            isOwner={isOwner}
          />
        </Modal>
      )}
    </>
  );
};

export default MappingUserRole;