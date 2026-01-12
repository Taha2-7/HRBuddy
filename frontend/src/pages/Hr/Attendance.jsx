import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";
import { toast } from "react-toastify";

const Attendance = () => {
  // ===============================
  // STATE
  // ===============================
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [departments, setDepartments] = useState([]);
  const [departmentId, setDepartmentId] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // INITIAL LOAD
  // ===============================
  useEffect(() => {
    loadDepartments();
    loadAttendance(today, "");
  }, []);

  // ===============================
  // LOAD DEPARTMENTS (HR)
  // ===============================
  const loadDepartments = async () => {
    try {
      const res = await api.get("/hr/departments");
      setDepartments(res.data);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  // ===============================
  // LOAD ATTENDANCE
  // ===============================
  const loadAttendance = async (selectedDate, deptId) => {
    try {
      setLoading(true);

      const params = { date: selectedDate };
      if (deptId) params.departmentId = deptId;

      const res = await api.get("/hr/attendance", { params });
      setAttendance(res.data);
    } catch {
      toast.error("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // HANDLERS
  // ===============================
  const onDateChange = (e) => {
    const value = e.target.value;
    setDate(value);
    loadAttendance(value, departmentId);
  };

  const onDepartmentChange = (e) => {
    const value = e.target.value;
    setDepartmentId(value);
    loadAttendance(date, value);
  };

  // ===============================
  // UI
  // ===============================
  return (
    <Layout>
      <div className="p-4">
        <h3>Attendance</h3>
        <p className="text-muted">Attendance for selected date</p>

        {/* ===== FILTERS ===== */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={onDateChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Department</label>
            <select
              className="form-control"
              value={departmentId}
              onChange={onDepartmentChange}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        {loading ? (
          <p>Loading attendance...</p>
        ) : attendance.length === 0 ? (
          <p>No attendance records found</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td>{a.employeeName}</td>
                  <td>{a.departmentName}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (a.status === "PRESENT"
                          ? "bg-success"
                          : a.status === "WEEKEND_PRESENT"
                          ? "bg-info"
                          : "bg-secondary")
                      }
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
