import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { Container, Form } from 'react-bootstrap';
import PageHeader from '../reusable/PageHeader';
import StatusToggle from '../reusable/StatusToggle';
import ActionButtons from '../reusable/ActionButtons';
import CustomModal from '../reusable/CustomModal';
import api from "../api/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({ userName: "", fullName: "", email: "", status: true });
  const [editUser, setEditUser] = useState(null);

  // 🚀 Fetch users dari database saat komponen dimuat
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

  // 🔍 Filter pencarian
  const filteredUsers = users.filter(user =>
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ➕ Tambah User
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

  // ✏️ Edit User
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

  // 🔁 Toggle Status
  const handleToggleStatus = async (user) => {
    try {
      await api.put(`/users/${user.id}`, { ...user, status: !user.status });
      await fetchUsers();
    } catch (error) {
      console.error("❌ Error toggling status:", error);
    }
  };

  // 🗑️ Hapus User
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

  // 🔐 Reset Password
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

  // 📋 Kolom Tabel
  const columns = [
    { name: 'UserName', selector: row => row.userName, sortable: true },
    { name: 'FullName', selector: row => row.fullName, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    {
      name: 'Status',
      cell: row => (
        <StatusToggle
          isActive={row.status}
          onChange={() => handleToggleStatus(row)}
        />
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex align-items-center">
          <a
            href="#"
            onClick={() => handleResetClick(row)}
            className="text-primary me-2 text-decoration-none"
          >
            Reset
          </a>
          <ActionButtons
            onEdit={() => handleEdit(row)}
            onDelete={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  // 🎨 Custom Styles
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#3b50ce',
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Poppins, sans-serif',
      },
    },
  };

  return (
    <Container
      fluid
      className="p-4 vh-100 d-flex flex-column bg-light"
      style={{ fontFamily: 'Poppins, sans-serif', minWidth: '980px' }}
    >
      <PageHeader title="Users" onAddNew={handleAddNew} />

      <Form.Control
        type="text"
        placeholder="Search user..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-3 w-25 shadow-sm"
      />

      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
      />

      {/* Modal Add */}
      <CustomModal
        show={showAdd}
        title="Add New User"
        onClose={() => setShowAdd(false)}
        onSave={handleSaveAdd}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>UserName</Form.Label>
            <Form.Control
              type="text"
              value={newUser.userName}
              onChange={e => setNewUser({ ...newUser, userName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={newUser.fullName}
              onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={newUser.password}
              onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            />
          </Form.Group>
        </Form>
      </CustomModal>

      {/* Modal Edit */}
      <CustomModal
        show={showEdit}
        title="Edit User"
        onClose={() => setShowEdit(false)}
        onSave={handleSaveEdit}
      >
        {editUser && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>UserName</Form.Label>
              <Form.Control
                type="text"
                value={editUser.userName}
                onChange={e => setEditUser({ ...editUser, userName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={editUser.fullName}
                onChange={e => setEditUser({ ...editUser, fullName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editUser.email}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <StatusToggle
                isActive={editUser.status}
                onChange={() =>
                  setEditUser({ ...editUser, status: !editUser.status })
                }
              />
            </Form.Group>
          </Form>
        )}
      </CustomModal>

      {/* Modal Reset Password */}
      <CustomModal
        show={showReset}
        title="Reset Password"
        onClose={() => setShowReset(false)}
        onSave={handleConfirmReset}
      >
        {selectedUser && (
          <div>
            <p>
              Apakah Anda yakin ingin mereset password untuk user{' '}
              <strong>{selectedUser.fullName}</strong> (
              {selectedUser.userName})?
            </p>
            <p className="text-danger small">
              Password akan diubah menjadi 12345678.
            </p>
          </div>
        )}
      </CustomModal>
    </Container>
  );
};

export default Users;
