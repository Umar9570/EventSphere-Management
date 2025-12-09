const EventRegistration = require("../models/EventRegistrationSchema");
const Expo = require("../models/ExpoSchema");
const User = require("../models/UserSchema");
const QRCode = require("qrcode");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Generate unique QR code string
const generateQRString = (userId, expoId) => {
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(8).toString('hex');
    return `${userId}-${expoId}-${timestamp}-${randomStr}`;
};

const EventRegistrationController = {
    // ---------------- REGISTER FOR EVENT ----------------
    registerForEvent: async (req, res) => {
        try {
            const { userId, expoId } = req.body;

            if (!userId || !expoId) {
                return res.status(400).json({
                    status: false,
                    message: "User ID and Expo ID are required"
                });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    status: false,
                    message: "User not found"
                });
            }

            // Check if expo exists
            const expo = await Expo.findById(expoId);
            if (!expo) {
                return res.status(404).json({
                    status: false,
                    message: "Event not found"
                });
            }

            // Check if already registered
            const existingRegistration = await EventRegistration.findOne({
                user: userId,
                expo: expoId
            });

            if (existingRegistration) {
                return res.status(400).json({
                    status: false,
                    message: "You are already registered for this event"
                });
            }

            // Generate unique QR code string
            const qrCodeString = generateQRString(userId, expoId);

            // Generate QR code as base64 image (for response)
            const qrCodeImageBase64 = await QRCode.toDataURL(qrCodeString, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                width: 400,
                color: {
                    dark: '#1099a8',
                    light: '#FFFFFF'
                }
            });

            // Generate QR code as buffer (for email attachment)
            const qrCodeBuffer = await QRCode.toBuffer(qrCodeString, {
                errorCorrectionLevel: 'H',
                type: 'image/png',
                quality: 0.92,
                margin: 1,
                width: 400,
                color: {
                    dark: '#1099a8',
                    light: '#FFFFFF'
                }
            });

            // Create registration
            const registration = await EventRegistration.create({
                user: userId,
                expo: expoId,
                qrCode: qrCodeString
            });

            // Format date
            const formatDate = (date) => {
                return new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            };

            // Format time
            const formatTime = (time) => {
                if (!time) return "";
                const [hours, minutes] = time.split(":");
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? "PM" : "AM";
                const formattedHour = hour % 12 || 12;
                return `${formattedHour}:${minutes} ${ampm}`;
            };

            // Send email with QR code as attachment
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: `Event Registration Confirmed - ${expo.name}`,
                html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1099a8; margin: 0;">EventSphere</h1>
              <div style="background-color: #28a745; width: 60px; height: 60px; border-radius: 50%; margin: 20px auto; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 30px;">✓</span>
              </div>
            </div>
            
            <h2 style="color: #333; text-align: center; border-bottom: 2px solid #1099a8; padding-bottom: 10px;">
              Registration Successful!
            </h2>
            
            <p style="line-height: 1.6; color: #555;">
              Hello ${user.firstName} ${user.lastName},
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              You have successfully registered for the following event:
            </p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #1099a8; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1099a8; margin-top: 0;">${expo.name}</h3>
              <p style="margin: 5px 0; color: #555;">
                <strong>📍 Location:</strong> ${expo.location}
              </p>
              <p style="margin: 5px 0; color: #555;">
                <strong>📅 Date:</strong> ${formatDate(expo.date)}
              </p>
              <p style="margin: 5px 0; color: #555;">
                <strong>🕐 Time:</strong> ${formatTime(expo.startTime)} - ${formatTime(expo.endTime)}
              </p>
              ${expo.description ? `<p style="margin: 10px 0 0 0; color: #666; font-style: italic;">${expo.description}</p>` : ''}
            </div>
            
            <div style="background-color: #fff; border: 2px solid #1099a8; border-radius: 10px; padding: 20px; margin: 30px 0; text-align: center;">
              <h3 style="color: #1099a8; margin-top: 0;">Your Entry QR Code</h3>
              <p style="color: #666; margin-bottom: 20px;">
                Present this QR code at the event entrance to mark your attendance
              </p>
              <img src="cid:qrcode" alt="QR Code" style="max-width: 300px; width: 100%; height: auto; border: 4px solid #1099a8; border-radius: 10px; padding: 10px; background: white;" />
              <p style="color: #999; font-size: 12px; margin-top: 15px;">
                Registration ID: ${registration._id}
              </p>
            </div>
            
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #0c5460; font-size: 14px;">
                <strong>💡 Tip:</strong> Save this email or take a screenshot of the QR code. You can also access your QR code from your dashboard.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                 style="background-color: #1099a8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View in Dashboard
              </a>
            </div>
            
            <p style="line-height: 1.6; color: #555;">
              We look forward to seeing you at the event!
            </p>
            
            <p style="line-height: 1.6; color: #555;">
              Best regards,<br/>
              <strong>The EventSphere Team</strong>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center;">
              <p>© ${new Date().getFullYear()} EventSphere. All rights reserved.</p>
              <p>
                Need help? Contact us at 
                <a href="mailto:${process.env.EMAIL_USER}" style="color: #1099a8; text-decoration: none;">
                  ${process.env.EMAIL_USER}
                </a>
              </p>
            </div>
          </div>
        </div>
      `,
                attachments: [
                    {
                        filename: 'qrcode.png',
                        content: qrCodeBuffer,
                        cid: 'qrcode' // same cid value as in the html img src
                    }
                ]
            };

            await transporter.sendMail(mailOptions);

            res.json({
                status: true,
                message: "Registration successful! Check your email for the QR code.",
                registration: {
                    _id: registration._id,
                    qrCode: qrCodeString,
                    qrCodeImage: qrCodeImageBase64 // For showing in modal
                }
            });
        } catch (err) {
            console.error("Register for event error:", err);

            // Handle duplicate registration error
            if (err.code === 11000) {
                return res.status(400).json({
                    status: false,
                    message: "You are already registered for this event"
                });
            }

            res.status(500).json({
                status: false,
                message: "Server error. Please try again later."
            });
        }
    },

    // ---------------- MARK ATTENDANCE ----------------
    markAttendance: async (req, res) => {
        try {
            const { qrCode } = req.body;

            if (!qrCode) {
                return res.status(400).json({
                    status: false,
                    message: "QR code is required"
                });
            }

            // Find registration by QR code
            const registration = await EventRegistration.findOne({ qrCode })
                .populate('user', 'firstName lastName email phone')
                .populate('expo', 'name date startTime endTime location description');

            if (!registration) {
                return res.status(404).json({
                    status: false,
                    message: "Invalid QR code. Registration not found.",
                    type: "invalid"
                });
            }

            const expo = registration.expo;
            const user = registration.user;

            if (!expo || !user) {
                return res.status(404).json({
                    status: false,
                    message: "Expo or user data not found",
                    type: "error"
                });
            }

            // Get current date and time
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const expoDate = new Date(expo.date);
            const expoDateOnly = new Date(expoDate.getFullYear(), expoDate.getMonth(), expoDate.getDate());

            // Parse expo times
            const [startHour, startMinute] = expo.startTime.split(':').map(Number);
            const [endHour, endMinute] = expo.endTime.split(':').map(Number);

            const expoStart = new Date(expoDateOnly);
            expoStart.setHours(startHour, startMinute, 0, 0);

            const expoEnd = new Date(expoDateOnly);
            expoEnd.setHours(endHour, endMinute, 0, 0);

            // Format time helper
            const formatTime = (time) => {
                if (!time) return "";
                const [hours, minutes] = time.split(":");
                const hour = parseInt(hours);
                const ampm = hour >= 12 ? "PM" : "AM";
                const formattedHour = hour % 12 || 12;
                return `${formattedHour}:${minutes} ${ampm}`;
            };

            // Format date helper
            const formatDate = (date) => {
                return new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            };

            // Prepare user and expo info for response
            const userInfo = {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phone || 'N/A'
            };

            const expoInfo = {
                name: expo.name,
                location: expo.location,
                date: formatDate(expo.date),
                time: `${formatTime(expo.startTime)} - ${formatTime(expo.endTime)}`,
                description: expo.description || ''
            };

            // Check if expo date is in the past
            if (today > expoDateOnly) {
                return res.json({
                    status: false,
                    message: "This expo has already ended.",
                    type: "ended",
                    userInfo,
                    expoInfo,
                    attendedAt: registration.attendedAt,
                    alreadyAttended: registration.attended
                });
            }

            // Check if expo date is in the future
            if (today < expoDateOnly) {
                const daysUntil = Math.ceil((expoDateOnly - today) / (1000 * 60 * 60 * 24));
                return res.json({
                    status: false,
                    message: `This expo hasn't started yet. It starts in ${daysUntil} day${daysUntil > 1 ? 's' : ''}.`,
                    type: "future",
                    userInfo,
                    expoInfo,
                    daysUntil
                });
            }

            // Expo is today - check time
            const currentTime = now.getTime();
            const startTime = expoStart.getTime();
            const endTime = expoEnd.getTime();

            // Check if user is too early (more than 30 minutes before start)
            const earlyBuffer = 30 * 60 * 1000; // 30 minutes in milliseconds
            if (currentTime < startTime - earlyBuffer) {
                const minutesUntilStart = Math.ceil((startTime - currentTime) / (1000 * 60));
                return res.json({
                    status: false,
                    message: `You're too early! The expo starts in ${minutesUntilStart} minutes.`,
                    type: "early",
                    userInfo,
                    expoInfo,
                    minutesUntilStart
                });
            }

            // Check if expo has ended
            if (currentTime > endTime) {
                return res.json({
                    status: false,
                    message: "The expo has ended for today.",
                    type: "ended",
                    userInfo,
                    expoInfo,
                    attendedAt: registration.attendedAt,
                    alreadyAttended: registration.attended
                });
            }

            // Check if already attended
            if (registration.attended) {
                return res.json({
                    status: true,
                    message: "Attendance was already marked for this expo.",
                    type: "already_attended",
                    userInfo,
                    expoInfo,
                    attendedAt: registration.attendedAt,
                    alreadyAttended: true
                });
            }

            // All checks passed - Mark attendance
            registration.attended = true;
            registration.attendedAt = now;
            await registration.save();

            // Update user status
            await User.findByIdAndUpdate(user._id, {
                status: 'Attended'
            });

            res.json({
                status: true,
                message: "Attendance marked successfully! Welcome to the expo.",
                type: "success",
                userInfo,
                expoInfo,
                attendedAt: now,
                alreadyAttended: false
            });
        } catch (err) {
            console.error("Mark attendance error:", err);
            res.status(500).json({
                status: false,
                message: "Server error. Please try again.",
                type: "error"
            });
        }
    },

    // ---------------- GET USER REGISTRATIONS ----------------
    getUserRegistrations: async (req, res) => {
        try {
            const { userId } = req.params;

            const registrations = await EventRegistration.find({ user: userId })
                .populate('expo', 'name date startTime endTime location description')
                .sort({ createdAt: -1 });

            res.json({
                status: true,
                registrations
            });
        } catch (err) {
            console.error("Get user registrations error:", err);
            res.status(500).json({
                status: false,
                message: "Server error"
            });
        }
    },

        // ---------------- GET ALL REGISTRATIONS (Admin) ----------------
    getAllRegistrations: async (req, res) => {
    try {
        const { expoId } = req.query;

        let query = {};
        if (expoId && expoId !== 'all') {
        query.expo = expoId;
        }

        const registrations = await EventRegistration.find(query)
        .populate('user', 'firstName lastName email phone status')
        .populate('expo', 'name date location')
        .sort({ createdAt: -1 });

        res.json({
        status: true,
        registrations
        });
    } catch (err) {
        console.error("Get all registrations error:", err);
        res.status(500).json({
        status: false,
        message: "Server error"
        });
    }
    },

    // ---------------- CHECK REGISTRATION STATUS ----------------
    checkRegistrationStatus: async (req, res) => {
        try {
            const { userId, expoId } = req.params;

            const registration = await EventRegistration.findOne({
                user: userId,
                expo: expoId
            });

            res.json({
                status: true,
                isRegistered: !!registration,
                registration
            });
        } catch (err) {
            console.error("Check registration status error:", err);
            res.status(500).json({
                status: false,
                message: "Server error"
            });
        }
    }
};

module.exports = EventRegistrationController;