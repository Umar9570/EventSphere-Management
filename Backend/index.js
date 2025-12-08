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
app.use("/api/contact", require("./routes/ContactRoutes"));
app.use("/api/password-reset", require('./routes/PasswordResetRoutes'));
app.use("/api/event-registration", require('./routes/EventRegistrationRoutes'));

// --------- Socket.io Setup ---------
const Message = require("./models/MessageSchema");
const User = require("./models/UserSchema");
const Expo = require("./models/ExpoSchema");
const Exhibitor = require("./models/ExhibitorSchema");

// Map to store connected users by userId
// store multiple sockets per user
const userSockets = new Map();

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("joinExpo", async ({ userId, expoId }) => {
    if (!userId) return;

    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);

    socket.join(userId); // personal room

    // Always join current expo
    if (expoId) socket.join(expoId);

    // For organizers: join ALL expos they manage
    try {
        const user = await User.findById(userId);
        if (user?.role === "organizer") {
            const expos = await Expo.find({ organizer: userId });
            expos.forEach((e) => socket.join(e._id.toString()));
        }
    } catch (err) {
        console.error("Error joining all organizer expos:", err);
    }

    console.log(`User ${userId} joined expo ${expoId}`);
});


    socket.on("sendMessage", (message) => {
        const receiverId = message.receiver._id || message.receiver;
        if (!receiverId) return;

        // send to all sockets of receiver
        const sockets = userSockets.get(receiverId);
        if (sockets) {
            sockets.forEach((sid) => io.to(sid).emit("receiveMessage", message));
        }
    });

    socket.on("markDelivered", ({ messageIds, userId, senderId }) => {
        if (!messageIds?.length || !userId || !senderId) return;

        Message.updateMany(
            { _id: { $in: messageIds }, delivered: false, receiver: userId },
            { delivered: true, deliveredAt: new Date() }
        )
        .then(() => {
            const sockets = userSockets.get(senderId);
            if (sockets) {
                sockets.forEach((sid) => io.to(sid).emit("messagesDelivered", messageIds));
            }
        })
        .catch(console.error);
    });

    socket.on("markSeen", ({ messageIds, userId, senderId }) => {
        if (!messageIds?.length || !userId || !senderId) return;

        Message.updateMany(
            { _id: { $in: messageIds }, seen: false, receiver: userId },
            { seen: true, seenAt: new Date(), unread: false }
        )
        .then(() => {
            const sockets = userSockets.get(senderId);
            if (sockets) {
                sockets.forEach((sid) => io.to(sid).emit("messagesSeen", messageIds));
            }
        })
        .catch(console.error);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        userSockets.forEach((sids, userId) => {
            sids.delete(socket.id);
            if (!sids.size) userSockets.delete(userId);
        });
    });
});

http.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})