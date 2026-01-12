import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";

const EmployeeAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const [alreadyMarkedToday, setAlreadyMarkedToday] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const res = await api.get("/employee/attendance");
      const attendanceData = res.data || [];

      setAttendance(attendanceData);

      const today = getTodayDate();

      const markedToday = attendanceData.some((a) => a.date === today);

      setAlreadyMarkedToday(markedToday);
    } catch (err) {
      console.log("LOAD EMPLOYEE ATTENDANCE ERROR:", err);
      alert("Failed to load attendance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const markAttendance = async () => {
    try {
      setMarking(true);

      const res = await api.post("/employee/attendance");

      alert(res.data || "Attendance marked successfully!");
      loadAttendance();
    } catch (err) {
      console.log("MARK ATTENDANCE ERROR:", err);
      alert(err.response?.data || "Failed to mark attendance");
    } finally {
      setMarking(false);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2>My Attendance</h2>
            <p className="text-muted">
              View your attendance and mark today's attendance
            </p>
          </div>

          <button
            className={`btn ${
              alreadyMarkedToday ? "btn-success" : "btn-primary"
            }`}
            onClick={markAttendance}
            disabled={marking || alreadyMarkedToday}
          >
            {alreadyMarkedToday
              ? "Attendance Marked"
              : marking
              ? "Marking..."
              : "Mark Attendance"}
          </button>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-header fw-bold">Attendance Records</div>

          <div className="card-body">
            {loading ? (
              <p className="text-center mt-3">Loading attendance...</p>
            ) : attendance.length === 0 ? (
              <p className="text-muted">No attendance records found</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td>{a.date}</td>
                        <td>
                          <span
                            className={`badge ${
                              a.status === "ABSENT"
                                ? "bg-danger"
                                : "bg-success"
                            }`}
                          >
                            {a.status}
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

export default EmployeeAttendance;
