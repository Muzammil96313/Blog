import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      setMessage(error.response.data.error || "Error signing up");
    }
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white h-[100vh]">
      <div className="container dark:text-white text-black">
        <div className="flex items-center justify-center flex-col gap-4 h-screen">
          <form
            className="flex flex-col lg:w-1/4 md:w-1/2 sm:w-full p-8 bg-white dark:bg-gray-800 rounded-lg bg-gray shadow-lg"
            onSubmit={handleSignup}
          >
            <h2 className="text-4xl mb-6 text-center font-bold">Signup</h2>
            <label className="mb-2" htmlFor="name">
              Enter Your Name:
            </label>
            <input
              className="border border-gray-300 py-2 px-3 rounded-md mb-2 text-black placeholder:text-black"
              type="text"
              placeholder="Name"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className="mb-2" htmlFor="email">
              Enter Your Email:
            </label>
            <input
              className="border border-gray-300 py-2 px-3 rounded-md mb-2 text-black placeholder:text-black"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="mb-2" htmlFor="password">
              Enter Your Password:
            </label>
            <input
              className="border border-gray-300 py-2 px-3 rounded-md mb-4 text-black placeholder:text-black"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-xl font-bold"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signup;
