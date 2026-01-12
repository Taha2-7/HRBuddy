import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [baseSalary, setBaseSalary] = useState("");

  // ================================
  // INITIAL LOAD
  // ================================
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hr/employees");
      setEmployees(res.data || []);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/hr/departments");
      setDepartments(res.data || []);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  // ================================
  // CREATE EMPLOYEE
  // ================================
  const createEmployee = async () => {
    if (
      !name ||
      !email ||
      !username ||
      !password ||
      !departmentId ||
      !baseSalary
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      await api.post("/hr/employee", {
        name,
        email,
        username,
        password,
        departmentId,
        baseSalary,
      });

      toast.success("Employee created successfully");
      setShowModal(false);
      resetForm();
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create employee");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setDepartmentId("");
    setBaseSalary("");
  };

  // ================================
  // DEACTIVATE EMPLOYEE
  // ================================
  const deactivateEmployee = async (id) => {
    if (!window.confirm("Deactivate this employee account?")) return;

    try {
      await api.put(`/hr/employee/${id}/deactivate`);
      toast.success("Employee deactivated");
      fetchEmployees();
    } catch {
      toast.error("Failed to deactivate employee");
    }
  };

  // ================================
  // UI
  // ================================
  return (
    <Layout>
      <div className="p-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2>Employee Management</h2>
            <p className="text-muted mb-0">
              View employees, create new employees, and deactivate accounts
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Add Employee
          </button>
        </div>

        {/* EMPLOYEE TABLE */}
        <div className="card shadow-sm mt-4">
          <div className="card-header fw-bold">Employees</div>

          <div className="card-body">
            {loading ? (
              <p>Loading employees...</p>
            ) : employees.length === 0 ? (
              <p className="text-muted">No employees found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Department</th>
                      <th>Base Salary</th>
                      <th>Status</th>
                      <th style={{ width: "160px" }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.id}</td>
                        <td>{emp.name}</td>
                        <td>{emp.username}</td>
                        <td>{emp.departmentName}</td>
                        <td>₹ {emp.baseSalary}</td>
                        <td>
                          <span
                            className={
                              "badge " +
                              (emp.active ? "bg-success" : "bg-danger")
                            }
                          >
                            {emp.active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>

                        <td>
                          {emp.active ? (
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => deactivateEmployee(emp.id)}
                            >
                              Deactivate
                            </button>
                          ) : (
                            <span className="text-muted">No Action</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ================================
            CREATE EMPLOYEE MODAL
        ================================ */}
        {showModal && (
          <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog modal-lg">
              <div className="modal-content p-4">
                <h5 className="mb-3">Create Employee</h5>

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

                  <div className="col-md-6 mb-2">
                    <select
                      className="form-control"
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
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

                  <button className="btn btn-primary" onClick={createEmployee}>
                    Create Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
