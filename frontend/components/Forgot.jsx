import React, { useState } from "react";
import "./Forgot.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Homebar from "./Homebar";
import api from "../src/utils/axiosHelper";

export default function Forgot() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // email | otp
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/forgot", { email });

      if (response.data.status === "otpsent") {
        toast.success("OTP sent successfully!");
        setStep("otp");
      } else if (response.data.status === "doesnotexist") {
        toast.error("User does not exist");
      } else {
        toast.error("Unknown error");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    if (otp.length !== 4 || isNaN(otp)) {
      toast.error("Please enter a valid 4-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/verify", { email, number: otp });

      if (response.data?.status === "success") {
        toast.success("OTP verified successfully! ✅");
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error("OTP is incorrect");
      }
    } catch (error) {
      toast.error(error.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    try {
      await api.post("/api/auth/forgot", { email });
      toast.success("OTP resent successfully!");
    } catch {
      toast.error("Failed to resend OTP");
    }
  }

  return (
    <div>
      <Homebar />
      <div className="forgot-container">
        <div className="card">
          {/* Step indicator */}
          <div className="steps">
            <span className={step === "email" ? "active" : ""}>1. Email</span>
            <span className={step === "otp" ? "active" : ""}>2. Verify OTP</span>
            <span>3. Reset</span>
          </div>

          <h2 className="title">Forgot Password</h2>

          {/* Email step */}
          <form
            className={`form fade-in ${step === "email" ? "" : "disabled-form"}`}
            onSubmit={handleEmailSubmit}
          >
            <input
              type="email"
              value={email}
              aria-label="Email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={step === "otp"}
            />
            <button type="submit" disabled={loading || step === "otp"}>
              {loading && step === "email" ? "Sending..." : "Send OTP"}
            </button>
          </form>

          {/* OTP step */}
          {step === "otp" && (
            <form className="form fade-in" onSubmit={handleOtpSubmit}>
              <input
                type="text"
                value={otp}
                maxLength={4}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
