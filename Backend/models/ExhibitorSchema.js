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
    boothNumber: { type: String },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo"
    },

    bio: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exhibitor", exhibitorSchema);
