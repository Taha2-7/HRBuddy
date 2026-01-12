import React, { useState, useEffect } from "react";
import Layout from "../../common/Layout";
import "./AdminDashboard.css";

import {
  FaUsers,
  FaBuilding,
  FaUserCheck,
  FaCalendarAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

import api from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    pendingLeaves: 0,
    presentToday: 0,
  }); 

  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // FETCH ADMIN DASHBOARD DATA
  // ================================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        const data = res.data;

        setStats({
          totalEmployees: data.totalHrCount,      // HR count
          totalDepartments: data.totalDepartments,
          pendingLeaves: data.pendingHrLeaves,
          presentToday: data.hrPresentToday,
        });

        setRecentLeaves(data.recentHrLeaves || []);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ================================
  // LOADING STATE
  // ================================
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
        <div className="p-4 col-md-12">
          <div className="mb-4">
            <h2>Admin Dashboard</h2>
            <p className="text-muted">
              Overview of your HR Management System
            </p>
          </div>

          {/* ================= STAT CARDS ================= */}
          <div className="row g-3">
            {/* Total HRs */}
            <div className="col-md-3">
              <motion.div whileHover={{ scale: 1.04 }}>
                <div className="card p-4 shadow-sm stats-card">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Total HRs</h6>
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

            {/* HR Present Today */}
            <div className="col-md-3">
              <motion.div whileHover={{ scale: 1.04 }}>
                <div className="card p-4 shadow-sm stats-card">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">HRs Present Today</h6>
                      <h2 className="fw-bold">{stats.presentToday}</h2>
                    </div>
                    <FaUserCheck size={35} className="text-info" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Pending HR Leaves */}
            <div className="col-md-3">
              <motion.div whileHover={{ scale: 1.04 }}>
                <div className="card p-4 shadow-sm stats-card">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Pending HR Leaves</h6>
                      <h2 className="fw-bold">{stats.pendingLeaves}</h2>
                    </div>
                    <FaCalendarAlt size={35} className="text-warning" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ================= RECENT LEAVES ================= */}
          <div className="row mt-4">
            <div className="col">
              <div className="card shadow-sm">
                <div className="card-header fw-bold">
                  Recent HR Leave Requests
                </div>

                <div className="card-body">
                  {recentLeaves.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover modern-table">
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
                  ) : (
                    <p className="text-muted">
                      No recent HR leave requests
                    </p>
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
