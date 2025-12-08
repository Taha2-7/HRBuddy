import React from "react";

const PayrollFilter = ({
  month,
  setMonth,
  employeeFilter,
  setEmployeeFilter,
  employees,
  onGeneratePayroll,
  onGenerateForAll
}) => {
  return (
    <div className="card mb-3 shadow-sm border-0">
      <div className="card-body">
        <div className="row gy-3 align-items-end">
          
          <div className="col-md-4">
            <label className="form-label small fw-semibold">Filter by Month</label>
            <input
              type="month"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-semibold">Filter by Employee</label>
            <select
              className="form-select"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <option value="all">All Employees</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 d-flex justify-content-md-end gap-2">
            <button className="btn btn-primary" onClick={onGeneratePayroll}>
              Generate Payroll
            </button>

            <button className="btn btn-success" onClick={onGenerateForAll}>
              Generate for All
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PayrollFilter;
