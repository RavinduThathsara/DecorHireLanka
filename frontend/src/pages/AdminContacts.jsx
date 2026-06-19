// frontend/src/pages/AdminContacts.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import Swal from "sweetalert2";

export default function AdminContacts() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("adminToken"), []);
  const authHeader = { Authorization: `Bearer ${token}` };

  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/contact/admin/all", { headers: authHeader });
      setMsgs(res.data.messages || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  const markReplied = async (id) => {
    const result = await Swal.fire({
      title: "Mark as Replied?",
      text: "This will update the message status to REPLIED.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#9b5b34",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, mark it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setError("");
    try {
      await api.put(
        `/api/contact/admin/${id}/status`,
        { status: "REPLIED" },
        { headers: authHeader }
      );
      fetchAll();
      Swal.fire({
        title: "Updated!",
        text: "Message marked as REPLIED successfully.",
        icon: "success",
        confirmButtonColor: "#9b5b34",
        timer: 2000,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
      Swal.fire({
        title: "Error!",
        text: err?.response?.data?.message || "Update failed.",
        icon: "error",
        confirmButtonColor: "#9b5b34",
      });
    }
  };

  const renderMessageContent = (message) => {
    const text = String(message || "").trim();
    const isImageUrl = /^https?:\/\/.+\.(png|jpe?g|webp|gif|bmp)(\?.*)?$/i.test(text);

    if (isImageUrl) {
      return (
        <div style={messageImageWrap}>
          <img src={text} alt="Customer message attachment" style={messageImage} />
          <a href={text} target="_blank" rel="noreferrer" style={messageImageLink}>
            Open image
          </a>
        </div>
      );
    }

    return <div style={messageText}>{text}</div>;
  };

  return (
    <div style={{
      width: "100%",
      background: "linear-gradient(135deg, #fdf8f0 0%, #f9f2e8 100%)",
      minHeight: "100vh",
      paddingBottom: "60px"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
        {/* Top Bar */}
        <div style={topRow}>
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(155, 91, 52, 0.3)"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <h1 style={pageTitle}>Contact Manager</h1>
            </div>
            <p style={pageSubtitle}>
              Customer contact requests and replies.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              style={btnLightLink}
              onClick={() => navigate("/admin/dashboard")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}>
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Dashboard
            </button>

            <button
              type="button"
              style={btnLightLink}
              onClick={() => navigate("/admin/bookings")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Bookings
            </button>
          </div>
        </div>

        {loading && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            fontSize: "16px",
            color: "#9b5b34",
            fontWeight: "600"
          }}>
            Loading messages...
          </div>
        )}

        {error && <div style={msgError}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {error}
        </div>}

        {!loading && !error && msgs.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)"
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9b5b34" strokeWidth="1.5" style={{ margin: "0 auto 20px" }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <p style={{ color: "#6f645a", fontSize: "16px", fontWeight: "600" }}>No messages yet.</p>
          </div>
        )}

        <div style={{ display: "grid", gap: 20 }}>
          {msgs.map((m, index) => (
            <div key={m._id} style={{
              ...card,
              animation: `fadeInUp 0.4s ease ${index * 0.1}s both`
            }}>
              {/* Header */}
              <div style={headerRow}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #d4af7a 0%, #9b5b34 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "20px",
                    fontWeight: "700",
                    fontFamily: '"Playfair Display", serif'
                  }}>
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", color: "#1a1a1a", fontSize: "18px" }}>{m.name}</div>
                    <div style={{ color: "#9b5b34", fontSize: "13px", fontWeight: "600", marginTop: "2px" }}>
                      {new Date(m.updatedAt || m.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  background: (m.status || "NEW") === "REPLIED"
                    ? "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)"
                    : "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                  color: (m.status || "NEW") === "REPLIED" ? "#065f46" : "#991b1b",
                  fontWeight: "700",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {m.status || "NEW"}
                </div>
              </div>

              {/* Details Grid */}
              <div style={detailsGrid}>
                <div style={infoItem}>
                  <div style={infoIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div style={infoLabel}>Email</div>
                    <div style={infoValue}>{m.email}</div>
                  </div>
                </div>

                <div style={infoItem}>
                  <div style={infoIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={infoLabel}>Phone</div>
                    <div style={infoValue}>{m.phone}</div>
                  </div>
                </div>

                {m.eventType && (
                  <div style={infoItem}>
                    <div style={infoIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                    </div>
                    <div>
                      <div style={infoLabel}>Event Type</div>
                      <div style={infoValue}>{m.eventType}</div>
                    </div>
                  </div>
                )}

                {m.eventDate && (
                  <div style={infoItem}>
                    <div style={infoIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <div style={infoLabel}>Event Date</div>
                      <div style={infoValue}>{new Date(m.eventDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}

                {m.location && (
                  <div style={infoItem}>
                    <div style={infoIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <div style={infoLabel}>Location</div>
                      <div style={infoValue}>{m.location}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div style={{ marginTop: 20 }}>{renderMessageContent(m.message)}</div>

              {/* Actions */}
              <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a
                  href={`mailto:${m.email}?subject=DecorHire Lanka - Reply&body=Hi ${encodeURIComponent(
                    m.name
                  )},%0D%0A%0D%0AThanks for contacting us.%0D%0A%0D%0A`}
                  style={btnEmail}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Reply Email
                </a>

                <a
                  href={`https://wa.me/${String(m.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hi ${m.name}, this is DecorHire Lanka. Thanks for contacting us.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  style={btnWhatsApp}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Reply WhatsApp
                </a>

                <button type="button" style={btnDark} onClick={() => markReplied(m._id)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Mark REPLIED
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* Styles */
const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 24,
  flexWrap: "wrap",
  alignItems: "flex-start",
  marginBottom: 40,
  paddingBottom: 28,
  borderBottom: "2px solid rgba(155, 91, 52, 0.1)",
};

const pageTitle = {
  margin: 0,
  color: "#1a1a1a",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
  lineHeight: 1.2,
  fontWeight: "700",
};

const pageSubtitle = {
  marginTop: 12,
  color: "#6f645a",
  fontSize: "1.05rem",
  lineHeight: 1.6,
  fontWeight: "400",
};

const card = {
  border: "none",
  borderRadius: 24,
  padding: 32,
  background: "#fff",
  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  flexWrap: "wrap",
  alignItems: "center",
  paddingBottom: 24,
  marginBottom: 24,
  borderBottom: "2px solid #f5f5f5",
};

const detailsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 16,
  marginTop: 24,
};

const infoItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "16px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #fdf8f0 0%, #fff 100%)",
  border: "1px solid rgba(155, 91, 52, 0.08)",
};

const infoIcon = {
  width: "36px",
  height: "36px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #9b5b34 0%, #d4af7a 100%)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const infoLabel = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#9b5b34",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "4px",
};

const infoValue = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1a1a1a",
  lineHeight: "1.4",
  wordBreak: "break-word",
};

const row = { marginTop: 6, color: "#374151" };
const label = { fontWeight: 900, color: "#111827" };

const btnDark = {
  padding: "12px 20px",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  fontSize: "14px",
  background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
  color: "white",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  boxShadow: "0 4px 12px rgba(155, 91, 52, 0.25)",
  transition: "all 0.3s ease",
};

const btnEmail = {
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: 12,
  border: "2px solid #3b82f6",
  fontWeight: 700,
  fontSize: "14px",
  background: "#fff",
  color: "#3b82f6",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.3s ease",
};

const btnWhatsApp = {
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: 12,
  border: "2px solid #10b981",
  fontWeight: 700,
  fontSize: "14px",
  background: "#fff",
  color: "#10b981",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.3s ease",
};

const btnLightLink = {
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: 12,
  border: "2px solid #e5e7eb",
  fontWeight: 700,
  fontSize: "14px",
  background: "#fff",
  color: "#4a443f",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const msgError = {
  padding: 18,
  borderRadius: 14,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 600,
  border: "2px solid #fecaca",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "15px",
  marginBottom: 20,
};

const messageText = {
  color: "#4a443f",
  lineHeight: 1.7,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  background: "linear-gradient(135deg, #fdf8f0 0%, #f9f2e8 100%)",
  border: "2px solid rgba(155, 91, 52, 0.1)",
  borderRadius: 16,
  padding: 20,
  fontSize: "15px",
  fontWeight: "500",
};

const messageImageWrap = {
  display: "grid",
  gap: 12,
  padding: 20,
  background: "linear-gradient(135deg, #fdf8f0 0%, #f9f2e8 100%)",
  borderRadius: 16,
  border: "2px solid rgba(155, 91, 52, 0.1)",
};

const messageImage = {
  width: "100%",
  maxWidth: 400,
  borderRadius: 14,
  border: "2px solid rgba(155, 91, 52, 0.15)",
  objectFit: "cover",
  background: "#fff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
};

const messageImageLink = {
  width: "fit-content",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
  color: "#9b5b34",
  border: "2px solid #9b5b34",
  background: "#fff",
  padding: "10px 18px",
  borderRadius: 12,
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.3s ease",
};
