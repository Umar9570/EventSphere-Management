const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/MessageController");

// Send message
router.post("/", MessageController.sendMessage);

// Get conversation between two users
router.get("/conversation", MessageController.getConversation);

// Mark messages as delivered
router.put("/delivered", MessageController.markDelivered);

// Mark messages as seen
router.put("/seen", MessageController.markSeen);

// Get unread message count
router.get("/unread-count", MessageController.getUnreadCount);

module.exports = router;
