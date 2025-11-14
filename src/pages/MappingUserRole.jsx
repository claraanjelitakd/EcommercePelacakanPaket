import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, Button, Table } from "react-bootstrap";
import PageHeader from "../reusable/PageHeader";
import StatusToggle from "../reusable/StatusToggle";
import CustomModal from "../reusable/CustomModal";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import api from "../api/api";

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
    applicationId: "",
    branchId: "",
    roleId: "",
    userId: "",
    status: true,
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
      setApplications(appRes.data);
      setBranches(branchRes.data);
      setRoles(roleRes.data);
      setUsers(userRes.data);
      setMappings(mappingRes.data);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    }
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
      await fetchAll(); // refresh data
      setShowAddModal(false);
    } catch (err) {
      console.error("❌ Gagal menambah mapping:", err);
    }
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
      const updated = {
        ...editingMapping,
        ...formData,
      };

      await api.put(`/mappings/${editingMapping.id}`, updated);

      setMappings((prev) =>
        prev.map((m) => (m.id === editingMapping.id ? updated : m))
      );

      setShowEditModal(false);
      setEditingMapping(null);

      await fetchAll();
    } catch (err) {
      console.error("❌ Error updating mapping:", err);
      alert("Failed to update mapping!");
    }
  };


  const handleToggleStatus = async (mappingId, currentStatus) => {
    try {
      await api.patch(`/mappings/${mappingId}`, { status: !currentStatus });
      setMappings(prev =>
        prev.map(m =>
          m.id === mappingId ? { ...m, status: !m.status } : m
        )
      );
    } catch (err) {
      console.error("❌ Gagal update status mapping:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this mapping?")) return;
    try {
      await api.delete(`/mappings/${id}`);
      await fetchAll(); // refresh data
    } catch (err) {
      console.error("❌ Error deleting mapping:", err);
    }
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

  const filteredMappings = mappings.filter(
    m => m.roleId === selectedRole?.id).map(
      m => ({
        ...m,
        user: users.find(u => u.id === m.userId),
      }))
    .filter(m =>
      m.user?.fullName?.toLowerCase().includes(searchUser.toLowerCase())
    );


  return (
    <Container fluid className="p-4 bg-light" style={{ minHeight: "100vh" }}>
      <PageHeader title="Mapping User Role" onAddNew={handleAddNew} />

      <Row>
        {/* Applications */}
        <Col>
          <Form.Control
            type="text"
            placeholder="Search Application"
            className="mb-2"
            value={searchApp}
            onChange={e => setSearchApp(e.target.value)}
          />
          <Table bordered hover>
            <thead className="bg-primary text-white">
              <tr><th>Application</th></tr>
            </thead>
            <tbody>
              {filteredApps.map(app => (
                <tr
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    setSelectedBranch(null);
                    setSelectedRole(null);
                  }}
                  style={{
                    backgroundColor: selectedApp?.id === app.id ? "#cfe2ff" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <td>{app.app_name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Branches */}
        <Col>
          <Form.Control
            type="text"
            placeholder="Search Branch"
            className="mb-2"
            value={searchBranch}
            onChange={e => setSearchBranch(e.target.value)}
            disabled={!selectedApp}
          />
          <Table bordered hover>
            <thead className="bg-primary text-white">
              <tr><th>Branch</th></tr>
            </thead>
            <tbody>
              {filteredBranches.map(branch => (
                <tr
                  key={branch.id}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setSelectedRole(null);
                  }}
                  style={{
                    backgroundColor: selectedBranch?.id === branch.id ? "#cfe2ff" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <td>{branch.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Roles */}
        <Col>
          <Form.Control
            type="text"
            placeholder="Search Role"
            className="mb-2"
            value={searchRole}
            onChange={e => setSearchRole(e.target.value)}
            disabled={!selectedBranch}
          />
          <Table bordered hover>
            <thead className="bg-primary text-white">
              <tr><th>Role</th></tr>
            </thead>
            <tbody>
              {filteredRoles.map(role => (
                <tr
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  style={{
                    backgroundColor: selectedRole?.id === role.id ? "#cfe2ff" : "transparent",
                    cursor: "pointer",
                  }}
                >
                  <td>{role.name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>

        {/* Users */}
        <Col>
          <Form.Control
            type="text"
            placeholder="Search User"
            className="mb-2"
            value={searchUser}
            onChange={e => setSearchUser(e.target.value)}
            disabled={!selectedRole}
          />
          <Table bordered hover>
            <thead className="bg-primary text-white">
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map(m => (
                <tr key={m.id}>
                  <td>{m.user?.fullName}</td>
                  <td>
                    <StatusToggle
                      isActive={m.status}
                      onChange={() => handleToggleStatus(m.id, m.status)}
                    />
                  </td>
                  <td>
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => handleEdit(m)}
                    >
                      <PencilFill />
                    </Button>
                    <Button
                      variant="link"
                      className="p-0 text-danger"
                      onClick={() => handleDelete(m.id)}
                    >
                      <TrashFill />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal Add */}
      <CustomModal
        show={showAddModal}
        title="Add Mapping"
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
      </CustomModal>

      {/* Modal Edit */}
      <CustomModal
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
      </CustomModal>

    </Container>
  );
};


const MappingForm = ({ data, setData, applications, branches, roles, users }) => (
  <Form>
    <Form.Group className="mb-3">
      <Form.Label>Application</Form.Label>
      <Form.Select
        value={data.applicationId}
        onChange={e => setData({ ...data, applicationId: e.target.value, branchId: "", roleId: "" })}
      >
        <option value="">-- Select Application --</option>
        {applications.map(app => (
          <option key={app.id} value={app.id}>{app.app_name}</option>
        ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Branch</Form.Label>
      <Form.Select
        value={data.branchId}
        onChange={e => setData({ ...data, branchId: e.target.value, roleId: "" })}
        disabled={!data.applicationId}
      >
        <option value="">-- Select Branch --</option>
        {branches
          .filter(b => b.applicationId === parseInt(data.applicationId))
          .map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Role</Form.Label>
      <Form.Select
        value={data.roleId}
        onChange={e => setData({ ...data, roleId: e.target.value })}
        disabled={!data.branchId}
      >
        <option value="">-- Select Role --</option>
        {roles
          .filter(r => r.branchId === parseInt(data.branchId))
          .map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
      </Form.Select>
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>User</Form.Label>
      <Form.Select
        value={data.userId}
        onChange={e => setData({ ...data, userId: e.target.value })}
        disabled={!data.roleId}
      >
        <option value="">-- Select User --</option>
        {users.filter(u => u.status)
        .map(u => (
          <option key={u.id} value={u.id}>{u.fullName}</option>
        ))}
      </Form.Select>
    </Form.Group>
  </Form>
);

export default MappingUserRole;
