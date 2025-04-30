import React from "react";
import { Navigate } from "react-router-dom";
import { message } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userId = localStorage.getItem("id");
  const userRole = localStorage.getItem("role");

  if (!userId || userRole !== "3") {
    message.destroy(); // Clear any existing messages
    message.error("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;