import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🚫 Redirect if no email passed from Signup
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    try {
      const response = await axios.post("accounts/verify-otp/", {
        email,
        otp,
      });
      setSuccess("OTP verified! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 p-4">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 mb-3 rounded border border-gray-300"
        />
        <button
          onClick={handleVerify}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Verify
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
      </div>
    </div>
  );
};

export default VerifyOtp;
