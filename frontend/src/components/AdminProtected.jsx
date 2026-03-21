// frontend/src/components/AdminProtected.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtected() {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
