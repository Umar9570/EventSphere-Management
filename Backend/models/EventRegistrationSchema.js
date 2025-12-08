const { Schema, model } = require("mongoose");

const eventRegistrationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expo: {
      type: Schema.Types.ObjectId,
      ref: "Expo",
      required: true
    },
    qrCode: {
      type: String,
      required: true,
      unique: true
    },
    attended: {
      type: Boolean,
      default: false
    },
    attendedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations
eventRegistrationSchema.index({ user: 1, expo: 1 }, { unique: true });

module.exports = model("EventRegistration", eventRegistrationSchema);