// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children, allowedTags }) => {
  const { user, userTag, loading } = useAuth();

  if (loading) return <div className="spinner"></div>;

  if (!user) {
    return <Navigate to="/welcome" />;
  }

  if (!allowedTags.includes(userTag)) {
    return <Navigate to="/unauthorized" />;
  }
  console.log("ProtectedRoute -> user:", user);
  console.log("ProtectedRoute -> userTag:", userTag);

  return children;
};

export default ProtectedRoute;
