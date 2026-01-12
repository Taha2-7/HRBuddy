import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";

const PayrollManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [generatingAll, setGeneratingAll] = useState(false);
  const [generatingEmployeeId, setGeneratingEmployeeId] = useState(null);

  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [payingSalary, setPayingSalary] = useState(false);

  // ================================
  // LOAD EMPLOYEES
  // ================================
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hr/employees");
      setEmployees(res.data || []);
    } catch (err) {
      console.log("LOAD EMPLOYEES ERROR:", err);
      alert("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // ================================
  // GENERATE PAYROLL FOR ONE EMPLOYEE
  // ================================
  const generatePayrollForEmployee = async (username, employeeId) => {
    try {
      setGeneratingEmployeeId(employeeId);

      await api.post(`/hr/payroll/${username}`);

      alert("Payroll generated");
    } catch (err) {
      console.log("GENERATE PAYROLL ERROR:", err);

      // ⚠️ Your backend sends 404 when payroll is already generated
      if (err.response && err.response.status === 404) {
        alert("Payroll already generated");
        return;
      }

      alert(err.response?.data?.message || "Failed to generate payroll");
    } finally {
      setGeneratingEmployeeId(null);
    }
  };

  // ================================
  // GENERATE PAYROLL FOR ALL EMPLOYEES
  // ================================
  const generatePayrollForAll = async () => {
    try {
      setGeneratingAll(true);

      const res = await api.post("/hr/payroll/all");

      alert(res.data || "Payroll generated for all employees");
    } catch (err) {
      console.log("GENERATE ALL PAYROLL ERROR:", err);
      alert(err.response?.data?.message || "Failed to generate payroll for all");
    } finally {
      setGeneratingAll(false);
    }
  };

  // ================================
  // VIEW PAYROLL (OPEN MODAL)
  // ================================
  const viewPayroll = async (username) => {
    try {
      const res = await api.get(`/hr/payroll/${username}`);
      setSelectedPayroll(res.data);
      setShowModal(true);
    } catch (err) {
      console.log("VIEW PAYROLL ERROR:", err);

      if (err.response && err.response.status === 404) {
        alert("Payroll not generated yet. Click Generate Payroll first.");
        return;
      }

      alert("Failed to load payroll.");
    }
  };

  // ================================
  // CLOSE MODAL
  // ================================
  const closeModal = () => {
    setShowModal(false);
    setSelectedPayroll(null);
  };

  // ================================
  // PAY SALARY
  // ================================
  const paySalary = async () => {
    if (!selectedPayroll) return;
  
    if (selectedPayroll.netSalary <= 0) {
        alert("Net Salary is 0. Cannot pay salary.");
        return;
      }

    try {
      setPayingSalary(true);
  
      // Backend returns order details
      const res = await api.post(`/hr/payroll/${selectedPayroll.payrollId}/pay`);
  
      const data = res.data;
  
      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Check index.html script.");
        return;
      }
  
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "HR Buddy Payroll System",
        description: `Salary Payment for ${data.employeeName}`,
        order_id: data.orderId,
  
        handler: async function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
  
          // After success, call backend to mark payroll PAID
          await api.put(`/hr/payroll/${selectedPayroll.payrollId}/markPaid`);
  
          // Refresh payroll details
          const refreshed = await api.get(
            `/hr/payroll/${selectedPayroll.employeeUsername}`
          );
          setSelectedPayroll(refreshed.data);
        },
  
        prefill: {
          name: data.employeeName,
        },
  
        theme: {
          color: "#0d6efd",
        },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.log("PAY SALARY ERROR:", err);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setPayingSalary(false);
    }
  };
  

  // ================================
  // UI
  // ================================
  if (loading) {
    return (
      <Layout>
        <p className="text-center mt-4">Loading payroll...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2>Payroll Management</h2>
            <p className="text-muted">
              Generate payroll and pay salaries for employees
            </p>
          </div>

          <button
            className="btn btn-warning"
            onClick={generatePayrollForAll}
            disabled={generatingAll}
          >
            {generatingAll ? "Generating..." : "Generate Payroll For All"}
          </button>
        </div>

        {/* EMPLOYEE TABLE */}
        <div className="card shadow-sm mt-4">
          <div className="card-header fw-bold">Employees</div>

          <div className="card-body">
            {employees.length === 0 ? (
              <p className="text-muted">No employees found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Department</th>
                      <th>Base Salary</th>
                      <th>Status</th>
                      <th style={{ width: "300px" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td>{emp.id}</td>
                        <td>{emp.name}</td>
                        <td>{emp.username}</td>
                        <td>{emp.departmentName}</td>
                        <td>₹ {emp.baseSalary}</td>
                        <td>
                          <span
                            className={
                              "badge " +
                              (emp.active ? "bg-success" : "bg-danger")
                            }
                          >
                            {emp.active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>

                        <td className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => viewPayroll(emp.username)}
                          >
                            View Payroll
                          </button>

                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              generatePayrollForEmployee(emp.username, emp.id)
                            }
                            disabled={generatingEmployeeId === emp.id}
                          >
                            {generatingEmployeeId === emp.id
                              ? "Generating..."
                              : "Generate Payroll"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ================================
            PAYROLL MODAL POPUP
        ================================= */}
        {showModal && selectedPayroll && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                {/* HEADER */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    Payroll Details - {selectedPayroll.employeeName}
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                {/* BODY */}
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <p className="fw-bold mb-1">Payroll ID</p>
                      <p>{selectedPayroll.payrollId}</p>
                    </div>

                    <div className="col-md-4">
                      <p className="fw-bold mb-1">Employee Username</p>
                      <p>{selectedPayroll.employeeUsername}</p>
                    </div>

                    <div className="col-md-4">
                      <p className="fw-bold mb-1">Month</p>
                      <p>{selectedPayroll.month}</p>
                    </div>

                    <div className="col-md-3">
                      <p className="fw-bold mb-1">Base Salary</p>
                      <p>₹ {selectedPayroll.baseSalary}</p>
                    </div>

                    <div className="col-md-3">
                      <p className="fw-bold mb-1">Allowances</p>
                      <p>₹ {selectedPayroll.allowances}</p>
                    </div>

                    <div className="col-md-3">
                      <p className="fw-bold mb-1">Deductions</p>
                      <p className="text-danger fw-bold">
                        ₹ {selectedPayroll.deductions}
                      </p>
                    </div>

                    <div className="col-md-3">
                      <p className="fw-bold mb-1">Net Salary</p>
                      <p className="fw-bold text-success">
                        ₹ {selectedPayroll.netSalary}
                      </p>
                    </div>

                    <div className="col-md-4">
                      <p className="fw-bold mb-1">Present Days</p>
                      <p>{selectedPayroll.presentDays}</p>
                    </div>

                    <div className="col-md-4">
                      <p className="fw-bold mb-1">Leave Days</p>
                      <p>{selectedPayroll.leaveDays}</p>
                    </div>

                    <div className="col-md-4">
                      <p className="fw-bold mb-1">Absent Days</p>
                      <p>{selectedPayroll.absentDays}</p>
                    </div>

                    <div className="col-md-12">
                      <p className="fw-bold mb-1">Status</p>
                      <span
                        className={
                          "badge " +
                          (selectedPayroll.status === "PAID"
                            ? "bg-success"
                            : "bg-warning text-dark")
                        }
                      >
                        {selectedPayroll.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={paySalary}
                    disabled={selectedPayroll.status === "PAID" || payingSalary}
                  >
                    {selectedPayroll.status === "PAID"
                      ? "Salary Already Paid"
                      : payingSalary
                      ? "Paying..."
                      : "Pay Salary"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PayrollManagement;
