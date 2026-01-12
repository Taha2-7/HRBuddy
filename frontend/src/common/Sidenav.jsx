import React from "react";
import { Link } from "react-router-dom";
import { ImParagraphLeft } from "react-icons/im";
import { IoPeople } from "react-icons/io5";
import { FaBuildingUser, FaFilePdf } from "react-icons/fa6";
import { IoMdClock } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdOutlineDescription } from "react-icons/md";

import "./sidenav.css";

const Sidenav = () => {
  const role = localStorage.getItem("role"); // ROLE_ADMIN | ROLE_HR | ROLE_EMPLOYEE

  return (
    <div className="sidenav">
      {/* DASHBOARD (ALL ROLES) */}
      <div>
        <Link to="/dashboard">
          <ImParagraphLeft /> Dashboard
        </Link>
      </div>

      {/* ADMIN ONLY */}
      {role === "ROLE_ADMIN" && (
        <>
          <div>
            <Link to="/admin/hrs">
              <IoPeople /> HR Management
            </Link>
          </div>

          <div>
            <Link to="/admin/departments">
              <FaBuildingUser /> Department Management
            </Link>
          </div>
        </>
      )}

      {/* HR ONLY */}
      {role === "ROLE_HR" && (
        <>
          <div>
            <Link to="/hr/employees">
              <IoPeople /> Employees
            </Link>
          </div>

          <div>
            <Link to="/hr/attendance">
              <IoMdClock /> Attendance
            </Link>
          </div>

          <div>
            <Link to="/hr/leaves">
              <FaCalendarAlt /> Leaves
            </Link>
          </div>

          <div>
            <Link to="/hr/payroll">
              <RiMoneyRupeeCircleFill /> Payroll
            </Link>
          </div>

          <div>
            <Link to="/hr/resume-analyzer">
              <FaFilePdf /> Resume Analyzer
            </Link>
          </div>

          <div>
            <Link to="/hr/cover-letter">
              <MdOutlineDescription /> Cover Letter Generator
            </Link>
          </div>
        </>
      )}

      {/* EMPLOYEE ONLY */}
      {role === "ROLE_EMPLOYEE" && (
        <>
          <div>
            <Link to="/employee/attendance">
              <IoMdClock /> Attendance
            </Link>
          </div>

          <div>
            <Link to="/employee/leaves">
              <FaCalendarAlt /> Leaves
            </Link>
          </div>

          <div>
            <Link to="/employee/payroll">
              <RiMoneyRupeeCircleFill /> Payroll
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidenav;
