import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post("accounts/verify-reset-otp/", { email, otp });
      setSuccess("OTP verified successfully.");
      setError("");
      setTimeout(() => {
        navigate("/reset-password", { state: { email ,otp } });
      }, 1000);
    } catch (err) {
      setError("Invalid OTP. Try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E] text-[#E0E0E0] p-4">
      <form
        onSubmit={handleVerify}
        className="bg-[#1F4068] p-8 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Verify OTP</h2>

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded text-black border border-gray-600"
        />

        <button
          type="submit"
          className="w-full p-2 mb-4 bg-[#6B8AFF] text-white rounded hover:bg-blue-600"
        >
          Verify OTP
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center">{success}</p>}
      </form>
    </div>
  );
};

export default VerifyResetOtp;
