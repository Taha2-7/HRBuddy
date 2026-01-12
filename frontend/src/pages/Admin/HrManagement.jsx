import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../common/Layout";

export default function HrManagement() {
  const [hrs, setHrs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [baseSalary, setBaseSalary] = useState("");

  // ==========================
  // LOAD HRs
  // ==========================
  useEffect(() => {
    fetchHrs();
  }, []);

  const fetchHrs = async () => {
    try {
      const res = await api.get("/admin/hrs");
      setHrs(res.data);
    } catch (err) {
      console.error("Failed to load HRs", err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // CREATE HR
  // ==========================
  const createHr = async () => {
    if (!name || !email || !username || !password || !baseSalary) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/admin/hr", {
        name,
        email,
        username,
        password,
        baseSalary
      });

      // Close modal & reset form
      setShowModal(false);
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setBaseSalary("");

      fetchHrs();
    } catch (err) {
      console.error("Failed to create HR", err);
      alert(
        err.response?.data?.message ||
          "Failed to create HR (check console)"
      );
    }
  };

  // ==========================
  // DEACTIVATE HR
  // ==========================
  const deactivateHr = async (id) => {
    if (!window.confirm("Deactivate this HR?")) return;

    try {
      await api.put(`/admin/hr/${id}/deactivate`);
      fetchHrs();
    } catch (err) {
      console.error("Failed to deactivate HR", err);
      alert("Failed to deactivate HR");
    }
  };

  // ==========================
  // UI
  // ==========================
  return (
    <Layout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>HR Management</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Create HR
          </button>
        </div>

        {loading ? (
          <p>Loading HRs...</p>
        ) : hrs.length === 0 ? (
          <p className="text-muted">No HRs found</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
            {hrs.map((hr) => (
                <tr key={hr.id}>
                <td>{hr.name}</td>
                <td>{hr.username}</td>
                <td>{hr.departmentName}</td>
                <td>
                    <span
                    className={
                        "badge " + (hr.enabled ? "bg-success" : "bg-danger")
                    }
                    >
                    {hr.enabled ? "Active" : "Inactive"}
                    </span>
                </td>
                <td>
                    {hr.enabled && (
                    <button
                        className="btn btn-sm btn-warning"
                        onClick={() => deactivateHr(hr.id)}
                    >
                        Deactivate
                    </button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>

            </table>
          </div>
        )}
      </div>

      {/* ==========================
          CREATE HR MODAL
         ========================== */}
      {showModal && (
        <div className="modal d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              <h5 className="mb-3">Create HR</h5>

              <div className="row">
                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <input
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Base Salary"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={createHr}
                >
                  Create HR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
