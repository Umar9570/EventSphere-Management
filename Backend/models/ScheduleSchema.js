const { Schema, default: mongoose } = require("mongoose");

const scheduleSchema = new Schema(
  {
    expo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expo",
      required: true
    },

    title: { type: String, required: true },
    speaker: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    room: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
