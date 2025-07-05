import React, { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
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

            {!user && (
              <>
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
              </>
            )}

            {user && (
              <>
                <button
                  onClick={handleLogout}
                  className="text-xl font-semibold"
                >
                  Logout
                </button>

                <div className="flex items-center gap-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  )}
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      isActive
                        ? "border-b-2 dark:border-white border-black"
                        : "text-xl font-semibold"
                    }
                  >
                    Profile
                  </NavLink>
                </div>
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
