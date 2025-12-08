import React from "react";

export default function LeaveFilter({ status, setStatus }) {
  return (
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-body">
        <div className="row gx-3 gy-2 align-items-center">
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Filter by Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All Requests</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
