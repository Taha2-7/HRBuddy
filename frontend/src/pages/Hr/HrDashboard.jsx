import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";
import {
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaUserCheck
} from "react-icons/fa";
import "./HrDashboard.css";

const HrDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    presentToday: 0,
    pendingLeaves: 0
  });

  const [recentLeaves, setRecentLeaves] = useState([]);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===============================
  // LOAD DASHBOARD
  // ===============================
  useEffect(() => {
    loadDashboard();
    checkAttendanceStatus();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/hr/dashboard");

      setStats({
        totalEmployees: res.data.totalEmployees,
        totalDepartments: res.data.totalDepartments,
        presentToday: res.data.presentToday,
        pendingLeaves: res.data.pendingLeaves
      });

      setRecentLeaves(res.data.recentLeaves || []);
    } catch (err) {
      console.error("Failed to load HR dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CHECK ATTENDANCE STATUS
  // ===============================
  const checkAttendanceStatus = async () => {
    try {
      const res = await api.get("/hr/attendance/status");
      setAttendanceMarked(res.data === true);
    } catch {
      setAttendanceMarked(false);
    }
  };

  // ===============================
  // MARK ATTENDANCE
  // ===============================
  const markAttendance = async () => {
    try {
      await api.post("/hr/attendance/mark");
      setAttendanceMarked(true);
    } catch (err) {
      console.error("Attendance error", err);
    }
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <Layout>
        <p className="text-center mt-4">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 dashboard-container">
        <h2>HR Dashboard</h2>
        <p className="text-muted">Overview of HR activities</p>

        {/* ================= STATS ================= */}
        <div className="row g-3 mt-3">
          <div className="col-md-3">
            <div className="card p-3 stats-card">
              <FaUsers className="mb-2 text-primary" />
              <h6>Total Employees</h6>
              <h4>{stats.totalEmployees}</h4>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 stats-card">
              <FaBuilding className="mb-2 text-success" />
              <h6>Departments</h6>
              <h4>{stats.totalDepartments}</h4>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 stats-card">
              <FaUserCheck className="mb-2 text-info" />
              <h6>Present Today</h6>
              <h4>{stats.presentToday}</h4>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-3 stats-card">
              <FaCalendarAlt className="mb-2 text-warning" />
              <h6>Pending Leaves</h6>
              <h4>{stats.pendingLeaves}</h4>
            </div>
          </div>
        </div>

        {/* ================= QUICK ACTION ================= */}
        <div className="mt-4">
          <button
            className="btn btn-primary"
            onClick={markAttendance}
            disabled={attendanceMarked}
          >
            {attendanceMarked ? "Attendance Marked" : "Mark Attendance"}
          </button>
        </div>

        {/* ================= RECENT LEAVES ================= */}
        <div className="mt-5">
          <h5>Recent Leave Requests</h5>

          {recentLeaves.length === 0 ? (
            <p className="text-muted">No recent leave requests</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover modern-table mt-2">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Reason</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeaves.map((leave) => (
                    <tr key={leave.id}>
                      <td>{leave.employeeName}</td>
                      <td>{leave.reason}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>
                        <span
                          className={
                            "badge " +
                            (leave.status === "APPROVED"
                              ? "bg-success"
                              : leave.status === "PENDING"
                              ? "bg-warning"
                              : "bg-danger")
                          }
                        >
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HrDashboard;
