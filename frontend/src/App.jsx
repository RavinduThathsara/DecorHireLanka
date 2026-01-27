// frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";

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
import BookDecoration from "./pages/BookDecoration.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
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

      {/* Admin pages (you can add admin layout later if you want) */}
      <Route path="/admin/login" element={<AdminLogin />} />

            <Route
            path="/admin/dashboard"
            element={
                <AdminProtected>
                <AdminDashboard />
                </AdminProtected>
            }
            />

            <Route
            path="/admin/decorations"
            element={
                <AdminProtected>
                <AdminDecorations />
                </AdminProtected>
            }
            />

            <Route
            path="/admin/gallery"
            element={
                <AdminProtected>
                <AdminGallery />
                </AdminProtected>
            }
            />

            <Route
            path="/admin/bookings"
            element={
                <AdminProtected>
                <AdminBookings />
                </AdminProtected>
            }
            />

    </Routes>
  );
}
