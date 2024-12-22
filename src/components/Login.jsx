import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (isLogin) return;
    setIsLogin(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://blog-backend-git-master-pracatices-projects.vercel.app/api/auth/login",
        {
          email,
          password,
        }
      );

      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;

      // Decode the accessToken
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      console.log("Decoded Token:", decodedToken); // Log the decoded payload
      console.log("User ID from Token:", decodedToken.id);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setMessage("Login successful! Redirecting to posts...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error logging in");
    } finally {
      setIsLogin(false);
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white h-[100vh]">
      <div className="container dark:text-white text-black">
        <div className="flex items-center justify-center flex-col gap-4 h-screen">
          <form
            onSubmit={handleLogin}
            className="flex flex-col lg:w-1/4 md:w-1/2 sm:w-full p-8 rounded-lg dark:bg-gray-800 bg-white shadow-lg"
          >
            <h2 className="text-4xl mb-6 text-center font-bold">Login</h2>
            <label className="mb-2" htmlFor="email">
              Enter Your Email:
            </label>
            <input
              className="border border-gray-300 py-2 px-3 rounded-md mb-2 text-black placeholder:text-black"
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="on"
            />
            <label className="mb-2" htmlFor="password">
              Enter Your Password:
            </label>
            <input
              className="border border-gray-300 py-2 px-3 rounded-md mb-4 text-black placeholder:text-black"
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="on"
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-xl font-bold"
              type="submit"
            >
              {isLogin ? "loading..." : "Login"}
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
