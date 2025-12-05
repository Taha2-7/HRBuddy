import React from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const onLogout = () => {
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
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
