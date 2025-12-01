const { Schema, default: mongoose } = require("mongoose");

const messageSchema = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        expo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expo",
            required: false
        },

        content: { type: String, required: true },

        delivered: { type: Boolean, default: false },
        seen: { type: Boolean, default: false },

        deliveredAt: { type: Date },
        seenAt: { type: Date },

        unread: { type: Boolean, default: true } // helps with badge count
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
