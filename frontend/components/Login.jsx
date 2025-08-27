import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Homebar from "./Homebar";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";
import api from "../src/utils/axiosHelper"; // <-- use helper

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // console.log("Submitting login with:", { email, password });
      const response = await api.post("/api/auth/login", { email, password });
      // console.log("Login response:", response.data);
      if (response.data.status === "success" || response.data.status === "admin") {
        const { token, email, name } = response.data;

        // Save JWT
        localStorage.setItem("token", token);

        // Save user info in React Query
        queryClient.setQueryData(["user"], { email, name });
        queryClient.setQueryData(["isAuthenticated"], { auth: true });

        toast.success("Login successful!");

        // Redirect
        navigate(response.data.status === "admin" ? "/admin" : "/home");
      } else if (response.data.status === "doesnotexist") {
        toast.error("User does not exist. Please sign up.");
      } else if (response.data.status === "incorrect password") {
        toast.error("Incorrect password. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login failed");
      } else if (error.request) {
        toast.error("Network error occurred. Please try again.");
      } else {
        toast.error("Unknown error occurred. Please try again later.");
      }
    }
  }

  return (
    <div>
      <Homebar />
      <div className="main">
        <div className="sub-main">
          <div className="imgs">
            <div className="container-image">
              <img
                src="/logo.png"
                className="profile-icon"
                alt="Logo of Code Soldiers"
              />
            </div>
          </div>
          <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <FaUser className="email-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  className="name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-container password-container">
                <FaLock className="password-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="name password-input-login"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-login"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="login-button">
                <button type="submit">Login</button>
              </div>
            </form>
            <div className="link">
              <button
                className="link-button"
                onClick={() => navigate("/forgot")}
              >
                Forgot password?
              </button>
              <button
                className="link-button"
                onClick={() => navigate("/signup")}
              >
                Sign Up?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}