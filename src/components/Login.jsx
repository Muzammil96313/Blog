import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // make sure the path is correct
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLogin) return;
    setIsLogin(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("User Info:", user);

      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setMessage(error.message);
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
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
