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
    const [searchQuery, setSearchQuery] = useState("");

    // Editing states for user-friendly UI
    const [editBooking, setEditBooking] = useState(null);
    const [editMessage, setEditMessage] = useState(null);
    const [updating, setUpdating] = useState(false);

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

    const handleUpdateBooking = (booking) => {
        setEditBooking({ ...booking });
    };

    const saveBookingUpdate = async () => {
        if (!editBooking) return;
        try {
            setUpdating(true);
            const res = await api.put(`/api/bookings/customer/${editBooking._id}`, {
                eventLocation: editBooking.eventLocation,
                note: editBooking.note
            });
            setBookings(bookings.map(b => b._id === editBooking._id ? res.data.booking : b));
            setEditBooking(null);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update booking.");
        } finally {
            setUpdating(false);
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

    const handleUpdateMessage = (msg) => {
        setEditMessage({ ...msg });
    };

    const saveMessageUpdate = async () => {
        if (!editMessage) return;
        try {
            setUpdating(true);
            const res = await api.put(`/api/contact/customer/${editMessage._id}`, {
                message: editMessage.message
            });
            setMessages(messages.map(m => m._id === editMessage._id ? res.data.msg : m));
            setEditMessage(null);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update message.");
        } finally {
            setUpdating(false);
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(b =>
            b.decorationTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.eventLocation?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [bookings, searchQuery]);

    const filteredMessages = useMemo(() => {
        return messages.filter(m =>
            m.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.eventType?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [messages, searchQuery]);

    return (
        <div style={pageShell}>
            {/* Profile Header */}
            <div style={profileHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
                    <div style={profileAvatarCircle}>
                        {customer?.username ? customer.username.charAt(0).toUpperCase() : "U"}
                        <div style={editIconBadge}>📷</div>
                    </div>
                    <div>
                        <h1 style={pageTitle}>My Profile</h1>
                        <p style={pageSubtitle}>Manage your account details and view your activities</p>
                    </div>
                </div>

                {/* Left/Right side search bar (Positioned in header for industry-level look) */}
                <div style={searchContainer}>
                    <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search bookings or messages..."
                        style={searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
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
                    <div style={infoItem}>
                        <span style={infoLabel}>Phone Number</span>
                        <span style={infoValue}>{customer?.phone || customer?.mobile || "Not Provided"}</span>
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
                            <h3 style={sectionTitleContent}>My Bookings ({filteredBookings.length})</h3>
                        </div>

                        {filteredBookings.length === 0 ? (
                            <p style={{ color: "#6f645a", marginTop: 12 }}>
                                {searchQuery ? "No matching bookings found." : "No bookings yet."} {!searchQuery && <a href="/book" style={linkStyleGold}>Start booking now</a>}
                            </p>
                        ) : (
                            <div style={cardList}>
                                {filteredBookings.map((booking) => {
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
                                                    <span style={{ fontWeight: 700, marginRight: 8, color: "#9b5b34" }}>Note:</span>
                                                    {booking.note}
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
                            <h3 style={sectionTitleContent}>Recent Messages ({filteredMessages.length})</h3>
                        </div>

                        {filteredMessages.length === 0 ? (
                            <p style={{ color: "#6f645a", marginTop: 12 }}>
                                {searchQuery ? "No matching messages found." : "No contact messages sent yet."} {!searchQuery && <a href="/contact" style={linkStyleGold}>Send us a message</a>}
                            </p>
                        ) : (
                            <div style={cardList}>
                                {filteredMessages.map((msg) => (
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
                                        <div style={cardDescription}>{msg.message}</div>
                                        <div style={cardActions}>
                                            <button onClick={() => handleUpdateMessage(msg)} style={actionBtnEdit}>Update</button>
                                            <button onClick={() => handleDeleteMessage(msg._id)} style={actionBtnDelete}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Booking Edit Modal */}
                    {editBooking && (
                        <div style={modalOverlay}>
                            <div style={modalContent}>
                                <h3 style={{ ...sectionTitle, marginBottom: 20 }}>Update Booking</h3>
                                <div style={inputGroup}>
                                    <label style={inputLabel}>Event Location</label>
                                    <input
                                        style={inputStyle}
                                        value={editBooking.eventLocation}
                                        onChange={(e) => setEditBooking({ ...editBooking, eventLocation: e.target.value })}
                                    />
                                </div>
                                <div style={inputGroup}>
                                    <label style={inputLabel}>Note (Optional)</label>
                                    <textarea
                                        style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                                        value={editBooking.note}
                                        onChange={(e) => setEditBooking({ ...editBooking, note: e.target.value })}
                                    />
                                </div>
                                <div style={modalActions}>
                                    <button onClick={() => setEditBooking(null)} style={cancelBtn}>Cancel</button>
                                    <button onClick={saveBookingUpdate} style={saveBtn} disabled={updating}>
                                        {updating ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message Edit Modal */}
                    {editMessage && (
                        <div style={modalOverlay}>
                            <div style={modalContent}>
                                <h3 style={{ ...sectionTitle, marginBottom: 20 }}>Update Message</h3>
                                <div style={inputGroup}>
                                    <label style={inputLabel}>Your Message</label>
                                    <textarea
                                        style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                                        value={editMessage.message}
                                        onChange={(e) => setEditMessage({ ...editMessage, message: e.target.value })}
                                    />
                                </div>
                                <div style={modalActions}>
                                    <button onClick={() => setEditMessage(null)} style={cancelBtn}>Cancel</button>
                                    <button onClick={saveMessageUpdate} style={saveBtn} disabled={updating}>
                                        {updating ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* Styles */
const pageShell = {
    maxWidth: 1450,
    margin: "0 auto",
    padding: "20px 2.5%",
    width: "100%",
};

const profileHeader = {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 35,
};

const profileAvatarCircle = {
    position: "relative",
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1f1a17 0%, #3e352f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#d4b99a",
    fontSize: 28,
    fontWeight: 800,
    boxShadow: "0 10px 25px rgba(31, 26, 23, 0.15)",
    border: "2px solid #fff",
    cursor: "pointer",
};

const editIconBadge = {
    position: "absolute",
    bottom: -2,
    right: -2,
    background: "#9b5b34",
    width: 24,
    height: 24,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
    fontSize: 12,
    color: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const pageTitle = {
    margin: 0,
    color: "#14233b",
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1.2,
};

const pageSubtitle = {
    marginTop: 2,
    color: "#6f645a",
    fontSize: 15,
    lineHeight: 1.5,
    fontWeight: 500,
};

const card = {
    border: "1px solid rgba(165, 116, 74, 0.14)",
    borderRadius: 28,
    padding: "24px 34px",
    background: "rgba(255, 255, 255, 0.96)",
    boxShadow: "0 18px 40px rgba(67, 37, 17, 0.08)",
    marginBottom: 15,
};

const sectionHead = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
};

const sectionTitle = {
    margin: 0,
    color: "#14233b",
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
    fontSize: 24,
    lineHeight: 1,
};

const infoGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
    marginTop: 15,
};

const infoItem = {
    display: "grid",
    gap: 4,
};

const infoLabel = {
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#9b5b34",
};

const infoValue = {
    fontSize: 17,
    fontWeight: 700,
    color: "#1f1a17",
};

const msgError = {
    padding: 14,
    borderRadius: 14,
    background: "#fee2e2",
    color: "#991b1b",
    fontWeight: 700,
    marginBottom: 14,
};

const contentSection = {
    marginTop: 25,
};

const sectionWrapper = {
    marginBottom: 45,
};

const sectionTitleContent = {
    margin: 0,
    color: "#14233b",
    fontFamily: '"Playfair Display", Georgia, serif',
    fontSize: 32,
    fontWeight: 700,
};

const cardList = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(520px, 1fr))",
    gap: 28,
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
    fontSize: "14px",
    color: "#6f645a",
    lineHeight: "1.5",
    margin: "12px 0",
    padding: "12px 16px",
    background: "rgba(155, 91, 52, 0.04)",
    borderRadius: "12px",
    border: "1px solid rgba(155, 91, 52, 0.12)",
    flex: 1,
};

const cardActions = {
    display: "flex",
    gap: 8,
    marginTop: "auto",
    paddingTop: 16,
    justifyContent: "flex-end", // Align buttons to the right
};

const actionBtnEdit = {
    padding: "8px 16px", // Reduced horizontal padding for shorter length
    background: "#10b981",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 12, // Slightly smaller font
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
    minWidth: "80px", // Fixed minimum width for consistency
};

const actionBtnDelete = {
    padding: "8px 16px",
    background: "#ef4444",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
    minWidth: "80px",
};

const searchContainer = {
    position: "relative",
    width: "350px",
};

const searchInput = {
    width: "100%",
    padding: "12px 16px 12px 42px",
    borderRadius: "14px",
    border: "1px solid rgba(155, 91, 52, 0.15)",
    background: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    color: "#1f1a17",
};

const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(31, 26, 23, 0.7)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
};

const modalContent = {
    background: "#fff",
    padding: "30px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
};

const inputGroup = {
    marginBottom: "20px",
};

const inputLabel = {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#9b5b34",
    marginBottom: "5px",
};

const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1px solid #e2e2e2",
    fontSize: "15px",
    backgroundColor: "#fff",
    color: "#1f1a17",
};

const modalActions = {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
};

const saveBtn = {
    flex: 2,
    padding: "12px",
    backgroundColor: "#9b5b34",
    color: "white",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
};

const cancelBtn = {
    flex: 1,
    padding: "12px",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
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
