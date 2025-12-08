const Contact = require("../models/ContactSchema");
const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD // Your email password or app password
  }
});

const ContactController = {
  // ---------------- SUBMIT CONTACT FORM ----------------
  submitContact: async (req, res) => {
    try {
      const { name, email, subject, userType, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !userType || !message) {
        return res.status(400).json({ 
          status: false, 
          message: "All fields are required" 
        });
      }

      // Save to database
      const contactMessage = await Contact.create({
        name,
        email,
        subject,
        userType,
        message
      });

      // Send email to admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Admin email
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
              <h2 style="color: #1099a8; border-bottom: 2px solid #1099a8; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 10px 0;"><strong>User Type:</strong> ${userType}</p>
                <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #1099a8;">
                <p style="margin: 0;"><strong>Message:</strong></p>
                <p style="margin: 10px 0; line-height: 1.6;">${message}</p>
              </div>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>Submitted at: ${new Date().toLocaleString()}</p>
                <p>Reply to: <a href="mailto:${email}">${email}</a></p>
              </div>
            </div>
          </div>
        `
      };

      // Send confirmation email to user
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting EventSphere',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
              <h2 style="color: #1099a8; border-bottom: 2px solid #1099a8; padding-bottom: 10px;">
                Thank You for Contacting Us!
              </h2>
              
              <p style="line-height: 1.6;">Hi ${name},</p>
              
              <p style="line-height: 1.6;">
                Thank you for reaching out to EventSphere. We have received your message and will get back to you as soon as possible.
              </p>
              
              <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #1099a8;">
                <p style="margin: 0;"><strong>Your message:</strong></p>
                <p style="margin: 10px 0; line-height: 1.6;">${message}</p>
              </div>
              
              <p style="line-height: 1.6;">
                Our team typically responds within 24-48 hours during business days.
              </p>
              
              <p style="line-height: 1.6;">
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

      // Send both emails
      try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Continue even if email fails - message is saved in DB
      }

      res.json({
        status: true,
        message: "Message sent successfully! We'll get back to you soon.",
        contact: contactMessage
      });
    } catch (err) {
      console.error("Submit contact error:", err);
      res.status(500).json({ 
        status: false, 
        message: "Server error. Please try again later." 
      });
    }
  },

  // ---------------- GET ALL CONTACT MESSAGES (Admin) ----------------
  getAllContacts: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json({ status: true, contacts });
    } catch (err) {
      console.error("Get contacts error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    }
  },

  // ---------------- UPDATE CONTACT STATUS (Admin) ----------------
  updateContactStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, replied } = req.body;

      const contact = await Contact.findByIdAndUpdate(
        id,
        { status, replied },
        { new: true }
      );

      if (!contact) {
        return res.status(404).json({ status: false, message: "Contact not found" });
      }

      res.json({ status: true, contact });
    } catch (err) {
      console.error("Update contact status error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    }
  },

  // ---------------- DELETE CONTACT MESSAGE (Admin) ----------------
  deleteContact: async (req, res) => {
    try {
      const { id } = req.params;

      const contact = await Contact.findByIdAndDelete(id);

      if (!contact) {
        return res.status(404).json({ status: false, message: "Contact not found" });
      }

      res.json({ status: true, message: "Contact deleted successfully" });
    } catch (err) {
      console.error("Delete contact error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    }
  }
};

module.exports = ContactController;