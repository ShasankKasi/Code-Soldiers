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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // console.log("Submitting signup with:", { name, email, password });
      const response = await axiosHelper.post("/api/auth/signup", {
        name,
        email,
        password,
      });
    // console.log("Signup response:", response.data);
      switch (response.data.status) {
        case "exist":
          toast.error("User already exists");
          break;
        case "success":
          toast.success("Signup successful! Please log in.");
          navigate("/login");
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
            <div className="password-input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                minLength={8}
                required
                className="input-field password-input"
              />
              <button
                type="button"
                className="toggle-password-signup"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={password.length >= 8 ? "valid" : ""}>
                  At least 8 characters
                </li>
                <li className={/(?=.*[a-z])/.test(password) ? "valid" : ""}>
                  One lowercase letter
                </li>
                <li className={/(?=.*[A-Z])/.test(password) ? "valid" : ""}>
                  One uppercase letter
                </li>
                <li className={/(?=.*\d)/.test(password) ? "valid" : ""}>
                  One number
                </li>
              </ul>
              {confirmPassword && (
                <p className={password === confirmPassword ? "password-match valid" : "password-match invalid"}>
                  {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
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