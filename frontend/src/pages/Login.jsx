import React, { useState } from "react";
import "../style/login.css";
import logo from "../assets/logo.png";
import stock from "../assets/stock.png";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();

  // 🔁 CHANGED: email → username
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();

    // 🔁 CHANGED: username validation
    if (!username || !password) {
      toast.error("Username and password required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: username,   // ✅ backend expects this
        password: password,
      });

      const token = response.data.token;

      // 🔐 STORE TOKEN
      localStorage.setItem("token", token);
      localStorage.setItem("role", response.data.role);
      toast.success("Login successful");

      // 🚀 Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
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
              <h5>Welcome back!</h5>
              <p>Please enter your details</p>
            </div>

            <div className="bottom">
              <form onSubmit={onLogin}>
                {/* 🔁 CHANGED FIELD */}
                <div>
                  <label>Username</label>
                  <input
                    className="form-control"
                    type="text"          // 🔁 was email
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label>Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <input type="checkbox" /> Remember me
                  </div>
                  <Link>Forgot Password?</Link>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%" }}
                    className="btn"
                  >
                    {loading ? "Logging in..." : <>Login <FaArrowRight /></>}
                  </button>
                </div>

                <div style={{ textAlign: "center" }}>
                  Don't have an account? <Link to="/register">Sign up</Link>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
