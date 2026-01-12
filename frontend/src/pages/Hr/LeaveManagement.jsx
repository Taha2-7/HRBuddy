import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";
import { toast } from "react-toastify";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    filterLeaves();
  }, [statusFilter, leaves]);

  // ===============================
  // FETCH ALL EMPLOYEE LEAVES
  // ===============================
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await api.get("/hr/leaves");
      setLeaves(res.data || []);
      setFilteredLeaves(res.data || []);
    } catch (err) {
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FILTER LOGIC
  // ===============================
  const filterLeaves = () => {
    if (statusFilter === "ALL") {
      setFilteredLeaves(leaves);
    } else {
      const filtered = leaves.filter(
        (leave) => leave.status === statusFilter
      );
      setFilteredLeaves(filtered);
    }
  };

  // ===============================
  // APPROVE / REJECT LEAVE
  // ===============================
  const updateLeaveStatus = async (id, status) => {
    try {
      await api.put(`/hr/leaves/${id}`, { status });
      toast.success(`Leave ${status}`);
      fetchLeaves();
    } catch (err) {
      toast.error("Failed to update leave status");
    }
  };

  // ===============================
  // LOADING UI
  // ===============================
  if (loading) {
    return (
      <Layout>
        <p className="text-center mt-4">Loading leave requests...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4">
        {/* HEADER + FILTER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2>Leave Management</h2>
            <p className="text-muted mb-0">
              Approve or reject employee leave requests
            </p>
          </div>

          <select
            className="form-select"
            style={{ width: "200px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* LEAVE TABLE */}
        <div className="card shadow-sm mt-4">
          <div className="card-header fw-bold">Leave Requests</div>

          <div className="card-body">
            {filteredLeaves.length === 0 ? (
              <p className="text-muted">No leave requests found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>Employee</th>
                      <th>Reason</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th style={{ width: "220px" }}>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLeaves.map((leave) => (
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
                                ? "bg-warning text-dark"
                                : "bg-danger")
                            }
                          >
                            {leave.status}
                          </span>
                        </td>

                        <td>
                          {leave.status === "PENDING" ? (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() =>
                                  updateLeaveStatus(leave.id, "APPROVED")
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  updateLeaveStatus(leave.id, "REJECTED")
                                }
                              >
                                Reject
                              </button>
                            </div>
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
      </div>
    </Layout>
  );
};

export default LeaveManagement;
