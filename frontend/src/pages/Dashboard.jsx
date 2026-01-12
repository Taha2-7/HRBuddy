import React from "react";
import AdminDashboard from "./Admin/AdminDashboard";
import HrDashboard from "./Hr/HrDashboard";
import EmployeeDashboard from "./Employee/EmployeeDashboard";

const Dashboard = () => {
  const role = localStorage.getItem("role");

  if (role === "ROLE_ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "ROLE_HR") {
    return <HrDashboard />;
  }

  if (role === "ROLE_EMPLOYEE") {
    return <EmployeeDashboard />;
  }

  return <h3>Unauthorized</h3>;
};

export default Dashboard;
