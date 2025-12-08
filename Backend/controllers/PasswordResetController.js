const User = require("../models/UserSchema");
const PasswordReset = require("../models/PasswordResetSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Generate 4-digit code
const generateCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const PasswordResetController = {
  // ---------------- SEND RESET CODE ----------------
  sendResetCode: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          status: false, 
          message: "Email is required" 
        });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ 
          status: false, 
          message: "No account found with this email address" 
        });
      }

      // Delete any existing reset codes for this email
      await PasswordReset.deleteMany({ email });

      // Generate 4-digit code
      const code = generateCode();

      // Set expiry time (1 minute from now)
      const expiresAt = new Date(Date.now() + 60 * 1000); // 1 minute

      // Save reset code
      await PasswordReset.create({
        email,
        code,
        expiresAt
      });

      // Send email with code
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Code - EventSphere',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1099a8; margin: 0;">EventSphere</h1>
              </div>
              
              <h2 style="color: #333; border-bottom: 2px solid #1099a8; padding-bottom: 10px;">
                Password Reset Request
              </h2>
              
              <p style="line-height: 1.6; color: #555;">
                Hello ${user.firstName},
              </p>
              
              <p style="line-height: 1.6; color: #555;">
                We received a request to reset your password. Use the code below to reset your password:
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #1099a8; padding: 20px; margin: 30px 0; text-align: center;">
                <p style="margin: 0; color: #666; font-size: 14px;">Your verification code is:</p>
                <h1 style="margin: 15px 0; color: #1099a8; font-size: 48px; letter-spacing: 10px; font-weight: bold;">
                  ${code}
                </h1>
                <p style="margin: 0; color: #999; font-size: 12px;">
                  ⏰ This code will expire in <strong style="color: #dc3545;">1 minute</strong>
                </p>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email or contact our support team.
                </p>
              </div>
              
              <p style="line-height: 1.6; color: #555;">
                Best regards,<br/>
                <strong>The EventSphere Team</strong>
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center;">
                <p>© ${new Date().getFullYear()} EventSphere. All rights reserved.</p>
                <p>
                  <a href="mailto:${process.env.EMAIL_USER}" style="color: #1099a8; text-decoration: none;">
                    ${process.env.EMAIL_USER}
                  </a>
                </p>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      res.json({
        status: true,
        message: "Reset code sent to your email",
        email: email
      });
    } catch (err) {
      console.error("Send reset code error:", err);
      res.status(500).json({ 
        status: false, 
        message: "Server error. Please try again later." 
      });
    }
  },

  // ---------------- VERIFY CODE ----------------
  verifyCode: async (req, res) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ 
          status: false, 
          message: "Email and code are required" 
        });
      }

      // Find valid reset code
      const resetRequest = await PasswordReset.findOne({
        email,
        code,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!resetRequest) {
        return res.status(400).json({ 
          status: false, 
          message: "Invalid or expired code" 
        });
      }

      res.json({
        status: true,
        message: "Code verified successfully"
      });
    } catch (err) {
      console.error("Verify code error:", err);
      res.status(500).json({ 
        status: false, 
        message: "Server error. Please try again later." 
      });
    }
  },

  // ---------------- RESET PASSWORD ----------------
  resetPassword: async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;

      if (!email || !code || !newPassword) {
        return res.status(400).json({ 
          status: false, 
          message: "Email, code, and new password are required" 
        });
      }

      // Validate password length
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          status: false, 
          message: "Password must be at least 6 characters long" 
        });
      }

      // Find valid reset code
      const resetRequest = await PasswordReset.findOne({
        email,
        code,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      if (!resetRequest) {
        return res.status(400).json({ 
          status: false, 
          message: "Invalid or expired code" 
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ 
          status: false, 
          message: "User not found" 
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      user.password = hashedPassword;
      await user.save();

      // Mark code as used
      resetRequest.isUsed = true;
      await resetRequest.save();

      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Successful - EventSphere',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #28a745; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 30px;">✓</span>
                </div>
              </div>
              
              <h2 style="color: #333; text-align: center;">Password Reset Successful!</h2>
              
              <p style="line-height: 1.6; color: #555;">
                Hello ${user.firstName},
              </p>
              
              <p style="line-height: 1.6; color: #555;">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                   style="background-color: #1099a8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Log In Now
                </a>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong> If you didn't make this change, please contact our support team immediately.
                </p>
              </div>
              
              <p style="line-height: 1.6; color: #555;">
                Best regards,<br/>
                <strong>The EventSphere Team</strong>
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center;">
                <p>© ${new Date().getFullYear()} EventSphere. All rights reserved.</p>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      res.json({
        status: true,
        message: "Password reset successfully"
      });
    } catch (err) {
      console.error("Reset password error:", err);
      res.status(500).json({ 
        status: false, 
        message: "Server error. Please try again later." 
      });
    }
  },

  // ---------------- RESEND CODE ----------------
  resendCode: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          status: false, 
          message: "Email is required" 
        });
      }

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ 
          status: false, 
          message: "No account found with this email address" 
        });
      }

      // Delete existing codes
      await PasswordReset.deleteMany({ email });

      // Generate new code
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 60 * 1000);

      // Save new code
      await PasswordReset.create({
        email,
        code,
        expiresAt
      });

      // Send email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Code - EventSphere',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
              <h2 style="color: #1099a8;">Password Reset Code</h2>
              <p>Your new verification code is:</p>
              <div style="background-color: #f8f9fa; border-left: 4px solid #1099a8; padding: 20px; margin: 20px 0; text-align: center;">
                <h1 style="color: #1099a8; font-size: 48px; letter-spacing: 10px; margin: 0;">${code}</h1>
                <p style="color: #999; font-size: 12px; margin-top: 10px;">This code will expire in 1 minute</p>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      res.json({
        status: true,
        message: "New code sent to your email"
      });
    } catch (err) {
      console.error("Resend code error:", err);
      res.status(500).json({ 
        status: false, 
        message: "Server error. Please try again later." 
      });
    }
  }
};

module.exports = PasswordResetController;