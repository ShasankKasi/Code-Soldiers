import React, { useState } from "react";
import "./Forgot.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Homebar from "./Homebar";
import api from "../src/utils/axiosHelper"; // <-- use axiosHelper

export default function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/forgot", { email });

      if (response.data.status === "otpsent") {
        toast.success("OTP sent successfully!");
        navigate("/verify", { state: { email } });
      } else if (response.data.status === "doesnotexist") {
        toast.error("User does not exist");
      } else {
        toast.error("Unknown error");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Homebar />
      <div className="containeer">
        <p className="p">Enter your Email to get OTP</p>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            aria-label="Email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
