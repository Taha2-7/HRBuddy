import React, { useState, useEffect } from "react";
import Layout from "./../common/Layout";

export default function AdminAttendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(false);


  const dummyEmployees = [
    { id: 1, name: "Arshad Shaikh" },
    { id: 2, name: "Taha Ansari" },
    { id: 3, name: "Ashraf Khan" },
    { id: 4, name: "Inzamam-ul-Haq" },
    { id: 5, name: "Akash Kadam" },
    { id: 6, name: "Aditya Waghmare" },
    { id: 7, name: "Nitin Jaiswal" },
  ];

  const dummyAttendance = [
    {
      id: 1,
      employee_id: 1,
      employee_name: "Arshad Shaikh",
      date: "2025-01-10",
      check_in: "09:30 AM",
      check_out: "06:00 PM",
      total_hours: 8.5,
      status: "present",
    },
    {
      id: 2,
      employee_id: 2,
      employee_name: "Taha Ansari",
      date: "2025-01-10",
      check_in: "10:15 AM",
      check_out: "05:45 PM",
      total_hours: 7.5,
      status: "late",
    },
    {
      id: 3,
      employee_id: 3,
      employee_name: "Ashraf Khan",
      date: "2025-01-10",
      check_in: null,
      check_out: null,
      total_hours: 0,
      status: "absent",
    },
    {
      id: 4,
      employee_id: 4,
      employee_name: "Inzamam-ul-Haq",
      date: "2025-01-11",
      check_in: "09:00 AM",
      check_out: "01:00 PM",
      total_hours: 4,
      status: "half_day",
    },
    {
      id: 5,
      employee_id: 5,
      employee_name: "Akash Kadam",
      date: "2025-01-11",
      check_in: "09:15 AM",
      check_out: "06:10 PM",
      total_hours: 8.75,
      status: "present",
    },
  ];
  
  // --------------------------------------------
  const filterAttendance = () => {
    setLoading(true);

    let data = [...dummyAttendance];

    if (selectedDate) {
      data = data.filter(
        (r) => r.date === selectedDate
      );
    }

    if (selectedEmployee) {
      data = data.filter(
        (r) => r.employee_id.toString() === selectedEmployee
      );
    }

    setAttendanceData(data);
    setLoading(false);
  };
  // LOAD DUMMY DATA IN USEEFFECT
  // --------------------------------------------
  useEffect(() => {
    setEmployees(dummyEmployees);
    filterAttendance();
  }, [selectedDate, selectedEmployee]);

  // --------------------------------------------
  // FILTER LOGIC (DATE + EMPLOYEE)
  // --------------------------------------------


  const getStatusBadge = (status) => {
    const styles = {
      present: "bg-success",
      absent: "bg-danger",
      late: "bg-warning text-dark",
      half_day: "bg-info text-dark",
    };

    return (
      <span className={`badge ${styles[status] || "bg-secondary"}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  return (
    <Layout>
      <div className="mb-4">
        <h2>Attendance Management</h2>
        <p className="text-muted">Monitor employee attendance and working hours</p>
      </div>

      {/* FILTER CARD */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="row g-3">

            {/* DATE FILTER */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Select Date</label>
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* EMPLOYEE FILTER */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Filter by Employee</label>
              <select
                className="form-select"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">All Employees</option>

                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}

              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ATTENDANCE TABLE */}
      {loading ? (
        <div>Loading attendance data...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours Worked</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceData.map((r) => (
                <tr key={`${r.id}-${r.date}`}>
                  <td>{r.employee_name}</td>
                  <td>{r.date}</td>
                  <td>{r.check_in || "Not checked in"}</td>
                  <td>{r.check_out || "Not checked out"}</td>
                  <td>{r.total_hours} hours</td>
                  <td>{getStatusBadge(r.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPTY MESSAGE */}
      {attendanceData.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-muted">
            No attendance records found for the selected criteria.
          </p>
        </div>
      )}
    </Layout>
  );
}
