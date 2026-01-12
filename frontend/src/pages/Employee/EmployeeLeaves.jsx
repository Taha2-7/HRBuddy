import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";

const EmployeeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [applying, setApplying] = useState(false);

  // Filter State
  const [statusFilter, setStatusFilter] = useState("ALL");

  const today = new Date().toISOString().split("T")[0];

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employee/leaves");
      setLeaves(res.data || []);
    } catch (err) {
      console.log("LOAD LEAVES ERROR:", err);
      alert("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const applyLeave = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      alert("Please enter start date, end date and reason");
      return;
    }

    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    try {
      setApplying(true);

      const res = await api.post("/employee/leave", {
        startDate: startDate,
        endDate: endDate,
        reason: reason,
      });

      alert(res.data || "Leave request submitted successfully!");

      setStartDate("");
      setEndDate("");
      setReason("");

      loadLeaves();
    } catch (err) {
      console.log("APPLY LEAVE ERROR:", err);
      alert(err.response?.data || "Failed to apply leave");
    } finally {
      setApplying(false);
    }
  };

  // Filter leaves based on status
  const filteredLeaves =
    statusFilter === "ALL"
      ? leaves
      : leaves.filter((leave) => leave.status === statusFilter);

  return (
    <Layout>
      <div className="p-4">
        <h2>My Leave Requests</h2>
        <p className="text-muted">Apply for leave and track status</p>

        {/* APPLY LEAVE FORM */}
        <div className="card shadow-sm mt-4">
          <div className="card-header fw-bold">Apply for Leave</div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  min={today}
                  onChange={(e) => {
                    setStartDate(e.target.value);

                    if (endDate && e.target.value > endDate) {
                      setEndDate("");
                    }
                  }}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Reason</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-primary mt-3"
              onClick={applyLeave}
              disabled={applying}
            >
              {applying ? "Submitting..." : "Submit Leave Request"}
            </button>
          </div>
        </div>

        {/* LEAVES TABLE */}
        <div className="card shadow-sm mt-4">
          <div className="card-header fw-bold d-flex justify-content-between align-items-center">
            <span>Leave History</span>

            {/* FILTER DROPDOWN */}
            <select
              className="form-select w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="card-body">
            {loading ? (
              <p className="text-center mt-3">Loading leaves...</p>
            ) : filteredLeaves.length === 0 ? (
              <p className="text-muted">
                No {statusFilter === "ALL" ? "" : statusFilter.toLowerCase()}{" "}
                leave requests found
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLeaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.id}</td>
                        <td>{leave.startDate}</td>
                        <td>{leave.endDate}</td>
                        <td>{leave.reason}</td>
                        <td>
                          <span
                            className={
                              "badge " +
                              (leave.status === "APPROVED"
                                ? "bg-success"
                                : leave.status === "REJECTED"
                                ? "bg-danger"
                                : "bg-warning text-dark")
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
      </div>
    </Layout>
  );
};

export default EmployeeLeaves;
