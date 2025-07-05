import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // make sure the path is correct
import { auth } from "../../firebase"; // make sure the path is correct
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSignUp) return;
    setIsSignUp(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, { displayName: name });

      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSignUp(false);
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
              autoComplete="name"
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
              autoComplete="email"
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
              autoComplete="current-password"
            />
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 text-xl font-bold"
              type="submit"
            >
              {isSignUp ? "Loading..." : "Sign Up"}
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Signup;
