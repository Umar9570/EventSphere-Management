const Message = require("../models/MessageSchema");
const Exhibitor = require("../models/ExhibitorSchema");
const Expo = require("../models/ExpoSchema");
const User = require("../models/UserSchema");

const MessageController = {

    // ---------------- SEND MESSAGE ----------------
    sendMessage: async (req, res) => {
        try {
            const { sender, receiver, expo, content } = req.body;

            if (!sender || !receiver || !expo || !content) {
                return res.json({ status: false, message: "Missing fields" });
            }

            const expoExists = await Expo.findById(expo);
            if (!expoExists) return res.json({ status: false, message: "Expo not found" });

            const senderUser = await User.findById(sender);
            const receiverUser = await User.findById(receiver);

            if (!senderUser || !receiverUser) {
                return res.json({ status: false, message: "Sender or Receiver not found" });
            }

            // Validate sender
            if (senderUser.role === "exhibitor") {
                const exhibitorData = await Exhibitor.findOne({ user: sender });
                if (!exhibitorData || String(exhibitorData.expo) !== String(expo))
                    return res.json({ status: false, message: "You are not part of this expo" });
                if (exhibitorData.status !== "approved")
                    return res.json({ status: false, message: "Only approved exhibitors can send messages" });
            }

            // Validate receiver
            if (receiverUser.role === "exhibitor") {
                const targetExhibitor = await Exhibitor.findOne({ user: receiver });
                if (!targetExhibitor || String(targetExhibitor.expo) !== String(expo))
                    return res.json({ status: false, message: "Receiver is not part of your expo" });
                if (targetExhibitor.status !== "approved")
                    return res.json({ status: false, message: "Receiver is not approved" });
            }

            // Create message
            const message = await Message.create({
                sender,
                receiver,
                expo,
                content,
                delivered: false,
                seen: false,
                unread: true
            });

            res.json({ status: true, message: "Message sent", data: message });

        } catch (err) {
            res.status(500).json({ status: false, message: err.message });
        }
    },

    // ---------------- GET CONVERSATION ----------------
    getConversation: async (req, res) => {
        try {
            const { user1, user2, expo } = req.query;

            if (!user1 || !user2 || !expo) {
                return res.json({ status: false, message: "Missing parameters" });
            }

            const messages = await Message.find({
                expo,
                $or: [
                    { sender: user1, receiver: user2 },
                    { sender: user2, receiver: user1 }
                ]
            })
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

            if (result.nModified === 0) {
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

            if (result.nModified === 0) {
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
            const { userId, expo } = req.query;

            const count = await Message.countDocuments({
                receiver: userId,
                expo,
                unread: true
            });

            res.json({ status: true, unreadCount: count });
        } catch (err) {
            res.status(500).json({ status: false, message: err.message });
        }
    }
};

module.exports = MessageController;