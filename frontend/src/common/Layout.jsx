import React, { children } from "react";
import Navbar from "./Navbar";
import Sidenav from "./Sidenav";

const Layout = ({ children }) => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="d-flex">
        <div style={{ width: "15vw" }}>
          <Sidenav />
        </div>
        <div className="w-100">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
