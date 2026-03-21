// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import PopularDecorations from "./pages/PopularDecorations.jsx";
import Gallery from "./pages/Gallery.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminDecorations from "./pages/AdminDecorations.jsx";
import AdminGallery from "./pages/AdminGallery.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import AdminContacts from "./pages/AdminContacts.jsx";

import BookDecoration from "./pages/BookDecoration.jsx";
import AdminProtected from "./components/AdminProtected.jsx";

export default function App() {
  return (
    <Routes>
      {/* Customer pages use MainLayout (Navbar + Footer) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/popular" element={<PopularDecorations />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book" element={<BookDecoration />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminProtected />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="view-gallery" element={<AdminGallery />} />
          <Route path="manage-gallery" element={<AdminGallery />} />
          <Route path="decorations" element={<AdminDecorations />} />
          <Route path="decoration" element={<AdminDecorations />} />
          <Route path="manage-decorations" element={<AdminDecorations />} />
        </Route>
      </Route>
    </Routes>
  );
}
