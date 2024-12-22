import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null); // State to store user data
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return; // If no token, do not fetch

      try {
        const response = await axios.get(
          "https://blog-backend-git-master-pracatices-projects.vercel.app/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data); // Save user data
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login"); // Redirect to login if token is invalid
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="dark:bg-black bg-white text-black py-4 dark:text-white">
      <div className="container">
        <div className="flex justify-between items-center flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-center w-full">BLOG</h1>
          </div>
          <div className="flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 dark:border-white border-black"
                  : "border-black text-xl font-semibold"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 dark:border-white border-black"
                  : "border-black text-xl font-semibold"
              }
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 dark:border-white border-black"
                  : "border-black text-xl font-semibold"
              }
            >
              Signup
            </NavLink>
            {user && (
              <>
                <button
                  onClick={handleLogout}
                  className="text-xl font-semibold"
                >
                  Logout
                </button>

                <div className="flex items-center gap-2">
                  {" "}
                  {/* {user.avatar ? (
                    <img
                      src={`https://blog-backend-git-master-pracatices-projects.vercel.app/${user.avatar}`} // Replace with the correct URL for your backend
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  )} */}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive
                        ? "border-b-2 dark:border-white border-black"
                        : "text-xl font-semibold "
                    }
                  >
                    Profile
                  </NavLink>
                </div>
                {/* Show avatar */}
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="bg-blue-500 dark:bg-yellow-500 text-white dark:text-black px-4 py-2 rounded"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
