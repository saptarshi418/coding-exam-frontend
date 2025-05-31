import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">
        <Link to="/">Coding Platform</Link>
      </h1>

      <div className="relative">
        {isAuthenticated ? (
          <>
            <FaUserCircle
              size={28}
              className="cursor-pointer"
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
