import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const onLogout = (e) => {
    e.preventDefault();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <div className="navbar">
        <div className="left">
          <h3>HRBuddy</h3>
        </div>
        <div className="right">
          <p>Welcome,Admin User</p>
          <button onClick={(e) => onLogout(e)}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
