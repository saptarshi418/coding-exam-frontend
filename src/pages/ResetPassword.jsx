import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const otp = location.state?.otp;

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      await axios.post("accounts/reset-password/", {
        email,
        otp,
        new_password: password,
        confirm_password: confirmPassword,
      });
      setSuccess("Password reset successful.");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError("Failed to reset password. Try again.");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E] text-[#E0E0E0] p-4">
      <form
        onSubmit={handleReset}
        className="bg-[#1F4068] p-8 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded text-black border border-gray-600"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 rounded text-black border border-gray-600"
        />

        <button
          type="submit"
          className="w-full p-2 mb-4 bg-[#6BFF6B] text-black rounded hover:bg-green-500"
        >
          Reset Password
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center">{success}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
