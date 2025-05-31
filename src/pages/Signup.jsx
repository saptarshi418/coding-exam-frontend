import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    education: "",
    profession: "",
    email: "",
    password: "",
    confirm_password: "",
    user_type: "student",
    otp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const navigate = useNavigate();

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("accounts/register/", formData);
    setSuccess("Registration successful. Redirecting...");
    setError("");

    // redirect to verify-otp page with email passed in location state
    navigate("/verify-otp", { state: { email: formData.email } });

  } catch (err) {
    setError("Registration failed. Check your inputs.");
    setSuccess("");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 text-[#E0E0E0] p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-400">Signup</h2>

        {[
          "name",
          "age",
          "education",
          "profession",
          "email",
          "password",
          "confirm_password",
        ].map((field) => (
          <input
            key={field}
            type={field.includes("password") ? "password" : field === "age" ? "number" : "text"}
            name={field}
            placeholder={field.replace("_", " ")}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full p-2 mb-3 rounded text-gray-500 border border-gray-600 outline-none"
          />
        ))}

        <select
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          className="w-full p-2 mb-3 rounded text-gray-500 border border-gray-600"
        >
          <option value="student">Student</option>
          <option value="organization">Organization</option>
        </select>

    

        {!otpSent ? (
          <button
            type="button"
            onClick={handleRegister}
            className="w-full p-2 mb-4 bg-[#FF6B6B] text-white rounded hover:bg-red-600"
          >
            Get OTP
          </button>
        ) : (
          <button
            type="submit"
            className="w-full p-2 mb-4 bg-[#6BFF6B] text-black rounded hover:bg-green-500"
          >
            Verify & Register
          </button>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
      </form>
    </div>
  );
};

export default Signup;
