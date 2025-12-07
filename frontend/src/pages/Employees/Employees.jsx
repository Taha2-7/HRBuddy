import React, { useState, useEffect } from "react";
import Layout from "../../common/Layout";
import "./Employees.css";
import { FaPlus, FaEdit, FaTrash, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    address: "",
    status: "Active",
  });

  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortType, setSortType] = useState("");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  // Load dummy employees
  useEffect(() => {
    setEmployees([
      {
        id: 1,
        employeeId: "EMP001",
        name: "Arshad Shaikh",
        email: "arshad.s@hrbuddy.in",
        phone: "9876543210",
        department: "IT",
        designation: "Software Engineer",
        salary: 52000,
        joiningDate: "2023-07-15",
        address: "Mumbai, MH",
        status: "Active",
      },
      {
        id: 2,
        employeeId: "EMP002",
        name: "Taha Ansari",
        email: "taha.ansari@hrbuddy.in",
        phone: "9876501234",
        department: "HR",
        designation: "HR Executive",
        salary: 41000,
        joiningDate: "2022-11-03",
        address: "Pune, MH",
        status: "Active",
      },
      {
        id: 3,
        employeeId: "EMP003",
        name: "Ashraf Khan",
        email: "ashraf.khan@hrbuddy.in",
        phone: "9988776655",
        department: "Finance",
        designation: "Accountant",
        salary: 46000,
        joiningDate: "2024-01-22",
        address: "Thane, MH",
        status: "Active",
      },
      {
        id: 4,
        employeeId: "EMP004",
        name: "Inzamam-ul-Haq",
        email: "inzamam.haq@hrbuddy.in",
        phone: "9876524680",
        department: "Operations",
        designation: "Operations Associate",
        salary: 38000,
        joiningDate: "2023-03-18",
        address: "Nagpur, MH",
        status: "Inactive",
      },
      {
        id: 5,
        employeeId: "EMP005",
        name: "Akash Kadam",
        email: "akash.kadam@hrbuddy.in",
        phone: "9823456789",
        department: "IT",
        designation: "Frontend Developer",
        salary: 54000,
        joiningDate: "2022-09-10",
        address: "Mumbai, MH",
        status: "Inactive",
      },
      {
        id: 6,
        employeeId: "EMP006",
        name: "Aditya Waghmare",
        email: "aditya.w@hrbuddy.in",
        phone: "9898989898",
        department: "Marketing",
        designation: "Marketing Analyst",
        salary: 43000,
        joiningDate: "2023-12-05",
        address: "Pune, MH",
        status: "Inactive",
      },
      {
        id: 7,
        employeeId: "EMP007",
        name: "Nitin Jaiswal",
        email: "nitin.j@hrbuddy.in",
        phone: "9765432189",
        department: "Support",
        designation: "Support Engineer",
        salary: 35000,
        joiningDate: "2024-05-01",
        address: "Aurangabad, MH",
        status: "Active",
      },
    ]);
  }, []);

  // Form change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add employee modal
  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      salary: "",
      joiningDate: "",
      address: "",
      status: "Active",
    });
    setShowModal(true);
  };

  // Edit modal
  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setFormData(employee);
    setShowModal(true);
  };

  // Delete employee
  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    showSuccess("Employee deleted successfully!");
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");

    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee ? { ...formData } : emp
        )
      );
      showSuccess("Employee updated successfully!");
    } else {
      setEmployees([...employees, { ...formData, id: Date.now() }]);
      showSuccess("Employee added successfully!");
    }

    setShowModal(false);
  };

  // Search + filter + sort
  let filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (departmentFilter !== "All") {
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.department === departmentFilter
    );
  }

  if (statusFilter !== "All") {
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.status === statusFilter
    );
  }

  if (sortType === "name-asc") {
    filteredEmployees = filteredEmployees.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }
  if (sortType === "name-desc") {
    filteredEmployees = filteredEmployees.sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }
  if (sortType === "salary-asc") {
    filteredEmployees = filteredEmployees.sort((a, b) => a.salary - b.salary);
  }
  if (sortType === "salary-desc") {
    filteredEmployees = filteredEmployees.sort((a, b) => b.salary - a.salary);
  }

  const getAvatar = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Employees</h2>

          <button
            onClick={handleAdd}
            className="btn btn-primary d-flex align-items-center gap-2"
          >
            <FaPlus /> Add Employee
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* SEARCH */}
        <div className="input-group mb-3" style={{ width: "260px" }}>
          <input
            className="form-control"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTERS + SORT */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <select
            className="form-select"
            style={{ width: "200px" }}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="Support">Support</option>
          </select>

          <select
            className="form-select"
            style={{ width: "180px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            className="form-select"
            style={{ width: "200px" }}
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="name-asc">Name A → Z</option>
            <option value="name-desc">Name Z → A</option>
            <option value="salary-asc">Salary Low → High</option>
            <option value="salary-desc">Salary High → Low</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered modern-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="avatar-circle">{getAvatar(emp.name)}</div>
                  </td>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.email}</td>
                  <td>₹{emp.salary}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (emp.status === "Active" ? "bg-success" : "bg-secondary")
                      }
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setShowProfileModal(true);
                      }}
                    >
                      <FaUserTie />
                    </button>

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(emp)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setEmployeeToDelete(emp);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD / EDIT MODAL */}
        {showModal && (
          <>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <form onSubmit={handleSave}>
                    <div className="modal-header">
                      <h5 className="modal-title">
                        {editingEmployee ? "Edit Employee" : "Add Employee"}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">Employee ID</label>
                        <input
                          name="employeeId"
                          value={formData.employeeId}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Department</label>
                        <input
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Salary</label>
                        <input
                          name="salary"
                          type="number"
                          value={formData.salary}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="form-select"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" />
          </>
        )}

        {/* PROFILE MODAL */}
        {showProfileModal && selectedEmployee && (
          <>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Employee Profile</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowProfileModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="text-center mb-3">
                      <div className="avatar-large">
                        {getAvatar(selectedEmployee.name)}
                      </div>
                      <h4 className="fw-bold mt-2">
                        {selectedEmployee.name}
                      </h4>
                    </div>

                    <p>
                      <strong>Email:</strong> {selectedEmployee.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedEmployee.phone}
                    </p>
                    <p>
                      <strong>Department:</strong>{" "}
                      {selectedEmployee.department}
                    </p>
                    <p>
                      <strong>Designation:</strong>{" "}
                      {selectedEmployee.designation}
                    </p>
                    <p>
                      <strong>Salary:</strong> ₹{selectedEmployee.salary}
                    </p>
                    <p>
                      <strong>Joining Date:</strong>{" "}
                      {selectedEmployee.joiningDate}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedEmployee.address}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedEmployee.status}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" />
          </>
        )}

        {/* DELETE CONFIRM MODAL */}
        {showDeleteModal && employeeToDelete && (
          <>
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Delete</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowDeleteModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    Are you sure you want to delete{" "}
                    <strong>{employeeToDelete.name}</strong>?
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger"
                      type="button"
                      onClick={() => {
                        handleDelete(employeeToDelete.id);
                        setShowDeleteModal(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" />
          </>
        )}
      </motion.div>
    </Layout>
  );
}
