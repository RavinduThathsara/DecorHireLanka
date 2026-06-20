// frontend/src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

// Add CSS animation for typing dots
const style = document.createElement('style');
style.textContent = `
  @keyframes typingDotAnimation {
    0%, 60%, 100% {
      opacity: 0.3;
      transform: translateY(0);
    }
    30% {
      opacity: 1;
      transform: translateY(-4px);
    }
  }
  
  .typing-dot {
    animation: typingDotAnimation 1.4s infinite;
    display: inline-block;
  }
`;
if (!document.getElementById('chatbot-animations')) {
    style.id = 'chatbot-animations';
    document.head.appendChild(style);
}

export default function Chatbot() {
    const { customer } = useAuth();
    const [sessionId, setSessionId] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: "bot",
            text: "Hello! 👋 Welcome to DecorHire Lanka. I'm here to help you with decoration inquiries. How can I assist you today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);
    const messagesEndRef = useRef(null);

    // Generate or retrieve session ID and load gallery images
    useEffect(() => {
        let storedSessionId = localStorage.getItem("chatSessionId");
        if (!storedSessionId) {
            storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem("chatSessionId", storedSessionId);
        }
        setSessionId(storedSessionId);

        // Load chat history
        loadChatHistory(storedSessionId);

        // Load gallery images
        loadGalleryImages();
    }, []);

    // Link chat to user when they log in
    useEffect(() => {
        if (customer && sessionId) {
            linkChatToUser();
        }
    }, [customer, sessionId]);

    // Load gallery images from backend
    const loadGalleryImages = async () => {
        try {
            const response = await api.get("/api/gallery/");
            if (response.data.images) {
                setGalleryImages(response.data.images);
            }
        } catch (error) {
            console.error("Error loading gallery images:", error);
        }
    };

    // Load chat history from backend
    const loadChatHistory = async (sid) => {
        try {
            const response = await api.get(`/api/chat/history/${sid}`);
            if (response.data.messages && response.data.messages.length > 0) {
                setMessages(response.data.messages.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                })));
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
        }
    };

    // Link anonymous chat to logged-in user
    const linkChatToUser = async () => {
        try {
            const token = localStorage.getItem("customerToken");
            if (!token) return;

            await api.post("/api/chat/link-user",
                { sessionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error("Error linking chat to user:", error);
        }
    };

    // Save chat history to backend
    const saveChatHistory = async (updatedMessages) => {
        try {
            await api.post("/api/chat/save", {
                sessionId,
                messages: updatedMessages,
                customerEmail: customer?.email || null,
            });
        } catch (error) {
            console.error("Error saving chat history:", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Get recommended images based on category
    const getRecommendedImages = (category) => {
        return galleryImages
            .filter(img => img.category === category && img.isActive)
            .slice(0, 4); // Show max 4 images
    };

    // AI Response Logic
    const getAIResponse = (userMessage) => {
        const message = userMessage.toLowerCase();

        // Wedding-related queries with image recommendations
        if (message.includes("wedding") || message.includes("marriage") ||
            message.includes("stage") || message.includes("poruwa")) {
            const weddingImages = getRecommendedImages("wedding");
            return {
                text: "We offer stunning wedding decoration packages! 💐 Our services include:\n• Traditional Poruwa decorations\n• Stage decorations\n• Aisle & venue decorations\n• Floral arrangements\n\nWould you like to see our wedding packages or book a consultation?",
                images: weddingImages,
                imageCategory: "Wedding Decorations"
            };
        }

        // Birthday-related queries with image recommendations
        if (message.includes("birthday") || message.includes("bday")) {
            const birthdayImages = getRecommendedImages("birthday");
            return {
                text: "We create amazing birthday decorations! 🎉 We offer:\n• Theme-based decorations\n• Balloon arrangements\n• Backdrop setups\n• Cake table decorations\n\nWhich age group or theme are you interested in?",
                images: birthdayImages,
                imageCategory: "Birthday Decorations"
            };
        }

        // Table decorations query
        if (message.includes("table")) {
            const tableImages = getRecommendedImages("table");
            return {
                text: "We create beautiful table decorations! 🍽️ Our table decoration services include:\n• Centerpieces\n• Table runners\n• Floral arrangements\n• Themed table setups\n\nPerfect for weddings, birthdays, and special events!",
                images: tableImages,
                imageCategory: "Table Decorations"
            };
        }

        // Hall decorations query
        if (message.includes("hall") || message.includes("venue")) {
            const hallImages = getRecommendedImages("hall");
            return {
                text: "We specialize in stunning hall decorations! 🏛️ Our services include:\n• Complete venue transformation\n• Ceiling decorations\n• Wall draping\n• Lighting setups\n\nLet's make your venue unforgettable!",
                images: hallImages,
                imageCategory: "Hall Decorations"
            };
        }

        // Pricing queries
        if (message.includes("price") || message.includes("cost") || message.includes("budget")) {
            return {
                text: "Our decoration packages are customizable based on your needs! 💰\n\nPrices typically start from:\n• Basic packages: LKR 25,000+\n• Premium packages: LKR 50,000+\n• Luxury packages: LKR 100,000+\n\nFor accurate pricing, I recommend booking a consultation. Would you like me to help you with that?",
                images: [],
                imageCategory: null
            };
        }

        // Booking queries
        if (message.includes("book") || message.includes("appointment") || message.includes("consultation")) {
            return {
                text: "I'd be happy to help you book! 📅\n\nYou can:\n1. Click on 'Book Decoration' in the menu\n2. Call us at +94 713187790\n3. Send us a WhatsApp message\n\nWhich option works best for you?",
                images: [],
                imageCategory: null
            };
        }

        // Contact queries
        if (message.includes("contact") || message.includes("phone") || message.includes("whatsapp")) {
            return {
                text: "You can reach us through: 📞\n\n• Phone: +94 713187790\n• WhatsApp: +94 713187790\n• Address: 149, Kowil Kade, Passara, Sri Lanka\n\nWe're available Monday to Saturday, 9 AM - 6 PM. Would you like to send us a message now?",
                images: [],
                imageCategory: null
            };
        }

        // Gallery/Portfolio queries - show mix of all categories
        if (message.includes("gallery") || message.includes("photo") || message.includes("picture") ||
            message.includes("example") || message.includes("portfolio") || message.includes("work")) {
            const mixedImages = galleryImages.filter(img => img.isActive).slice(0, 4);
            return {
                text: "Check out our amazing work! 📸\n\nVisit our Gallery page to see:\n• Wedding decorations\n• Birthday setups\n• Hall decorations\n• Table arrangements\n\nYou can also follow us on Instagram for daily updates!",
                images: mixedImages,
                imageCategory: "Our Gallery"
            };
        }

        // Services queries
        if (message.includes("service") || message.includes("offer") || message.includes("provide")) {
            return {
                text: "We offer comprehensive decoration services: ✨\n\n• Wedding Decorations\n• Birthday Parties\n• Homecoming Ceremonies\n• Corporate Events\n• Hall Decorations\n• Stage Setups\n• Floral Arrangements\n\nWhich service interests you most?",
                images: [],
                imageCategory: null
            };
        }

        // Location queries
        if (message.includes("location") || message.includes("address") || message.includes("where")) {
            return {
                text: "We're located at: 📍\n\n149, Kowil Kade, Passara, Sri Lanka\n\nWe serve customers across Sri Lanka with delivery and setup services. Where is your event located?",
                images: [],
                imageCategory: null
            };
        }

        // Greeting responses
        if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
            return {
                text: "Hello! 😊 How can I help you plan your perfect decoration today?",
                images: [],
                imageCategory: null
            };
        }

        // Thank you responses
        if (message.includes("thank") || message.includes("thanks")) {
            return {
                text: "You're welcome! 🙏 Is there anything else I can help you with?",
                images: [],
                imageCategory: null
            };
        }

        // Default response
        return {
            text: "I'd be happy to help! 💬\n\nI can assist you with:\n• Wedding decorations\n• Birthday parties\n• Pricing information\n• Booking consultations\n• Viewing our gallery\n• Contact details\n\nWhat would you like to know more about?",
            images: [],
            imageCategory: null
        };
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = {
            type: "user",
            text: inputValue,
            timestamp: new Date(),
        };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue("");
        setIsTyping(true);

        // Save to backend
        saveChatHistory(updatedMessages);

        // Simulate AI thinking delay
        setTimeout(() => {
            const aiResponse = getAIResponse(inputValue);
            const botResponse = {
                type: "bot",
                text: aiResponse.text || aiResponse,
                images: aiResponse.images || [],
                imageCategory: aiResponse.imageCategory || null,
                timestamp: new Date(),
            };
            const finalMessages = [...updatedMessages, botResponse];
            setMessages(finalMessages);
            setIsTyping(false);

            // Save bot response to backend
            saveChatHistory(finalMessages);
        }, 1000 + Math.random() * 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Quick reply buttons
    const quickReplies = [
        "Wedding packages",
        "Birthday decorations",
        "View pricing",
        "Book consultation",
        "Contact details",
    ];

    const handleQuickReply = (reply) => {
        setInputValue(reply);
        setTimeout(() => handleSend(), 100);
    };

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} style={chatButton}>
                    <span style={chatButtonIcon}>💬</span>
                    {messages.length > 1 && <span style={notificationBadge}>{messages.length - 1}</span>}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={chatWindow}>
                    {/* Header */}
                    <div style={chatHeader}>
                        <div style={headerLeft}>
                            <div style={botAvatar}>🤖</div>
                            <div>
                                <div style={botName}>DecorHire Assistant</div>
                                <div style={botStatus}>
                                    <span style={onlineIndicator}></span> Online
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={closeButton}>
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={messagesContainer}>
                        {customer && messages.length > 1 && (
                            <div style={historyNotice}>
                                💾 Chat history saved - You can continue this conversation anytime!
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div key={index}>
                                <div
                                    style={{
                                        ...messageWrapper,
                                        justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                                    }}
                                >
                                    <div
                                        style={{
                                            ...messageBubble,
                                            ...(msg.type === "user" ? userBubble : botBubble),
                                        }}
                                    >
                                        <div style={messageText}>{msg.text}</div>
                                        <div style={messageTime}>
                                            {msg.timestamp.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Show recommended images if available */}
                                {msg.type === "bot" && msg.images && msg.images.length > 0 && (
                                    <div style={imageRecommendationContainer}>
                                        <div style={imageRecommendationHeader}>
                                            🖼️ <strong>Recommended Designs:</strong> {msg.imageCategory}
                                        </div>
                                        <div style={imageGrid}>
                                            {msg.images.map((img, imgIndex) => (
                                                <div key={imgIndex} style={imageCard}>
                                                    <img
                                                        src={`http://localhost:5000${img.imageUrl}`}
                                                        alt={img.title || `${msg.imageCategory} ${imgIndex + 1}`}
                                                        style={imageStyle}
                                                    />
                                                    {img.title && (
                                                        <div style={imageTitle}>{img.title}</div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div style={messageWrapper}>
                                <div style={{ ...messageBubble, ...botBubble, ...typingBubble }}>
                                    <div style={typingText}>
                                        <span style={assistantName}>DecorHire Assistant</span> is typing
                                        <span style={typingDotsContainer}>
                                            <span className="typing-dot" style={{ animationDelay: "0s" }}>.</span>
                                            <span className="typing-dot" style={{ animationDelay: "0.2s" }}>.</span>
                                            <span className="typing-dot" style={{ animationDelay: "0.4s" }}>.</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Replies */}
                    {messages.length <= 2 && (
                        <div style={quickRepliesContainer}>
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickReply(reply)}
                                    style={quickReplyButton}
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div style={inputContainer}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            style={inputField}
                        />
                        <button onClick={handleSend} style={sendButton} disabled={!inputValue.trim()}>
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

// Styles
const chatButton = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
    border: "none",
    boxShadow: "0 8px 24px rgba(155, 91, 52, 0.4)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    transition: "all 0.3s ease",
};

const chatButtonIcon = {
    fontSize: "28px",
};

const notificationBadge = {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    minWidth: "24px",
    height: "24px",
    padding: "0 6px",
    borderRadius: "50%",
    background: "#ef4444",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #fff",
};

const chatWindow = {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "380px",
    height: "600px",
    maxHeight: "calc(100vh - 100px)",
    borderRadius: "20px",
    background: "#fff",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
    overflow: "hidden",
};

const chatHeader = {
    padding: "20px",
    background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
};

const headerLeft = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
};

const botAvatar = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
};

const botName = {
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
};

const botStatus = {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
};

const onlineIndicator = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#10b981",
    display: "inline-block",
};

const closeButton = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const messagesContainer = {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    background: "#f9fafb",
};

const historyNotice = {
    padding: "10px 14px",
    marginBottom: "16px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)",
    color: "#065f46",
    fontSize: "12px",
    fontWeight: "600",
    textAlign: "center",
    border: "1px solid #86efac",
};

const messageWrapper = {
    display: "flex",
    marginBottom: "12px",
};

const messageBubble = {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "16px",
    wordWrap: "break-word",
};

const userBubble = {
    background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
    color: "#fff",
    borderBottomRightRadius: "4px",
};

const botBubble = {
    background: "#fff",
    color: "#1f2937",
    border: "1px solid #e5e7eb",
    borderBottomLeftRadius: "4px",
};

const messageText = {
    fontSize: "14px",
    lineHeight: "1.5",
    whiteSpace: "pre-line",
};

const messageTime = {
    fontSize: "10px",
    marginTop: "6px",
    opacity: 0.7,
};

const typingIndicator = {
    display: "flex",
    gap: "4px",
    padding: "4px 0",
};

const typingBubble = {
    padding: "14px 18px",
    minWidth: "180px",
};

const typingText = {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "4px",
};

const assistantName = {
    fontWeight: "700",
    color: "#9b5b34",
};

const typingDotsContainer = {
    display: "inline-flex",
    gap: "1px",
    marginLeft: "2px",
};

const quickRepliesContainer = {
    padding: "12px 20px",
    background: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
};

const quickReplyButton = {
    padding: "8px 14px",
    borderRadius: "20px",
    background: "#fff",
    border: "1px solid #9b5b34",
    color: "#9b5b34",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
};

const inputContainer = {
    padding: "16px 20px",
    background: "#fff",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "12px",
};

const inputField = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "24px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
};

const sendButton = {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #9b5b34 0%, #824b2b 100%)",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

// Image recommendation styles
const imageRecommendationContainer = {
    marginBottom: "16px",
    marginTop: "8px",
    padding: "12px",
    borderRadius: "12px",
    background: "#fff",
    border: "1px solid #e5e7eb",
};

const imageRecommendationHeader = {
    fontSize: "13px",
    fontWeight: "600",
    color: "#9b5b34",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
};

const imageGrid = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
};

const imageCard = {
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    background: "#fff",
    transition: "transform 0.2s ease, boxShadow 0.2s ease",
    cursor: "pointer",
};

const imageStyle = {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    display: "block",
};

const imageTitle = {
    padding: "6px 8px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#374151",
    background: "#f9fafb",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
};
