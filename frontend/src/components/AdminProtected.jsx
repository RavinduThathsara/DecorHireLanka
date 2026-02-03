// frontend/src/components/AdminProtected.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminProtected({ children }) {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
