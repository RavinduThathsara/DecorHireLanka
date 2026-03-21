import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const authHeader = { Authorization: `Bearer ${token}` };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [bRes, mRes] = await Promise.all([
        api.get("/api/bookings/admin/all", { headers: authHeader }),
        api.get("/api/contact/admin/all", { headers: authHeader }),
      ]);

      setBookings(bRes.data.bookings || []);
      setMessages(mRes.data.messages || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const totalBookings = bookings.length;
  const newBookings = bookings.filter((b) => (b.status || "NEW") === "NEW").length;

  const totalMessages = messages.length;
  const newMessages = messages.filter((m) => (m.status || "NEW") === "NEW").length;

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-lead">
          Overview of bookings and contact messages. Use the sidebar or the shortcuts below to
          manage content.
        </p>
      </header>

      {loading && <p className="admin-muted">Loading dashboard…</p>}
      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {!loading && !error && (
        <>
          <section className="admin-stat-grid" aria-label="Summary statistics">
            <div className="admin-stat-card">
              <div className="admin-stat-value">{totalBookings}</div>
              <div className="admin-stat-label">Total bookings</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{newBookings}</div>
              <div className="admin-stat-label">New bookings</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{totalMessages}</div>
              <div className="admin-stat-label">Total messages</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-value">{newMessages}</div>
              <div className="admin-stat-label">New messages</div>
            </div>
          </section>

          <section className="admin-shortcuts" aria-label="Quick navigation">
            <h2 className="admin-section-title">Go to</h2>
            <div className="admin-quick-grid">
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  "admin-quick-card" + (isActive ? " admin-quick-card-active" : "")
                }
              >
                <span className="admin-quick-title">Bookings</span>
                <span className="admin-quick-desc">View and update booking status</span>
                <span className="admin-quick-arrow" aria-hidden="true">
                  →
                </span>
              </NavLink>
              <NavLink
                to="/admin/contacts"
                className={({ isActive }) =>
                  "admin-quick-card" + (isActive ? " admin-quick-card-active" : "")
                }
              >
                <span className="admin-quick-title">Messages</span>
                <span className="admin-quick-desc">Contact form submissions</span>
                <span className="admin-quick-arrow" aria-hidden="true">
                  →
                </span>
              </NavLink>
              <NavLink
                to="/admin/gallery"
                className={({ isActive }) =>
                  "admin-quick-card" + (isActive ? " admin-quick-card-active" : "")
                }
              >
                <span className="admin-quick-title">Gallery</span>
                <span className="admin-quick-desc">Upload and manage gallery images</span>
                <span className="admin-quick-arrow" aria-hidden="true">
                  →
                </span>
              </NavLink>
              <NavLink
                to="/admin/decorations"
                className={({ isActive }) =>
                  "admin-quick-card" + (isActive ? " admin-quick-card-active" : "")
                }
              >
                <span className="admin-quick-title">Decorations</span>
                <span className="admin-quick-desc">Edit decoration listings</span>
                <span className="admin-quick-arrow" aria-hidden="true">
                  →
                </span>
              </NavLink>
            </div>
          </section>

          <div className="admin-panels">
            <section className="admin-panel">
              <div className="admin-panel-head">
                <h2 className="admin-panel-title">Recent bookings</h2>
                <Link to="/admin/bookings" className="admin-panel-link">
                  View all
                </Link>
              </div>

              {bookings.slice(0, 3).map((b) => (
                <div key={b._id} className="admin-panel-row">
                  <div className="admin-panel-row-title">{b.decorationTitle}</div>
                  <div className="admin-panel-row-meta">
                    {b.name} · {b.phone} · {b.status || "NEW"}
                  </div>
                </div>
              ))}

              {bookings.length === 0 && (
                <p className="admin-muted admin-panel-empty">No bookings yet.</p>
              )}
            </section>

            <section className="admin-panel">
              <div className="admin-panel-head">
                <h2 className="admin-panel-title">Recent messages</h2>
                <Link to="/admin/contacts" className="admin-panel-link">
                  View all
                </Link>
              </div>

              {messages.slice(0, 3).map((m) => (
                <div key={m._id} className="admin-panel-row">
                  <div className="admin-panel-row-title">{m.name}</div>
                  <div className="admin-panel-row-meta">
                    {m.email} · {m.status || "NEW"}
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <p className="admin-muted admin-panel-empty">No messages yet.</p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

