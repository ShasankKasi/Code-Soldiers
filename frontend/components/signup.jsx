/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Homebar from "./Homebar";
import axiosHelper from "../src/utils/axiosHelper";
import SpinnerMini from "../ui/SpinnerMini"; // ✅ import your mini spinner
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ new state for spinner

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ show spinner on submit

    if (showOtpStep) {
      // Step 2: Verify OTP
      try {
        const response = await axiosHelper.post("/api/auth/verifySignupOtp", {
          email,
          name,
          password,
          number: otp,
        });

        if (response.data.status === "success") {
          toast.success("Signup successful! Please log in.");
          navigate("/login");
        } else {
          toast.error("Invalid or expired OTP.");
        }
      } catch (err) {
        toast.error("Error verifying OTP. Try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 1: Send OTP
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosHelper.post("/api/auth/sendSignupOtp", {
        email,
      });

      if (response.data.status === "otpsent") {
        toast.success("OTP sent to your email!");
        setShowOtpStep(true);
      } else if (response.data.status === "exist") {
        toast.error("User already exists");
      } else {
        toast.error("Error sending OTP");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // ✅ stop spinner
    }
  };

  return (
    <div>
      <Homebar />
      <div className="main">
        <div className="sub-main">
          <img src="/logo.png" alt="Logo" className="profile-icon" />
          <h1>{showOtpStep ? "Verify Email" : "Sign Up"}</h1>

          <form onSubmit={handleSubmit}>
            {!showOtpStep ? (
              <>
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
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="input-field"
                />
              </>
            )}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <SpinnerMini /> : showOtpStep ? "Verify OTP" : "Sign Up"}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          {!showOtpStep && (
            <Link to="/login" className="link">
              Already have an account? Log in here
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
