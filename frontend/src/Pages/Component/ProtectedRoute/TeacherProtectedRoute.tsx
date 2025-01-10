import React from "react";
import { Navigate } from "react-router-dom";
import { message } from "antd";

interface TeacherProtectedRouteProps {
  children: React.ReactNode;
}

const TeacherProtectedRoute: React.FC<TeacherProtectedRouteProps> = ({ children }) => {
  const userId = localStorage.getItem("id");
  const userRole = localStorage.getItem("role");

  if (!userId || userRole !== "1") {
    message.destroy(); // Clear any existing messages
    message.error("You do not have permission to access this page.");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default TeacherProtectedRoute;
