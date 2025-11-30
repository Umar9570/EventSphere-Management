const express = require("express");
const ConnectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT'],
        credentials: true
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

    // Join a room for a specific user and expo
    socket.on("joinExpo", ({ userId, expoId }) => {
        if (userId) {
            userSocketMap.set(userId, socket.id);
            socket.join(userId); // personal room
            socket.join(expoId);
            console.log(`User ${userId} joined expo ${expoId}.`);
        }
    });

    // Forward message to receiver (DO NOT create in DB here!)
    socket.on("sendMessage", (message) => {
        try {
            const receiverId = message.receiver._id || message.receiver;
            if (receiverId) {
                io.to(receiverId).emit("receiveMessage", message);
            }
        } catch (err) {
            console.error("Socket sendMessage error:", err);
        }
    });

    // Mark messages as delivered
    socket.on("markDelivered", ({ messageIds, userId, senderId }) => {
        if (!messageIds?.length || !userId || !senderId) return;

        Message.updateMany(
            { _id: { $in: messageIds }, delivered: false, receiver: userId },
            { delivered: true, deliveredAt: new Date() }
        )
        .then(() => {
            io.to(senderId).emit("messagesDelivered", messageIds);
        })
        .catch(console.error);
    });

    // Mark messages as seen
    socket.on("markSeen", ({ messageIds, userId, senderId }) => {
        if (!messageIds?.length || !userId || !senderId) return;

        Message.updateMany(
            { _id: { $in: messageIds }, seen: false, receiver: userId },
            { seen: true, seenAt: new Date(), unread: false }
        )
        .then(() => {
            io.to(senderId).emit("messagesSeen", messageIds);
        })
        .catch(console.error);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        userSocketMap.forEach((value, key) => {
            if (value === socket.id) userSocketMap.delete(key);
        });
    });
});


http.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})