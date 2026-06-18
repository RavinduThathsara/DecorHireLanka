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
                <>
                    {/* Bookings Section */}
                    <div style={card}>
                        <div style={sectionHead}>
                            <h3 style={sectionTitle}>My Bookings ({bookings.length})</h3>
                        </div>

                        {bookings.length === 0 ? (
                            <p style={{ color: "#6b7280", marginTop: 12 }}>
                                No bookings yet. <a href="/book" style={linkStyle}>Start booking now</a>
                            </p>
                        ) : (
                            <div style={itemList}>
                                {bookings.map((booking) => (
                                    <div key={booking._id} style={bookingItem}>
                                        <div style={bookingHeader}>
                                            <div>
                                                <h4 style={bookingTitle}>{booking.decorationTitle}</h4>
                                                <p style={bookingMeta}>
                                                    {new Date(booking.eventDate).toLocaleDateString()} • {booking.eventLocation}
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    ...statusBadge,
                                                    background:
                                                        booking.status === "CONFIRMED"
                                                            ? "#dcfce7"
                                                            : booking.status === "CANCELLED"
                                                                ? "#fee2e2"
                                                                : "#fef3c7",
                                                    color:
                                                        booking.status === "CONFIRMED"
                                                            ? "#166534"
                                                            : booking.status === "CANCELLED"
                                                                ? "#991b1b"
                                                                : "#92400e",
                                                }}
                                            >
                                                {booking.status}
                                            </div>
                                        </div>
                                        {booking.note && (
                                            <p style={bookingNote}>
                                                <strong>Note:</strong> {booking.note}
                                            </p>
                                        )}
                                        <p style={bookingTime}>
                                            Submitted: {new Date(booking.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact Messages Section */}
                    <div style={card}>
                        <div style={sectionHead}>
                            <h3 style={sectionTitle}>My Contact Messages ({messages.length})</h3>
                        </div>

                        {messages.length === 0 ? (
                            <p style={{ color: "#6b7280", marginTop: 12 }}>
                                No contact messages sent yet. <a href="/contact" style={linkStyle}>Send us a message</a>
                            </p>
                        ) : (
                            <div style={itemList}>
                                {messages.map((msg) => (
                                    <div key={msg._id} style={messageItem}>
                                        <div style={messageHeader}>
                                            <div>
                                                <h4 style={messageTitle}>{msg.message.substring(0, 60)}...</h4>
                                                <p style={messageMeta}>
                                                    {msg.eventType && `${msg.eventType} • `}
                                                    {msg.location || "No location"}
                                                </p>
                                            </div>
                                            <div
                                                style={{
                                                    ...statusBadge,
                                                    background: msg.status === "REPLIED" ? "#dcfce7" : "#fef3c7",
                                                    color: msg.status === "REPLIED" ? "#166534" : "#92400e",
                                                }}
                                            >
                                                {msg.status || "NEW"}
                                            </div>
                                        </div>
                                        <p style={messageContent}>{msg.message}</p>
                                        <p style={messageTime}>
                                            Sent: {new Date(msg.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
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

const itemList = {
    display: "grid",
    gap: 14,
    marginTop: 12,
};

const bookingItem = {
    border: "1px solid rgba(165, 116, 74, 0.14)",
    borderRadius: 16,
    padding: 16,
    background: "#fafaf9",
};

const bookingHeader = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
};

const bookingTitle = {
    margin: "0 0 6px 0",
    color: "#1f1a17",
    fontSize: 16,
    fontWeight: 900,
};

const bookingMeta = {
    margin: 0,
    color: "#6b7280",
    fontSize: 14,
    fontWeight: 600,
};

const bookingNote = {
    marginTop: 10,
    color: "#374151",
    fontSize: 14,
    lineHeight: 1.6,
    background: "rgba(155, 91, 52, 0.06)",
    padding: 10,
    borderRadius: 8,
};

const bookingTime = {
    marginTop: 8,
    color: "#9ca3af",
    fontSize: 12,
};

const messageItem = {
    border: "1px solid rgba(165, 116, 74, 0.14)",
    borderRadius: 16,
    padding: 16,
    background: "#fafaf9",
};

const messageHeader = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
};

const messageTitle = {
    margin: "0 0 6px 0",
    color: "#1f1a17",
    fontSize: 16,
    fontWeight: 900,
};

const messageMeta = {
    margin: 0,
    color: "#6b7280",
    fontSize: 14,
    fontWeight: 600,
};

const messageContent = {
    marginTop: 10,
    color: "#374151",
    fontSize: 14,
    lineHeight: 1.6,
    background: "rgba(155, 91, 52, 0.06)",
    padding: 10,
    borderRadius: 8,
};

const messageTime = {
    marginTop: 8,
    color: "#9ca3af",
    fontSize: 12,
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
