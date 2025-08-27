import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Homebar from "./Homebar";
import axiosHelper from "../src/utils/axiosHelper"; // ✅ import your helper
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // console.log("Submitting signup with:", { name, email, password });
      const response = await axiosHelper.post("/api/auth/signup", {
        name,
        email,
        password,
      });
    console.log("Signup response:", response.data);
      switch (response.data.status) {
        case "exist":
          toast.error("User already exists");
          break;
        case "success":
          navigate("/", { state: { id: email } });
          break;
        case "passerror":
          toast.error("Password should be at least 8 characters");
          break;
        case "emptyerror":
          toast.error("Please fill in all fields");
          break;
        default:
          toast.error("Unexpected error occurred. Try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error("Error in details entered. Please check the details again");
    }
  };

  return (
    <div>
      <Homebar />
      <div className="main">
        <div className="sub-main">
          <img src="/logo.png" alt="Logo" className="profile-icon" />
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="input-field"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="input-field"
            />
            <div className="password-input-group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                minLength={8}
                required
                className="input-field password-input"
              />
              <button
                type="button"
                className="toggle-password-signup"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <Link to="/login" className="link">
            Already have an account? Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;