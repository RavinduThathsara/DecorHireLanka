// backend/src/routes/chatRoutes.js
import express from "express";
import ChatHistory from "../models/ChatHistory.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Save or update chat messages
router.post("/save", async (req, res) => {
    try {
        const { sessionId, messages, customerEmail } = req.body;

        if (!sessionId || !messages) {
            return res.status(400).json({ message: "Session ID and messages are required" });
        }

        let chatHistory = await ChatHistory.findOne({ sessionId });

        if (chatHistory) {
            // Update existing chat
            chatHistory.messages = messages;
            chatHistory.lastActivity = new Date();
            if (customerEmail) {
                chatHistory.customerEmail = customerEmail;
            }
        } else {
            // Create new chat history
            chatHistory = new ChatHistory({
                sessionId,
                messages,
                customerEmail: customerEmail || null,
                lastActivity: new Date(),
            });
        }

        await chatHistory.save();

        res.status(200).json({
            message: "Chat history saved successfully",
            chatHistory,
        });
    } catch (error) {
        console.error("Error saving chat history:", error);
        res.status(500).json({ message: "Failed to save chat history" });
    }
});

// Get chat history by session ID
router.get("/history/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;

        const chatHistory = await ChatHistory.findOne({ sessionId });

        if (!chatHistory) {
            return res.status(200).json({ messages: [] });
        }

        res.status(200).json({
            messages: chatHistory.messages,
            lastActivity: chatHistory.lastActivity,
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        res.status(500).json({ message: "Failed to fetch chat history" });
    }
});

// Get chat history for logged-in customer
router.get("/my-chats", requireAuth, async (req, res) => {
    try {
        const customerEmail = req.user.email;

        const chatHistories = await ChatHistory.find({
            customerEmail,
        }).sort({ lastActivity: -1 });

        res.status(200).json({
            chatHistories,
        });
    } catch (error) {
        console.error("Error fetching customer chat history:", error);
        res.status(500).json({ message: "Failed to fetch chat history" });
    }
});

// Link anonymous chat to logged-in user
router.post("/link-user", requireAuth, async (req, res) => {
    try {
        const { sessionId } = req.body;
        const customerId = req.user._id;
        const customerEmail = req.user.email;

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const chatHistory = await ChatHistory.findOne({ sessionId });

        if (chatHistory) {
            chatHistory.customerId = customerId;
            chatHistory.customerEmail = customerEmail;
            await chatHistory.save();

            res.status(200).json({
                message: "Chat history linked to user successfully",
                chatHistory,
            });
        } else {
            res.status(404).json({ message: "Chat history not found" });
        }
    } catch (error) {
        console.error("Error linking chat to user:", error);
        res.status(500).json({ message: "Failed to link chat history" });
    }
});

// Delete chat history
router.delete("/delete/:sessionId", async (req, res) => {
    try {
        const { sessionId } = req.params;

        await ChatHistory.findOneAndDelete({ sessionId });

        res.status(200).json({ message: "Chat history deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat history:", error);
        res.status(500).json({ message: "Failed to delete chat history" });
    }
});

export default router;
