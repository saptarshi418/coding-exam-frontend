import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("accounts/forgot-password/", { email });
      setSuccess("OTP sent to your email.");
      setError("");
      setTimeout(() => {
        navigate("/verify-reset-otp", { state: { email } });
      }, 1000);
    } catch (err) {
      setError("Failed to send OTP. Try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E] text-[#E0E0E0] p-4">
      <form
        onSubmit={handleSendOtp}
        className="bg-[#1F4068] p-8 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Forgot Password</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded text-black border border-gray-600"
        />

        <button
          type="submit"
          className="w-full p-2 mb-4 bg-[#FF6B6B] text-white rounded hover:bg-red-600"
        >
          Send OTP
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center">{success}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
