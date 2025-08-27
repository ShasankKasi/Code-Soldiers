import React, { useState } from "react";
import "./ResetPassword.css";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Homebar from "./Homebar";
import api from "../src/utils/axiosHelper";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state
  const email = location.state?.email;
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if no email is provided
  React.useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Please start the password reset process again.");
      navigate("/forgot");
    }
  }, [email, navigate]);

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

  async function handleResetSubmit(e) {
    e.preventDefault();

    // Validate password
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

    setLoading(true);
    try {
      const response = await api.post("/api/auth/reset-password", { 
        email, 
        password 
      });

      if (response.data?.status === "success") {
  toast.success("Password reset successfully! Please login with your new password.");
  navigate("/login");
} else if (response.data?.status === "doesnotexist") {
  toast.error("No account found with this email.");
} else if (response.data?.status === "emptyerror") {
  toast.error("Email and password are required.");
} else if (response.data?.status === "passerror") {
  toast.error("Password must be at least 8 characters long.");
} else {
  toast.error("Failed to reset password. Please try again.");
}

    } catch (error) {
  const status = error.response?.data?.status;

  if (status === "doesnotexist") {
    toast.error("No account found with this email.");
  } else if (status === "emptyerror") {
    toast.error("Email and password are required.");
  } else if (status === "passerror") {
    toast.error("Password must be at least 8 characters long.");
  } else {
    toast.error(error.response?.data?.message || "An error occurred. Please try again.");
  }
} finally {
  setLoading(false);
}
  }

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <Homebar />
      <div className="reset-container">
        <p className="reset-title">Reset Password</p>
        <p className="reset-subtitle">Enter your new password for {email}</p>

        <form className="reset-form" onSubmit={handleResetSubmit}>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

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
          </div>

          <button type="submit" disabled={loading} className="reset-button">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="back-to-login">
          <button 
            type="button" 
            onClick={() => navigate("/login")}
            className="back-button"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}