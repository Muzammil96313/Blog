import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const isTokenValid = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token); // Decode the JWT
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp > currentTime; // Check token expiration
  } catch (error) {
    console.error("Invalid token:", error.message);
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const isValid = isTokenValid();

  if (!isValid) {
    // Clear invalid tokens and redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
