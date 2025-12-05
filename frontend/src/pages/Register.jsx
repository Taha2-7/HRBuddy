import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import logo from "../assets/logo.png";
import stock from "../assets/stock.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const onRegister = (e) => {
    e.preventDefault();
    toast.success("Registration successful");
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="main-container">
        <div className="left">
          <div className="circle"></div>
          <img src={stock} alt="" />
          <h5>Onboarding New Talent with Digital HRMS</h5>
          <p>Everything you need in an easily customizable dashboard</p>
        </div>
        <div className="right">
          <div className="form-container">
            <div className="top">
              <img src={logo} alt="" />
              <h5>Welcome to HRBuddy!</h5>
              <p>Please enter your details</p>
            </div>
            <div className="bottom">
              <form>
                <div>
                  <label htmlFor="">Name</label>
                  <input className="form-control" type="text" />
                </div>
                <div>
                  <label htmlFor="">Email</label>
                  <input className="form-control" type="email" />
                </div>
                <div>
                  <label htmlFor="">Password</label>
                  <input className="form-control" type="password" />
                </div>
                <div>
                  <label htmlFor="">Confirm Password</label>
                  <input className="form-control" type="password" />
                </div>

                <div>
                  <button
                    onClick={(e) => onRegister(e)}
                    style={{ width: "100%" }}
                    className="btn"
                  >
                    Register <FaArrowRight />
                  </button>
                </div>
                <div style={{ textAlign: "center" }}>
                  Already have an account?<Link to={"/"}> Sign in </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
