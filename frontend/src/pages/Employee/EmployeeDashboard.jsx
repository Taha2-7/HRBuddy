import React, { useEffect, useState } from "react";
import Layout from "../../common/Layout";
import api from "../../api/axios";

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    presentDaysThisMonth: 0,
    paidLeavesTakenThisMonth: 0,
    absentDaysThisMonth: 0,
    baseSalary: 0,
  });

  const [loading, setLoading] = useState(true);

  // Change Password Modal
  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/employee/dashboard");
      setDashboardData(res.data);
    } catch (err) {
      console.log("EMPLOYEE DASHBOARD ERROR:", err);
      alert("Failed to load employee dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await api.post("/employee/change-password", passwordData);

      alert("Password changed successfully!");
      setShowModal(false);

      setPasswordData({
        oldPassword: "",
        newPassword: "",
      });
    } catch (err) {
      console.log("CHANGE PASSWORD ERROR:", err);
      alert(err?.response?.data || "Failed to change password");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2>Employee Dashboard</h2>
            <p className="text-muted">
              View your attendance, leaves, and salary details
            </p>
          </div>

          <button
            className="btn btn-dark"
            onClick={() => setShowModal(true)}
          >
            Change Password
          </button>
        </div>

        {loading ? (
          <p className="text-center mt-4">Loading dashboard...</p>
        ) : (
          <div className="row mt-4 g-4">
            {/* Present Days */}
            <div className="col-md-3">
              <div className="card shadow-sm p-3">
                <h5 className="fw-bold">Present Days</h5>
                <p className="text-muted mb-1">This Month</p>
                <h3 className="text-success">
                  {dashboardData.presentDaysThisMonth}
                </h3>
              </div>
            </div>

            {/* Paid Leaves */}
            <div className="col-md-3">
              <div className="card shadow-sm p-3">
                <h5 className="fw-bold">Paid Leaves Taken</h5>
                <p className="text-muted mb-1">This Month</p>
                <h3 className="text-primary">
                  {dashboardData.paidLeavesTakenThisMonth}
                </h3>
              </div>
            </div>

            {/* Absent Days */}
            <div className="col-md-3">
              <div className="card shadow-sm p-3">
                <h5 className="fw-bold">Absent Days</h5>
                <p className="text-muted mb-1">This Month</p>
                <h3 className="text-danger">
                  {dashboardData.absentDaysThisMonth}
                </h3>
              </div>
            </div>

            {/* Base Salary */}
            <div className="col-md-3">
              <div className="card shadow-sm p-3">
                <h5 className="fw-bold">Base Salary</h5>
                <p className="text-muted mb-1">Monthly</p>
                <h3 className="text-dark">₹ {dashboardData.baseSalary}</h3>
              </div>
            </div>
          </div>
        )}

        {/* CHANGE PASSWORD MODAL */}
        {showModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Change Password</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleChangePassword}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Old Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            oldPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Background */}
        {showModal && <div className="modal-backdrop fade show"></div>}
      </div>
    </Layout>
  );
};

export default EmployeeDashboard;
