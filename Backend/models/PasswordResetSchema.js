const { Schema, model } = require("mongoose");

const passwordResetSchema = new Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Auto-delete expired codes after 2 minutes
passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 120 });

module.exports = model("PasswordReset", passwordResetSchema);