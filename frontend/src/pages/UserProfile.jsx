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
                <div style={contentSection}>
                    {/* Bookings Section */}
                    <div style={sectionWrapper}>
                        <div style={sectionHead}>
                            <h3 style={sectionTitleContent}>My Bookings ({bookings.length})</h3>
                        </div>

                        {bookings.length === 0 ? (
                            <p style={{ color: "#6f645a", marginTop: 12 }}>
                                No bookings yet. <a href="/book" style={linkStyleGold}>Start booking now</a>
                            </p>
                        ) : (
                            <div style={cardList}>
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
                                                    <strong style={{ color: "#1f1a17" }}>Note:</strong> {booking.note}
                                                </div>
                                            ) || (
                                                    <div style={cardDescription}>
                                                        <span style={{ color: "#6f645a", fontStyle: "italic" }}>No specific notes provided.</span>
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
                            <h3 style={sectionTitleContent}>Recent Messages ({messages.length})</h3>
                        </div>

                        {messages.length === 0 ? (
                            <p style={{ color: "#6f645a", marginTop: 12 }}>
                                No contact messages sent yet. <a href="/contact" style={linkStyleGold}>Send us a message</a>
                            </p>
                        ) : (
                            <div style={cardList}>
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

const contentSection = {
    marginTop: 30,
};

const sectionWrapper = {
    marginBottom: 50,
};

const sectionTitleContent = {
    margin: "0 0 20px 0",
    color: "#14233b",
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: 26,
};

const cardList = {
    display: "flex",
    flexDirection: "column",
    gap: 22,
};

const modernCard = {
    background: "rgba(255, 255, 255, 0.7)", // Glass-like light surface
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    padding: 24,
    border: "1px solid rgba(155, 91, 52, 0.12)",
    boxShadow: "0 12px 30px rgba(70, 43, 22, 0.04)",
    display: "flex",
    flexDirection: "column",
};

const cardMainContent = {
    display: "flex",
    gap: 20,
    marginBottom: 18,
};

const dateBox = {
    background: "linear-gradient(135deg, #1f1a17 0%, #3e352f 100%)",
    borderRadius: 16,
    minWidth: 70,
    height: 76,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 16px rgba(31, 26, 23, 0.15)",
};

const dateMonth = {
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#d4b99a",
    letterSpacing: "0.05em",
};

const dateDay = {
    fontSize: 26,
    fontWeight: 900,
    color: "#ffffff",
};

const iconBox = {
    background: "linear-gradient(135deg, #1f1a17 0%, #3e352f 100%)",
    borderRadius: 16,
    minWidth: 70,
    height: 70,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 16px rgba(31, 26, 23, 0.15)",
};

const cardInfo = {
    flex: 1,
};

const cardTopRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
};

const modernCardTitle = {
    margin: 0,
    fontSize: 20,
    color: "#1f1a17",
    fontWeight: 800,
    fontFamily: 'inherit',
};

const statusBadgeModern = {
    padding: "6px 14px",
    borderRadius: "99px",
    fontSize: 12,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    letterSpacing: "0.02em",
};

const cardMetaRow = {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
};

const metaItem = {
    fontSize: 14,
    color: "#6f645a",
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 600,
};

const metaIcon = {
    fontSize: 14,
};

const cardDescription = {
    fontSize: 15,
    color: "#4a443f",
    lineHeight: 1.6,
    margin: "10px 0 24px 0",
    padding: "14px 18px",
    background: "rgba(155, 91, 52, 0.05)",
    borderRadius: 14,
    borderLeft: "4px solid #9b5b34",
    flex: 1,
};

const cardActions = {
    display: "flex",
    gap: 12,
    borderTop: "1px solid rgba(102, 79, 58, 0.1)",
    paddingTop: 20,
};

const actionBtnEdit = {
    flex: 1,
    padding: "12px",
    background: "#ffffff",
    border: "1px solid rgba(102, 79, 58, 0.15)",
    borderRadius: 12,
    color: "#1f1a17",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
};

const actionBtnDelete = {
    flex: 1,
    padding: "12px",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.15)",
    borderRadius: 12,
    color: "#ef4444",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
};

const linkStyleGold = {
    color: "#9b5b34",
    fontWeight: 800,
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
