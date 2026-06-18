// frontend/src/pages/AdminContacts.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

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
    setError("");
    try {
      await api.put(
        `/api/contact/admin/${id}/status`,
        { status: "REPLIED" },
        { headers: authHeader }
      );
      fetchAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed.");
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
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      {/* Top Bar */}
      <div style={topRow}>
        <div>
          <h1 style={{ margin: 0, fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}>Contact Messages</h1>
          <p style={{ marginTop: 6, color: "#4b5563" }}>
            Customer contact requests and replies.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            style={btnLightLink}
            onClick={() => navigate("/admin/dashboard")}
          >
            Dashboard
          </button>

          <button
            type="button"
            style={btnLightLink}
            onClick={() => navigate("/admin/bookings")}
          >
            Bookings
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div style={msgError}>{error}</div>}

      {!loading && !error && msgs.length === 0 && (
        <p style={{ color: "#6b7280" }}>No messages yet.</p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {msgs.map((m) => (
          <div key={m._id} style={card}>
            <div style={headerRow}>
              <div style={{ fontWeight: 900, color: "#111827" }}>{m.name}</div>
              <div style={{ color: "#6b7280", fontSize: 12 }}>
                Last updated: {new Date(m.updatedAt || m.createdAt).toLocaleString()}
              </div>
            </div>

            <div style={row}>
              <span style={label}>Email:</span> {m.email}
            </div>
            <div style={row}>
              <span style={label}>Phone:</span> {m.phone}
            </div>
            {m.eventType && (
              <div style={row}>
                <span style={label}>Event Type:</span> {m.eventType}
              </div>
            )}
            {m.eventDate && (
              <div style={row}>
                <span style={label}>Event Date:</span> {new Date(m.eventDate).toLocaleDateString()}
              </div>
            )}
            {m.location && (
              <div style={row}>
                <span style={label}>Location:</span> {m.location}
              </div>
            )}

            <div style={{ marginTop: 10 }}>{renderMessageContent(m.message)}</div>

            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a
                href={`mailto:${m.email}?subject=DecorHire Lanka - Reply&body=Hi ${encodeURIComponent(
                  m.name
                )},%0D%0A%0D%0AThanks for contacting us.%0D%0A%0D%0A`}
                style={btnLightLink}
              >
                Reply Email
              </a>

              <a
                href={`https://wa.me/${String(m.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hi ${m.name}, this is DecorHire Lanka. Thanks for contacting us.`
                )}`}
                target="_blank"
                rel="noreferrer"
                style={btnLightLink}
              >
                Reply WhatsApp
              </a>

              <button type="button" style={btnDark} onClick={() => markReplied(m._id)}>
                Mark REPLIED
              </button>
            </div>

            <div style={{ marginTop: 10, fontWeight: 900, color: "#111827" }}>
              Status:{" "}
              <span style={{ color: (m.status || "NEW") === "REPLIED" ? "#166534" : "#991b1b" }}>
                {m.status || "NEW"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Styles */
const topRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "flex-end",
  marginBottom: 14,
};

const card = {
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 16,
  background: "white",
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "baseline",
};

const row = { marginTop: 6, color: "#374151" };
const label = { fontWeight: 900, color: "#111827" };

const btnDark = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 900,
  background: "#111827",
  color: "white",
  cursor: "pointer",
};

const btnLightLink = {
  textDecoration: "none",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontWeight: 900,
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
  display: "inline-block",
};

const msgError = {
  padding: 12,
  borderRadius: 10,
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 700,
};

const messageText = {
  color: "#374151",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
};

const messageImageWrap = {
  display: "grid",
  gap: 10,
};

const messageImage = {
  width: "100%",
  maxWidth: 320,
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  objectFit: "cover",
  background: "#f9fafb",
};

const messageImageLink = {
  width: "fit-content",
  textDecoration: "none",
  fontWeight: 900,
  color: "#111827",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  padding: "8px 10px",
  borderRadius: 10,
};
