import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("accounts/login/", formData);
      console.log("Backend response:", response.data);

      if (response.data.access) {
        login(response.data.access, response.data.refresh); // Store tokens in context
        navigate("/"); // Redirect to home
      } else {
        setError("Login failed. No access token received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 text-center font-bold text-gray-400">Login</h2>

        {error && <div className="bg-red-200 text-red-700 p-2 rounded mb-4">{error}</div>}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-500"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
        >
          Login
        </button>

        <div className="flex justify-between text-sm">
          <Link
            to="/signup"
            className="text-blue-600 hover:underline"
          >
            Not registered? Register here
          </Link>
          <Link
            to="/forget-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
