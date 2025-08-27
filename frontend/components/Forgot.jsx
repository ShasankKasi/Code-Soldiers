import React, { useState } from "react";
import "./Forgot.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Homebar from "./Homebar";
import { useQueryClient } from "@tanstack/react-query";
import api from "../src/utils/axiosHelper";

export default function Forgot() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // "email" | "otp"
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/api/auth/forgot", { email });

      if (response.data.status === "otpsent") {
        toast.success("OTP sent successfully!");
        setStep("otp"); // ✅ show OTP form below
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
        toast.success("Verification done ✅");

        // cache user
        queryClient.setQueryData(["user"], {
          email: response.data.email,
          name: response.data.name,
        });
        queryClient.setQueryData(["isAuthenticated"], { auth: true });

        navigate("/home", {
          state: { email: response.data.email, name: response.data.name },
        });
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
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error("Failed to resend OTP");
    }
  }

return (
  <div>
    <Homebar />
    <div className="containeer">
      <p className="p">Forgot Password</p>

      {/* Email step - always show, but disable after OTP is sent */}
      <form className="form" onSubmit={handleEmailSubmit}>
        <input
          type="email"
          value={email}
          aria-label="Email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={step === "otp"} // Disable input when on OTP step
        />
        <button 
          type="submit" 
          disabled={loading || step === "otp"} // Disable button when on OTP step
        >
          {loading && step === "email" ? "Sending..." : "Send OTP"}
        </button>
      </form>

      {/* OTP step - only show when step is "otp" */}
      {step === "otp" && (
        <form className="form" onSubmit={handleOtpSubmit}>
          <input
            type="text"
            value={otp}
            maxLength={4}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button type="button" onClick={handleResendOtp} disabled={loading}>
            Resend OTP
          </button>
        </form>
      )}
    </div>
  </div>
);}
