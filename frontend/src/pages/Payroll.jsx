import React, { useState, useMemo } from "react";
import Layout from "../common/Layout";
import PayrollFilter from "./PayrollFilter";

const sampleEmployees = [
  {
    id: 1,
    name: "Taha Alam",
    payPeriod: "12/2025",
    baseSalary: 80000,
    earnings: 0,
    deductions: 0,
    generatedOn: "11/22/2025",
  },
  {
    id: 2,
    name: "Khan Ashraf",
    payPeriod: "12/2025",
    baseSalary: 22,
    earnings: 0,
    deductions: 0,
    generatedOn: "11/22/2025",
  },
  {
    id: 3,
    name: "Ganesh Gaithonde",
    payPeriod: "12/2025",
    baseSalary: 50000,
    earnings: 0,
    deductions: 0,
    generatedOn: "11/22/2025",
  },
  {
    id: 4,
    name: "Sameer Rajput",
    payPeriod: "12/2025",
    baseSalary: 60000,
    earnings: 0,
    deductions: 0,
    generatedOn: "11/22/2025",
  },
  {
    id: 5,
    name: "Abhay Rana",
    payPeriod: "12/2025",
    baseSalary: 500,
    earnings: 0,
    deductions: 0,
    generatedOn: "11/22/2025",
  },
  {
    id: 6,
    name: "Arshad Khalifa",
    payPeriod: "12/2025",
    baseSalary: 90000,
    earnings: 0,
    deductions: 0,
    generatedOn: "11/22/2025",
  },
];

function formatCurrency(n) {
  return `₹${n.toFixed(2)}`;
}

const Payroll = () => {
  const [month, setMonth] = useState("2025-12");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [rows] = useState(sampleEmployees);

  const filtered = useMemo(() => {
    const [y, m] = (month || "").split("-");
    const monthLabel =
      y && m ? `${String(parseInt(m, 10)).padStart(2, "0")}/${y}` : "";

    return rows.filter((r) => {
      const byMonth = !monthLabel || r.payPeriod === monthLabel;
      const byEmp = employeeFilter === "all" || r.id === Number(employeeFilter);
      return byMonth && byEmp;
    });
  }, [month, employeeFilter, rows]);

  const handleGeneratePayroll = () => {
    alert(
      `Generate payroll for ${
        employeeFilter === "all"
          ? "all employees"
          : `employee ${employeeFilter}`
      } for ${month}`
    );
  };

  const handleGenerateForAll = () => {
    alert(`Generate payroll for ALL employees for ${month}`);
  };

  return (
    <Layout>
      {/* Title */}
      <div className="mb-3">
        <h2 className="fw-bold mb-1">Payroll Management</h2>
        <small className="text-muted">
          Generate and manage employee payroll
        </small>
      </div>

      {/* Filters Component */}
      <PayrollFilter
        month={month}
        setMonth={setMonth}
        employeeFilter={employeeFilter}
        setEmployeeFilter={setEmployeeFilter}
        employees={rows}
        onGeneratePayroll={handleGeneratePayroll}
        onGenerateForAll={handleGenerateForAll}
      />

      {/* Table */}
      <div className="card shadow-sm border-0 mt-3">
        <div className="table-responsive">
          <table className="table mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Employee</th>
                <th>Pay Period</th>
                <th>Base Salary</th>
                <th>Earnings</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Generated On</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No payrolls found for these filters.
                  </td>
                </tr>
              )}

              {filtered.map((r, idx) => (
                <tr key={r.id} className={idx % 2 === 0 ? "table-light" : ""}>
                  <td>{r.name}</td>
                  <td>{r.payPeriod}</td>
                  <td>{formatCurrency(r.baseSalary)}</td>
                  <td>{formatCurrency(r.earnings)}</td>
                  <td>{formatCurrency(r.deductions)}</td>
                  <td className="fw-bold">
                    {formatCurrency(r.baseSalary + r.earnings - r.deductions)}
                  </td>
                  <td className="text-muted small">{r.generatedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Payroll;
