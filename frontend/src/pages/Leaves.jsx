
import React, { useState, useMemo } from "react";
import Layout from "../common/Layout"; 
import LeaveFilter from "./LeaveFilter";

const sampleLeaves = [
  { id: 1, employee: "emp4", type: "Maternity Leave", start: "2026-01-08", end: "2026-03-20", reason: "1", status: "approved", appliedOn: "2025-11-23" },
  { id: 2, employee: "emp4", type: "Sick Leave", start: "2025-12-01", end: "2025-12-10", reason: "plz", status: "rejected", appliedOn: "2025-11-22" },
  { id: 3, employee: "emp4", type: "Sick Leave", start: "2025-11-23", end: "2025-11-29", reason: "mkk", status: "approved", appliedOn: "2025-11-22" },
  { id: 4, employee: "emp4", type: "Sick Leave", start: "2025-11-23", end: "2025-11-28", reason: "why not", status: "rejected", appliedOn: "2025-11-22" },
];


function daysBetween(startISO, endISO) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export default function Leaves() {
  const [status, setStatus] = useState("all");
  const [rows] = useState(sampleLeaves);

  const filtered = useMemo(() => {
    if (status === "all") return rows;
    return rows.filter(r => r.status === status);
  }, [status, rows]);

  function statusBadge(s) {
    const cls =
      s === "approved" ? "badge bg-success" :
      s === "rejected" ? "badge bg-danger" :
      "badge bg-secondary";
    const label = s.toUpperCase();
    return <span className={cls} style={{ fontSize: 12, padding: "6px 8px" }}>{label}</span>;
  }

  return (
    <Layout>
      <div className="mb-3">
        <h2 className="fw-bold mb-1">Leave Management</h2>
        <small className="text-muted">Manage employee leave requests</small>
      </div>

      <LeaveFilter status={status} setStatus={setStatus} />

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No leave requests for this filter.
                  </td>
                </tr>
              )}

              {filtered.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 0 ? "table-light" : ""}>
                  <td>{r.employee}</td>
                  <td>{r.type}</td>
                  <td>{formatDate(r.start)}</td>
                  <td>{formatDate(r.end)}</td>
                  <td>{daysBetween(r.start, r.end)} days</td>
                  <td>{r.reason}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td className="text-muted small">{formatDate(r.appliedOn)}</td>
                  <td className="text-muted">No actions available</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
