import React from "react";
import { Link } from "react-router-dom";
import { ImParagraphLeft } from "react-icons/im";
import { IoPeople } from "react-icons/io5";
import { FaBuildingUser } from "react-icons/fa6";
import { IoMdClock } from "react-icons/io";
import { FaCalendarAlt } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

import "./sidenav.css";

const Sidenav = () => {
  return (
    <div className="sidenav">
      <div>
        <Link to={"/dashboard"}>
          <ImParagraphLeft /> Dashboard{" "}
        </Link>
      </div>
      <div>
        {" "}
        <Link to={"/employees"}>
          <IoPeople /> Employees
        </Link>
      </div>
      <div>
        <Link to={"/departments"}>
          <FaBuildingUser /> Departments
        </Link>
      </div>
      <div>
        <Link to={"/attendance"}>
          <IoMdClock /> Attendance
        </Link>
      </div>
      <div>
        <Link to={"/leaves"}>
          <FaCalendarAlt /> Leaves
        </Link>
      </div>
      <div>
        <Link to={"/payroll"}>
          <RiMoneyRupeeCircleFill /> Payroll
        </Link>
      </div>
    </div>
  );
};

export default Sidenav;
