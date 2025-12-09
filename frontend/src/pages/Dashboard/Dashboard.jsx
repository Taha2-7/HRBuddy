import React, { useState, useEffect } from "react";
import Layout from "../../common/Layout";

import DashboardCharts from "./DashboardCharts";

import "./Dashboard.css";
import {
  FaUsers,
  FaBuilding,
  FaUserCheck,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
    presentToday: 0,
  });

  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [departmentData, setDepartmentData] = useState({});
  const [leaveData, setLeaveData] = useState({});

  // Load dummy data
  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalEmployees: 42,
        totalDepartments: 4,
        pendingLeaves: 3,
        presentToday: 37,
      });

      setRecentLeaves([
        {
          id: 1,
          employee: "Arshad Shaikh",
          leaveType: "Sick Leave",
          startDate: "2025-01-02",
          endDate: "2025-01-03",
          status: "Pending",
        },
        {
          id: 2,
          employee: "Taha Ansari",
          leaveType: "Casual Leave",
          startDate: "2025-02-10",
          endDate: "2025-02-12",
          status: "Approved",
        },
        {
          id: 3,
          employee: "Ashraf Khan",
          leaveType: "Work From Home",
          startDate: "2024-12-28",
          endDate: "2024-12-28",
          status: "Rejected",
        },
        {
          id: 4,
          employee: "Inzamam-ul-Haq",
          leaveType: "Annual Leave",
          startDate: "2025-03-05",
          endDate: "2025-03-09",
          status: "Pending",
        },
        {
          id: 5,
          employee: "Akash Kadam",
          leaveType: "Sick Leave",
          startDate: "2025-01-20",
          endDate: "2025-01-22",
          status: "Approved",
        },
        {
          id: 6,
          employee: "Aditya Waghmare",
          leaveType: "Personal Leave",
          startDate: "2025-01-15",
          endDate: "2025-01-15",
          status: "Pending",
        },
        {
          id: 7,
          employee: "Nitin Jaiswal",
          leaveType: "Casual Leave",
          startDate: "2025-02-01",
          endDate: "2025-02-02",
          status: "Approved",
        },
      ]);

      setDepartmentData({
        IT: 25,
        HR: 8,
        Finance: 12,
        Operations: 15,
        Marketing: 10,
        Support: 7,
      });

      setLeaveData({
        "Sick Leave": 14,
        "Casual Leave": 9,
        WFH: 6,
        "Annual Leave": 4,
      });

      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <Layout>
        <h3 className="text-center mt-4">Loading dashboard…</h3>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ overflow: "hidden" }}
      >
        <div class="p-4 col-md-12">
        <div className="mb-4">
          <h2 >Admin Dashboard</h2>
          <p class="text-muted">Overview of your Employee Management System</p>
        </div>
        
        

        {/* ======== STAT CARDS ======== */}
        <div className="row g-3">
          {/* Total Employees */}
          <div className="col-md-3">
            <motion.div whileHover={{ scale: 1.04 }}>
              <div className="card p-4 shadow-sm stats-card">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted">Total Employees</h6>
                    <h2 className="fw-bold">{stats.totalEmployees}</h2>
                  </div>
                  <FaUsers size={35} className="text-primary" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Departments */}
          <div className="col-md-3">
            <motion.div whileHover={{ scale: 1.04 }}>
              <div className="card p-4 shadow-sm stats-card">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted">Departments</h6>
                    <h2 className="fw-bold">{stats.totalDepartments}</h2>
                  </div>
                  <FaBuilding size={35} className="text-success" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Present Today */}
          <div className="col-md-3">
            <motion.div whileHover={{ scale: 1.04 }}>
              <div className="card p-4 shadow-sm stats-card">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted">Present Today</h6>
                    <h2 className="fw-bold">{stats.presentToday}</h2>
                  </div>
                  <FaUserCheck size={35} className="text-info" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pending Leaves */}
          <div className="col-md-3">
            <motion.div whileHover={{ scale: 1.04 }}>
              <div className="card p-4 shadow-sm stats-card">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted">Pending Leaves</h6>
                    <h2 className="fw-bold">{stats.pendingLeaves}</h2>
                  </div>
                  <FaCalendarAlt size={35} className="text-warning" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ======== CHARTS ======== */}
        {/* <DashboardCharts
          departmentData={departmentData}
          leaveData={leaveData}
        /> */}

        {/* RECENT LEAVE REQUESTS */}
        <div className="row mt-4">
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-header fw-bold">Recent Leave Requests</div>

              <div className="card-body">
                {recentLeaves.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover modern-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Leave Type</th>
                          <th>Start</th>
                          <th>End</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentLeaves.map((leave) => (
                          <tr key={leave.id}>
                            <td>{leave.employee}</td>
                            <td>{leave.leaveType}</td>
                            <td>{leave.startDate}</td>
                            <td>{leave.endDate}</td>
                            <td>
                              <span
                                className={
                                  "badge " +
                                  (leave.status === "Approved"
                                    ? "bg-success"
                                    : leave.status === "Pending"
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
                ) : (
                  <p className="text-muted">No recent leave requests</p>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </Layout>
  );
}
