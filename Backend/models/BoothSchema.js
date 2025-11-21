const { Schema, default: mongoose } = require("mongoose");

const boothSchema = new Schema(
  {
    boothNumber: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibitor",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booth", boothSchema);
