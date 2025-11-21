const { Schema, model } = require("mongoose");

const scheduleSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    expo: { type: Schema.Types.ObjectId, ref: "Expo", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Schedule", scheduleSchema);
