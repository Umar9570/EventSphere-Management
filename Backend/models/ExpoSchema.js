const { Schema, default: mongoose } = require("mongoose");

const expoSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    image: { type: String, default: "" }, // URL from cloud storage

    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    exhibitors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exhibitor" }],
    schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expo", expoSchema);