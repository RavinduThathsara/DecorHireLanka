// backend/src/models/ChatHistory.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["user", "bot"],
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const chatHistorySchema = new mongoose.Schema(
    {
        sessionId: {
            type: String,
            required: true,
            index: true,
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            default: null,
        },
        customerEmail: {
            type: String,
            default: null,
        },
        messages: [messageSchema],
        lastActivity: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Index for faster queries
chatHistorySchema.index({ sessionId: 1 });
chatHistorySchema.index({ customerId: 1 });
chatHistorySchema.index({ customerEmail: 1 });

export default mongoose.model("ChatHistory", chatHistorySchema);
