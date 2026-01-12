import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // ROLE_ADMIN | ROLE_HR

  const onLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/login");
  };

  // 👇 MAP ROLE TO DISPLAY NAME
  const getDisplayRole = () => {
    if (role === "ROLE_ADMIN") return "Admin";
    if (role === "ROLE_HR") return "HR";
    if (role === "ROLE_EMPLOYEE") return "EMPLOYEE";
    return "User";
  };

  return (
    <div className="navbar">
      <div className="left">
        <h3>HRBuddy</h3>
      </div>
      <div className="right">
        <p>Welcome, {getDisplayRole()}</p>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
