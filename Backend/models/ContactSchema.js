const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    userType: { type: String, required: true, enum: ['attendee', 'exhibitor'] },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'read', 'replied'], default: 'pending' },
    replied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = model("Contact", contactSchema);