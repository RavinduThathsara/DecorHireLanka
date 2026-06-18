// frontend/src/pages/UserProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function UserProfile() {
    const navigate = useNavigate();
    const { customer } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!customer) {
            navigate("/login");
            return;
        }
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError("");

            // Fetch bookings
            const bookingsRes = await api.get("/api/bookings/customer/my-bookings", {
                params: { email: customer.email },
            });
            setBookings(bookingsRes.data.bookings || []);

            // Fetch contact messages
            const messagesRes = await api.get("/api/contact/customer/my-messages", {
                params: { email: customer.email },
            });
            setMessages(messagesRes.data.messages || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load profile data.");
            console.error("Error fetching user data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        try {
            await api.delete(`/api/bookings/customer/${id}`);
            setBookings(bookings.filter(b => b._id !== id));
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete booking.");
        }
    };

    const handleUpdateBooking = async (booking) => {
        const newLocation = window.prompt("Enter new event location:", booking.eventLocation);
        const newNote = window.prompt("Enter new note:", booking.note);
        if (newLocation === null) return;

        try {
            const res = await api.put(`/api/bookings/customer/${booking._id}`, {
                eventLocation: newLocation,
                note: newNote
            });
            setBookings(bookings.map(b => b._id === booking._id ? res.data.booking : b));
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update booking.");
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await api.delete(`/api/contact/customer/${id}`);
            setMessages(messages.filter(m => m._id !== id));
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete message.");
        }
    };

    const handleUpdateMessage = async (msg) => {
        const newMessage = window.prompt("Update your message:", msg.message);
        if (newMessage === null) return;

        try {
            const res = await api.put(`/api/contact/customer/${msg._id}`, {
                message: newMessage
            });
            setMessages(messages.map(m => m._id === msg._id ? res.data.msg : m));
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update message.");
        }
    };

    return (
        <div style={pageShell}>
            {/* Profile Header */}
            <div style={profileHeader}>
                <div>
                    <h1 style={pageTitle}>My Profile</h1>
                    <p style={pageSubtitle}>Manage your account details and view your activities.</p>
                </div>
            </div>

            {/* User Info Card */}
            <div style={card}>
                <h3 style={sectionTitle}>Account Information</h3>
                <div style={infoGrid}>
                    <div style={infoItem}>
                        <span style={infoLabel}>Name</span>
                        <span style={infoValue}>{customer?.username || "N/A"}</span>
                    </div>
                    <div style={infoItem}>
                        <span style={infoLabel}>Email</span>
                        <span style={infoValue}>{customer?.email || "N/A"}</span>
                    </div>
                </div>
            </div>

            {error && <div style={msgError}>{error}</div>}

            {loading && <p style={{ color: "#6b7280", marginTop: 16 }}>Loading your data...</p>}

            {!loading && (
                <div style={darkSection}>
                    {/* Bookings Section */}
                    <div style={sectionWrapper}>
                        <div style={sectionHead}>
                            <h3 style={sectionTitleDark}>My Bookings ({bookings.length})</h3>
                        </div>

                        {bookings.length === 0 ? (
                            <p style={{ color: "#94a3b8", marginTop: 12 }}>
                                No bookings yet. <a href="/book" style={linkStyleGold}>Start booking now</a>
                            </p>
                        ) : (
                            <div style={cardGrid}>
                                {bookings.map((booking) => {
                                    const dateObj = new Date(booking.eventDate);
                                    const day = dateObj.getDate();
                                    const month = dateObj.toLocaleString('default', { month: 'short' });

                                    return (
                                        <div key={booking._id} style={modernCard}>
                                            <div style={cardMainContent}>
                                                <div style={dateBox}>
                                                    <span style={dateMonth}>{month}</span>
                                                    <span style={dateDay}>{day}</span>
                                                </div>
                                                <div style={cardInfo}>
                                                    <div style={cardTopRow}>
                                                        <h4 style={modernCardTitle}>{booking.decorationTitle}</h4>
                                                        <div
                                                            style={{
                                                                ...statusBadgeModern,
                                                                background:
                                                                    booking.status === "CONFIRMED"
                                                                        ? "rgba(16, 185, 129, 0.1)"
                                                                        : booking.status === "CANCELLED"
                                                                            ? "rgba(239, 68, 68, 0.1)"
                                                                            : "rgba(245, 158, 11, 0.1)",
                                                                color:
                                                                    booking.status === "CONFIRMED"
                                                                        ? "#10b981"
                                                                        : booking.status === "CANCELLED"
                                                                            ? "#ef4444"
                                                                            : "#f59e0b",
                                                            }}
                                                        >
                                                            <span style={{ fontSize: 10, marginRight: 6 }}>●</span>
                                                            {booking.status}
                                                        </div>
                                                    </div>
                                                    <div style={cardMetaRow}>
                                                        <div style={metaItem}>
                                                            <span style={metaIcon}>📍</span>
                                                            {booking.eventLocation}
                                                        </div>
                                                        <div style={metaItem}>
                                                            <span style={metaIcon}>📅</span>
                                                            {booking.eventDate}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {booking.note && (
                                                <div style={cardDescription}>
                                                    <strong style={{ color: "#d1d5db" }}>Note:</strong> {booking.note}
                                                </div>
                                            ) || (
                                                    <div style={cardDescription}>
                                                        <span style={{ color: "#64748b", fontStyle: "italic" }}>No specific notes provided.</span>
                                                    </div>
                                                )}

                                            <div style={cardActions}>
                                                <button onClick={() => handleUpdateBooking(booking)} style={actionBtnEdit}>Update</button>
                                                <button onClick={() => handleDeleteBooking(booking._id)} style={actionBtnDelete}>Delete</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Contact Messages Section */}
                    <div style={sectionWrapper}>
                        <div style={sectionHead}>
                            <h3 style={sectionTitleDark}>Recent Messages ({messages.length})</h3>
                        </div>

                        {messages.length === 0 ? (
                            <p style={{ color: "#94a3b8", marginTop: 12 }}>
                                No contact messages sent yet. <a href="/contact" style={linkStyleGold}>Send us a message</a>
                            </p>
                        ) : (
                            <div style={cardGrid}>
                                {messages.map((msg) => (
                                    <div key={msg._id} style={modernCard}>
                                        <div style={cardMainContent}>
                                            <div style={iconBox}>
                                                <span style={{ fontSize: 24 }}>💬</span>
                                            </div>
                                            <div style={cardInfo}>
                                                <div style={cardTopRow}>
                                                    <h4 style={modernCardTitle}>{msg.eventType || "Contact Message"}</h4>
                                                    <div
                                                        style={{
                                                            ...statusBadgeModern,
                                                            background: msg.status === "REPLIED" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                                                            color: msg.status === "REPLIED" ? "#10b981" : "#f59e0b",
                                                        }}
                                                    >
                                                        {msg.status || "NEW"}
                                                    </div>
                                                </div>
                                                <div style={cardMetaRow}>
                                                    <div style={metaItem}>
                                                        {new Date(msg.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p style={cardDescription}>{msg.message}</p>
                                        <div style={cardActions}>
                                            <button onClick={() => handleUpdateMessage(msg)} style={actionBtnEdit}>Update</button>
                                            <button onClick={() => handleDeleteMessage(msg._id)} style={actionBtnDelete}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* Styles */
const pageShell = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "26px 22px 36px",
};

const profileHeader = {
    marginBottom: 22,
};

const pageTitle = {
    margin: 0,
    color: "#14233b",
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
    fontSize: "clamp(2rem, 3vw, 2.8rem)",
    lineHeight: 1,
};

const pageSubtitle = {
    marginTop: 10,
    color: "#5d6576",
    fontSize: 17,
    lineHeight: 1.7,
};

const card = {
    border: "1px solid rgba(165, 116, 74, 0.14)",
    borderRadius: 28,
    padding: 22,
    background: "rgba(255, 255, 255, 0.96)",
    boxShadow: "0 18px 40px rgba(67, 37, 17, 0.08)",
    marginBottom: 20,
};

const sectionHead = {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
};

const sectionTitle = {
    margin: 0,
    color: "#14233b",
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
    fontSize: 22,
    lineHeight: 1.05,
};

const infoGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    marginTop: 16,
};

const infoItem = {
    display: "grid",
    gap: 6,
};

const infoLabel = {
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#9b5b34",
};

const infoValue = {
    fontSize: 15,
    fontWeight: 700,
    color: "#1f1a17",
};

const msgError = {
    padding: 12,
    borderRadius: 14,
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: 700,
    marginBottom: 12,
};

const darkSection = {
    marginTop: 30,
    background: "#0f172a", // Very dark blue/black
    padding: "40px 20px",
    borderRadius: 32,
};

const sectionWrapper = {
    marginBottom: 40,
};

const sectionTitleDark = {
    margin: "0 0 20px 0",
    color: "#f8fafc",
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: 24,
};

const cardGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
};

const modernCard = {
    background: "#1e293b", // Slate-800
    borderRadius: 20,
    padding: 20,
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "transform 0.2s ease",
    display: "flex",
    flexDirection: "column",
};

const cardMainContent = {
    display: "flex",
    gap: 16,
    marginBottom: 16,
};

const dateBox = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    minWidth: 64,
    height: 70,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

const dateMonth = {
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#94a3b8",
};

const dateDay = {
    fontSize: 24,
    fontWeight: 900,
    color: "#f8fafc",
};

const iconBox = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    minWidth: 64,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const cardInfo = {
    flex: 1,
};

const cardTopRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
};

const modernCardTitle = {
    margin: 0,
    fontSize: 18,
    color: "#f8fafc",
    fontWeight: 700,
};

const statusBadgeModern = {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
};

const cardMetaRow = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
};

const metaItem = {
    fontSize: 13,
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    gap: 6,
};

const metaIcon = {
    fontSize: 12,
};

const cardDescription = {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.5,
    marginBottom: 20,
    flex: 1,
};

const cardActions = {
    display: "flex",
    gap: 10,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: 16,
};

const actionBtnEdit = {
    flex: 1,
    padding: "8px",
    background: "rgba(255,255,255,0.05)",
    border: "none",
    borderRadius: 8,
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
};

const actionBtnDelete = {
    flex: 1,
    padding: "8px",
    background: "rgba(239, 68, 68, 0.1)",
    border: "none",
    borderRadius: 8,
    color: "#ef4444",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
};

const linkStyleGold = {
    color: "#eab308",
    fontWeight: 700,
    textDecoration: "none",
};

const statusBadge = {
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
};

const linkStyle = {
    color: "#9b5b34",
    fontWeight: 900,
    textDecoration: "none",
};
