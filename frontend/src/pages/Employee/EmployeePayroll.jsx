import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";

const EmployeePayroll = () => {
  const [latestPayroll, setLatestPayroll] = useState(null);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const loadPayrollData = async () => {
    try {
      setLoading(true);

      const [latestRes, historyRes] = await Promise.allSettled([
        api.get("/employee/payroll"),
        api.get("/employee/payrolls"),
      ]);

      // Latest payroll handling
      if (latestRes.status === "fulfilled") {
        if (latestRes.value.status === 204) {
          setLatestPayroll(null);
        } else {
          setLatestPayroll(latestRes.value.data);
        }
      } else {
        console.log("LATEST PAYROLL ERROR:", latestRes.reason);
        setLatestPayroll(null);
      }

      // Payroll history handling
      if (historyRes.status === "fulfilled") {
        setPayrollHistory(historyRes.value.data || []);
      } else {
        console.log("PAYROLL HISTORY ERROR:", historyRes.reason);
        setPayrollHistory([]);
      }
    } catch (err) {
      console.log("LOAD PAYROLL ERROR:", err);
      alert("Failed to load payroll details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrollData();
  }, []);

  return (
    <Layout>
      <div className="container-fluid p-3">
        <h3 className="fw-bold mb-0">My Payroll</h3>
        <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
          View your latest payroll details and payroll history
        </p>

        {loading ? (
          <p className="text-center mt-4">Loading payroll...</p>
        ) : (
          <>
            {/* =======================
                LATEST PAYROLL SECTION
            ======================= */}
            <div className="card shadow-sm mb-3">
              <div className="card-header fw-bold py-2">Latest Payroll</div>

              <div className="card-body py-3">
                {!latestPayroll ? (
                  <p className="text-muted mb-0">
                    Payroll not generated yet. Please contact HR.
                  </p>
                ) : (
                  <div className="row g-2">
                    <div className="col-md-3 col-sm-6">
                      <div className="border rounded p-2 bg-light">
                        <small className="text-muted">Payroll Date</small>
                        <div className="fw-bold">
                          {formatDate(latestPayroll.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                      <div className="border rounded p-2 bg-light">
                        <small className="text-muted">Base Salary</small>
                        <div className="fw-bold text-primary">
                          ₹ {latestPayroll.baseSalary}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                      <div className="border rounded p-2 bg-light">
                        <small className="text-muted">Allowances</small>
                        <div className="fw-bold">
                          ₹ {latestPayroll.allowances}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                      <div className="border rounded p-2 bg-light">
                        <small className="text-muted">Deductions</small>
                        <div className="fw-bold text-danger">
                          ₹ {latestPayroll.deductions}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                      <div className="border rounded p-2 bg-light">
                        <small className="text-muted">Present Days</small>
                        <div className="fw-bold">{latestPayroll.presentDays}</div>
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                      <div className="border rounded p-2 bg-light">
                        <small className="text-muted">Leave Days</small>
                        <div className="fw-bold">{latestPayroll.leaveDays}</div>
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                      <div className="border rounded p-2 bg-light">
                        <small className="text-muted">Absent Days</small>
                        <div className="fw-bold">{latestPayroll.absentDays}</div>
                      </div>
                    </div>

                    <div className="col-md-3 col-sm-6">
                      <div className="border rounded p-2 bg-light">
                        <small className="text-muted">Net Salary</small>
                        <div className="fw-bold text-success">
                          ₹ {latestPayroll.netSalary}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* =======================
                PAYROLL HISTORY SECTION
            ======================= */}
            <div className="card shadow-sm">
              <div className="card-header fw-bold py-2">Payroll History</div>

              <div className="card-body py-3">
                {payrollHistory.length === 0 ? (
                  <p className="text-muted mb-0">No payroll history found</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm table-hover table-striped align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Date</th>
                          <th>Base Salary</th>
                          <th>Allowances</th>
                          <th>Deductions</th>
                          <th>Net Salary</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {payrollHistory.map((p, index) => (
                          <tr key={p.id || index}>
                            <td>{formatDate(p.createdAt)}</td>
                            <td>₹ {p.baseSalary}</td>
                            <td>₹ {p.allowances}</td>
                            <td className="text-danger">₹ {p.deductions}</td>
                            <td className="fw-bold text-success">
                              ₹ {p.netSalary}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  p.status === "PAID"
                                    ? "bg-success"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {p.status}
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
          </>
        )}
      </div>
    </Layout>
  );
};

export default EmployeePayroll;
