const { Schema, default: mongoose } = require("mongoose");

const attendeeSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schedule"
      }
    ],

    interests: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendee", attendeeSchema);
