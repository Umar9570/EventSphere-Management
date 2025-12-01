const Message = require("../models/MessageSchema");
const Exhibitor = require("../models/ExhibitorSchema");
const Expo = require("../models/ExpoSchema");
const User = require("../models/UserSchema");

const MessageController = {

    // ---------------- SEND MESSAGE ----------------
    sendMessage: async (req, res) => {
        try {
            const { sender, receiver, expo, content } = req.body;

            if (!sender || !receiver || !content) {
                return res.json({ status: false, message: "Missing fields" });
            }

            const senderUser = await User.findById(sender);
            const receiverUser = await User.findById(receiver);

            if (!senderUser || !receiverUser) {
                return res.json({ status: false, message: "Sender or Receiver not found" });
            }

            // Only validate expo if sender is not organizer
            if (senderUser.role !== "organizer") {
                if (!expo) return res.json({ status: false, message: "Expo is required" });

                const expoExists = await Expo.findById(expo);
                if (!expoExists) return res.json({ status: false, message: "Expo not found" });
            }

            // Validate sender (exhibitor)
            if (senderUser.role === "exhibitor") {
                const exhibitorData = await Exhibitor.findOne({ user: sender });
                if (!exhibitorData || String(exhibitorData.expo) !== String(expo))
                    return res.json({ status: false, message: "You are not part of this expo" });
                if (exhibitorData.status !== "approved")
                    return res.json({ status: false, message: "Only approved exhibitors can send messages" });
            }

            // Validate receiver (exhibitor)
            if (receiverUser.role === "exhibitor" && senderUser.role !== "organizer") {
                const targetExhibitor = await Exhibitor.findOne({ user: receiver });
                if (!targetExhibitor || String(targetExhibitor.expo) !== String(expo))
                    return res.json({ status: false, message: "Receiver is not part of your expo" });
                if (targetExhibitor.status !== "approved")
                    return res.json({ status: false, message: "Receiver is not approved" });
            }

            // Create message payload
            const messagePayload = {
                sender,
                receiver,
                content,
                delivered: false,
                seen: false,
                unread: true
            }

            // Include expo only if defined, otherwise omit it (important for organizer)
            if (senderUser.role !== "organizer" && expo) {
                messagePayload.expo = expo;
            }

            // Create message
            const message = await Message.create(messagePayload);

            res.json({ status: true, message: "Message sent", data: message });

        } catch (err) {
            console.error("Send message error:", err);
            res.status(500).json({ status: false, message: err.message });
        }
    },

    // ---------------- GET CONVERSATION ----------------
    getConversation: async (req, res) => {
        try {
            const { user1, user2, expo } = req.query;

            if (!user1 || !user2) {
                return res.json({ status: false, message: "Missing parameters" });
            }

            const filter = {
                $or: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 }
                ]
            };

            // Only filter by expo if a valid expo is provided
            if (expo && expo !== "undefined") {
                filter.expo = expo;
            }

            const messages = await Message.find(filter)
                .sort({ createdAt: 1 })
                .populate("sender", "firstName lastName role")
                .populate("receiver", "firstName lastName role");

            res.json({ status: true, messages });
        } catch (err) {
            res.status(500).json({ status: false, message: err.message });
        }
    },

    // ---------------- MARK DELIVERED ----------------
    markDelivered: async (req, res) => {
        try {
            const { messageIds, userId } = req.body; // Added userId to body for authorization
            if (!messageIds || !messageIds.length || !userId)
                return res.json({ status: false, message: "messageIds and userId required" });

            // CRITICAL FIX: Ensure only the actual receiver can mark messages as delivered
            const result = await Message.updateMany(
                { _id: { $in: messageIds }, delivered: false, receiver: userId },
                { delivered: true, deliveredAt: new Date() }
            );

            if (result.modifiedCount === 0) {
                return res.json({ status: true, message: "No messages updated (already delivered or unauthorized)" });
            }

            res.json({ status: true, message: "Messages marked as delivered" });
        } catch (err) {
            res.status(500).json({ status: false, message: err.message });
        }
    },

    // ---------------- MARK SEEN ----------------
    markSeen: async (req, res) => {
        try {
            const { messageIds, userId } = req.body; // Added userId to body for authorization
            if (!messageIds || !messageIds.length || !userId)
                return res.json({ status: false, message: "messageIds and userId required" });

            // CRITICAL FIX: Ensure only the actual receiver can mark messages as seen
            const result = await Message.updateMany(
                { _id: { $in: messageIds }, seen: false, receiver: userId },
                { seen: true, seenAt: new Date(), unread: false }
            );

            if (result.modifiedCount === 0) {
                return res.json({ status: true, message: "No messages updated (already seen or unauthorized)" });
            }

            res.json({ status: true, message: "Messages marked as seen" });
        } catch (err) {
            res.status(500).json({ status: false, message: err.message });
        }
    },

    // ---------------- GET UNREAD COUNT ----------------
    getUnreadCount: async (req, res) => {
        try {
            const { userId, expo, senderId } = req.query;

            if (!userId) {
                return res.status(400).json({ status: false, message: "Missing parameters" });
            }

            const query = {
                receiver: userId,
                unread: true
            };

            if (expo) query.expo = expo; // Only include expo if provided
            if (senderId) query.sender = senderId;

            const count = await Message.countDocuments(query);
            res.json({ status: true, unreadCount: count });
        } catch (err) {
            res.status(500).json({ status: false, message: err.message });
        }
    }

};

module.exports = MessageController;