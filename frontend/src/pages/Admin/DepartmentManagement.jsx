import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../common/Layout";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [departmentName, setDepartmentName] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/admin/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to load departments", err);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async () => {
    if (!departmentName.trim()) {
      alert("Department name is required");
      return;
    }

    try {
      await api.post("/admin/departments", {
        name: departmentName
      });

      setDepartmentName("");
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to create department"
      );
    }
  };

  // ==========================
  // DELETE DEPARTMENT
  // ==========================
  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await api.delete(`/admin/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Cannot delete department"
      );
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Department Management</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Department
          </button>
        </div>

        {loading ? (
          <p>Loading departments...</p>
        ) : departments.length === 0 ? (
          <p className="text-muted">No departments found</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Department Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.id}</td>
                  <td>{dept.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteDepartment(dept.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE DEPARTMENT MODAL */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="mb-3">Create Department</h5>

              <input
                className="form-control mb-3"
                placeholder="Department Name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={createDepartment}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
