import React, { useState, useEffect, useMemo } from "react";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
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

const MappingForm = ({ data, setData, applications, branches, roles, users }) => {
  const filteredBranches = useMemo(() => {
    if (!data.applicationId) return [];
    return branches.filter(b => b.applicationId === parseInt(data.applicationId));
  }, [data.applicationId, branches]);

  const filteredRoles = useMemo(() => {
    if (!data.branchId) return [];
    return roles.filter(r => r.branchId === parseInt(data.branchId));
  }, [data.branchId, roles]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.status);
  }, [users]);

  return (
    <form className="space-y-4">
      {/* Application */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Application</label>
        <select
          value={data.applicationId}
          onChange={e => setData({ ...data, applicationId: e.target.value, branchId: "", roleId: "" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
          onChange={e => setData({ ...data, branchId: e.target.value, roleId: "" })}
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
          disabled={!data.branchId}
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
          disabled={!data.roleId}
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


const MappingUserRole = () => {
  const [applications, setApplications] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [mappings, setMappings] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchApp, setSearchApp] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchUser, setSearchUser] = useState("");
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
        api.get("/applications"), api.get("/branches"),
        api.get("/roles"), api.get("/users"), api.get("/mappings"),
      ]);
      setApplications(appRes.data);
      setBranches(branchRes.data);
      setRoles(roleRes.data);
      setUsers(userRes.data);
      setMappings(mappingRes.data);
    } catch (err) { console.error("❌ Error fetching data:", err); }
  };

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
    if (!applicationId || !branchId || !roleId || !userId) {
      alert("Semua field wajib diisi!");
      return;
    }
    try {
      await api.post("/mappings", formData);
      await fetchAll();
      setShowAddModal(false);
    } catch (err) { console.error("❌ Gagal menambah mapping:", err); }
  };

  const handleEdit = (mapping) => {
    setEditingMapping(mapping);
    setFormData({
      applicationId: mapping.applicationId,
      branchId: mapping.branchId,
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
    } catch (err) { console.error("❌ Error updating mapping:", err); }
  };

  const handleToggleStatus = async (mappingId, currentStatus) => {
    try {
      await api.patch(`/mappings/${mappingId}`, { status: !currentStatus });
      await fetchAll();
    } catch (err) { console.error("❌ Gagal update status mapping:", err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this mapping?")) return;
    try {
      await api.delete(`/mappings/${id}`);
      await fetchAll();
    } catch (err) { console.error("❌ Error deleting mapping:", err); }
  };

  const filteredApps = applications.filter(a =>
    a.app_name.toLowerCase().includes(searchApp.toLowerCase())
  );
  const filteredBranches = branches.filter(
    b => b.applicationId === selectedApp?.id &&
      b.name.toLowerCase().includes(searchBranch.toLowerCase())
  );
  const filteredRoles = roles.filter(
    r => r.branchId === selectedBranch?.id &&
      r.name.toLowerCase().includes(searchRole.toLowerCase())
  );
  const filteredMappings = mappings
    .filter(m => m.roleId === selectedRole?.id)
    .map(m => ({ ...m, user: users.find(u => u.id === m.userId) }))
    .filter(m => m.user && m.user.fullName?.toLowerCase().includes(searchUser.toLowerCase()));


  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mapping User Role</h1>
        <Button
          variant="primary"
          onClick={handleAddNew}
          disabled={!selectedRole}
          title={!selectedRole ? "Pilih App, Branch, & Role dulu" : "Tambah mapping baru"}
        >
          <Plus size={18} />
          Add New Mapping
        </Button>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">

        {/* Table Applications */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col">
          <h6 className="text-lg font-semibold p-4 border-b">Applications</h6>
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-purple-300">
              <Search className="text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Application"
                className="w-full bg-transparent outline-none text-sm"
                value={searchApp}
                onChange={e => setSearchApp(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[400px]">
            {filteredApps.map(app => (
              <button
                key={app.id}
                type="button"
                onClick={() => {
                  setSelectedApp(app);
                  setSelectedBranch(null);
                  setSelectedRole(null);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedApp?.id === app.id
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "hover:bg-gray-50"
                  }`}
              >
                {app.app_name}
              </button>
            ))}
          </div>
        </div>

        {/* Table Branches */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col">
          <h6 className="text-lg font-semibold p-4 border-b">Branches</h6>
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-purple-300">
              <Search className="text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Branch"
                className="w-full bg-transparent outline-none text-sm"
                value={searchBranch}
                onChange={e => setSearchBranch(e.target.value)}
                disabled={!selectedApp}
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[400px]">
            {filteredBranches.map(branch => (
              <button
                key={branch.id}
                type="button"
                onClick={() => {
                  setSelectedBranch(branch);
                  setSelectedRole(null);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedBranch?.id === branch.id
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "hover:bg-gray-50"
                  }`}
              >
                {branch.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table Roles */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col">
          <h6 className="text-lg font-semibold p-4 border-b">Roles</h6>
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-purple-300">
              <Search className="text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Role"
                className="w-full bg-transparent outline-none text-sm"
                value={searchRole}
                onChange={e => setSearchRole(e.target.value)}
                disabled={!selectedBranch}
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[400px]">
            {filteredRoles.map(role => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${selectedRole?.id === role.id
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : "hover:bg-gray-50"
                  }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>

        {/* Table Users */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col">
          <h6 className="text-lg font-semibold p-4 border-b">Mapped Users</h6>
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-lg border focus-within:ring-2 focus-within:ring-purple-300">
              <Search className="text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search User"
                className="w-full bg-transparent outline-none text-sm"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                disabled={!selectedRole}
              />
            </div>
          </div>
          <div className="overflow-x-auto overflow-y-auto h-[400px]">
            <table className="w-full table-auto text-left">
              <thead className="bg-purple-600 text-white text-sm sticky top-0">
                <tr>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredMappings.map(m => (
                  <tr key={m.id} className="border-b hover:bg-purple-50">
                    <td className="px-4 py-2 font-medium">{m.user?.fullName}</td>
                    <td className="px-4 py-2">
                      <StatusToggle
                        isActive={m.status}
                        onChange={() => handleToggleStatus(m.id, m.status)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" isIconOnly={true}
                          onClick={() => handleEdit(m)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit3 size={18} />
                        </Button>
                        <Button
                          variant="ghost" isIconOnly={true}
                          onClick={() => handleDelete(m.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!selectedRole && (
              <p className="p-4 text-gray-500 text-sm">Pilih Role...</p>
            )}
            {selectedRole && filteredMappings.length === 0 && (
              <p className="p-4 text-gray-500 text-sm">Tidak ada user ter-mapping.</p>
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
      >
        <MappingForm
          data={formData}
          setData={setFormData}
          applications={applications}
          branches={branches}
          roles={roles}
          users={users}
        />
      </Modal>

      {/* Modal Edit */}
      {editingMapping && (
        <Modal
          show={showEditModal}
          title="Edit Mapping"
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        >
          <MappingForm
            data={formData}
            setData={setFormData}
            applications={applications}
            branches={branches}
            roles={roles}
            users={users}
          />
        </Modal>
      )}
    </>
  );
};

export default MappingUserRole;