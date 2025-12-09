import React, { useState, useEffect } from "react";
import Layout from "../common/Layout";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const dummyDepartments = [
    {
      id: 1,
      name: "IT",
      description: "Handles software, hardware, and system maintenance.",
      is_active: true,
      created_at: "2024-11-10",
    },
    {
      id: 2,
      name: "HR",
      description: "Employee hiring, onboarding, and attendance.",
      is_active: true,
      created_at: "2023-05-15",
    },
    {
      id: 3,
      name: "Finance",
      description: "Manages accounts, payroll, and expenses.",
      is_active: true,
      created_at: "2022-08-20",
    },
    {
      id: 4,
      name: "Marketing",
      description: "Branding and social media strategy.",
      is_active: false,
      created_at: "2021-12-01",
    },
  ];

  // Load dummy data
  useEffect(() => {
    setDepartments(dummyDepartments);
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingDepartment) {
        // Update existing
        setDepartments((prev) =>
          prev.map((dept) =>
            dept.id === editingDepartment.id
              ? { ...editingDepartment, ...formData }
              : dept
          )
        );
      } else {
        // Add new
        setDepartments((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: formData.name,
            description: formData.description,
            is_active: true,
            created_at: new Date().toISOString().split("T")[0],
          },
        ]);
      }

      handleCloseModal();
    } catch (err) {
      setError("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    }
  };

  // Open edit modal
  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    setFormData({ name: "", description: "" });
    setError("");
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Departments</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add Department
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td>{department.name}</td>
                <td>{department.description || "No description"}</td>
                <td>
                  <span
                    className={`badge ${
                      department.is_active ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {department.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{new Date(department.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => handleEdit(department)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(department.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={handleCloseModal}
      >
        <div
          className="modal-dialog"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingDepartment ? "Edit Department" : "Add Department"}
              </h5>
              <button className="btn-close" onClick={handleCloseModal}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label className="form-label">Department Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter department name"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter department description"
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
