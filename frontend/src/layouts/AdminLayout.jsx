import React from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const GALLERY_PATHS = ["/admin/gallery", "/admin/view-gallery", "/admin/manage-gallery"];
const DECORATION_PATHS = [
  "/admin/decorations",
  "/admin/decoration",
  "/admin/manage-decorations",
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const galleryActive = GALLERY_PATHS.some((p) => pathname === p);
  const decorationActive = DECORATION_PATHS.some((p) => pathname === p);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-brand">
          Decor Hire <span className="admin-brand-tag">Admin</span>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) =>
              "admin-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) =>
              "admin-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Bookings
          </NavLink>
          <NavLink
            to="/admin/contacts"
            className={({ isActive }) =>
              "admin-nav-link" + (isActive ? " is-active" : "")
            }
          >
            Messages
          </NavLink>
          <NavLink
            to="/admin/gallery"
            className={() =>
              "admin-nav-link" + (galleryActive ? " is-active" : "")
            }
          >
            Gallery
          </NavLink>
          <NavLink
            to="/admin/decorations"
            className={() =>
              "admin-nav-link" + (decorationActive ? " is-active" : "")
            }
          >
            Decorations
          </NavLink>
        </nav>

        <button type="button" className="admin-logout-btn" onClick={logout}>
          Log out
        </button>
      </aside>

      <div className="admin-content-wrap">
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
