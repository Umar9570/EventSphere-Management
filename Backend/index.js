const express = require("express");
const ConnectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT']
    }
});

app.use(express.json());
app.use(cors());

ConnectDB();

// Routes
app.use("/api/auth", require("./routes/AuthRoutes"));
app.use("/api/expos", require("./routes/ExpoRoutes"));
app.use("/api/booths", require("./routes/BoothRoutes"));
app.use("/api/exhibitors", require("./routes/ExhibitorRoutes"));
app.use("/api/attendees", require("./routes/AttendeeRoutes"));
app.use("/api/schedule", require("./routes/ScheduleRoutes"));
app.use("/api/messages", require("./routes/MessageRoutes"));

// --------- Socket.io Setup ---------
const Message = require("./models/MessageSchema");
const User = require("./models/UserSchema");
const Expo = require("./models/ExpoSchema");
const Exhibitor = require("./models/ExhibitorSchema");

// Map to store connected users by userId
const userSocketMap = new Map();

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    // Join a room for a specific expo AND map userId to socketId
    socket.on("joinExpo", ({ userId, expoId }) => {
        if (userId) {
            userSocketMap.set(userId, socket.id);
            socket.join(userId); // Join a room specific to the user for direct messaging
            socket.join(expoId);
            console.log(`User ${userId} joined expo ${expoId}.`);
        }
    });

    // Send message
    socket.on("sendMessage", async ({ sender, receiver, expo, content }) => {
        try {
            if (!sender || !receiver || !expo || !content) {
                return; // Silently ignore or send error back to sender socket
            }
            
            // --- Validation/Authorization Check (Mirroring REST logic) ---
            const expoExists = await Expo.findById(expo);
            if (!expoExists) return;

            const senderUser = await User.findById(sender);
            const receiverUser = await User.findById(receiver);

            if (!senderUser || !receiverUser) return;

            // Validate sender
            if (senderUser.role === "exhibitor") {
                const exhibitorData = await Exhibitor.findOne({ user: sender });
                if (!exhibitorData || String(exhibitorData.expo) !== String(expo))
                    return;
                if (exhibitorData.status !== "approved")
                    return;
            }

            // Validate receiver
            if (receiverUser.role === "exhibitor") {
                const targetExhibitor = await Exhibitor.findOne({ user: receiver });
                if (!targetExhibitor || String(targetExhibitor.expo) !== String(expo))
                    return;
                if (targetExhibitor.status !== "approved")
                    return;
            }
            // --- End Validation ---

            // Create message
            const message = await Message.create({ sender, receiver, expo, content });

            // Emit to receiver's personal room (Fix 1: Targeted emission)
            io.to(receiver).emit("receiveMessage", message);

            // Emit to sender's personal room for immediate display (optional, but common)
            io.to(sender).emit("receiveMessage", message);

        } catch (err) {
            console.error(err);
        }
    });

    // Mark messages as delivered
    socket.on("markDelivered", async ({ messageIds, userId, senderId }) => {
        try {
            if (!messageIds || !messageIds.length || !userId || !senderId) return;

            // CRITICAL FIX: Ensure only the receiver (userId) can mark as delivered
            await Message.updateMany(
                { _id: { $in: messageIds }, delivered: false, receiver: userId },
                { delivered: true, deliveredAt: new Date() }
            );
            
            // Emit only to the original sender's room (Fix 2: Targeted emission)
            io.to(senderId).emit("messagesDelivered", messageIds);

        } catch (err) {
            console.error(err);
        }
    });

    // Mark messages as seen
    socket.on("markSeen", async ({ messageIds, userId, senderId }) => {
        try {
            if (!messageIds || !messageIds.length || !userId || !senderId) return;

            // CRITICAL FIX: Ensure only the receiver (userId) can mark as seen
            await Message.updateMany(
                { _id: { $in: messageIds }, seen: false, receiver: userId },
                { seen: true, seenAt: new Date(), unread: false }
            );

            // Emit only to the original sender's room (Fix 3: Targeted emission)
            io.to(senderId).emit("messagesSeen", messageIds);

        } catch (err) {
            console.error(err);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Remove user from the map upon disconnect
        userSocketMap.forEach((value, key) => {
            if (value === socket.id) {
                userSocketMap.delete(key);
            }
        });
    });
});

http.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})