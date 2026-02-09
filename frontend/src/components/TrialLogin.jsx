import React, { useState } from "react";
import "../style/login.css";
import logo from "../assets/logo.png";
import stock from "../assets/stock.png";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const TrialLogin = () => {
  const [SignupVisible, setSignupVisible] = useState(false);

  const navigate = useNavigate();

  const onLogin = (e) => {
    e.preventDefault();
    toast.success("Login successful");
    navigate("/dashboard");
  };

  const animate = {
    x: "614px",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: "10%",
    borderBottomRightRadius: "10%",
  };

  return (
    <div className="login-container">
      <div className="main-container">
        <motion.div
          animate={animate ? setSignupVisible : ""}
          transition={{ duration: 1 }}
          className="left"
        >
          <div className="circle"></div>
          <img src={stock} alt="" />
          <h5>Onboarding New Talent with Digital HRMS</h5>
          <p>Everything you need in an easily customizable dashboard</p>
        </motion.div>
        <motion.div
          animate={{
            x: "-614px",
            borderTopLeftRadius: "10%",
            borderBottomLeftRadius: "10%",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          transition={{ duration: 1 }}
          className="right"
        >
          <div className="form-container">
            <div className="top">
              <img src={logo} alt="" />
              <h5>Welcome back!</h5>
              <p>Please enter your details</p>
            </div>
            <div className="bottom">
              <form>
                <div>
                  <label htmlFor="">Email</label>
                  <input className="form-control" type="email" />
                </div>
                <div>
                  <label htmlFor="">Password</label>
                  <input className="form-control" type="password" />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <input type="checkbox" /> Remember me
                  </div>
                  <Link>Forgot Password?</Link>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault;
                      setSignupVisible(true);
                    }}
                    style={{ width: "100%" }}
                    className="btn"
                  >
                    Login <FaArrowRight />
                  </button>
                </div>
                <div style={{ textAlign: "center" }}>
                  Don't have an account? <Link to={"/register"}>Sign up</Link>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrialLogin;
