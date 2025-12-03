const { Schema, default: mongoose } = require("mongoose");

const exhibitorSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    organization: { type: String, required: true },
    booth: { type: mongoose.Schema.Types.ObjectId, ref: "Booth", default: null },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo"
    },

    bio: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exhibitor", exhibitorSchema);
