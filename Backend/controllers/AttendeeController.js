const AttendeeModel = require("../models/AttendeeSchema");
const UserModel = require("../models/UserSchema");

const AttendeeController = {
    // ---------------- GET ALL ATTENDEES ----------------
    getAllAttendees: async (req, res) => {
        try {
            const attendees = await AttendeeModel.find()
                .populate("user");
            res.json({ attendees, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET ATTENDEE BY ID ----------------
    getAttendeeById: async (req, res) => {
        try {
            const attendee = await AttendeeModel.findById(req.params.id)
                .populate("user");

            if (!attendee)
                return res.json({ message: "Attendee not found", status: false });

            res.json({ attendee, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET ATTENDEES BY EXPO ----------------
    getAttendeesByExpo: async (req, res) => {
        try {
            const { expoId } = req.params;

            const attendees = await AttendeeModel.find({ expo: expoId })
                .populate("user");

            res.json({ attendees, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE ATTENDEE ----------------
    updateAttendee: async (req, res) => {
        try {
            const attendee = await AttendeeModel.findById(req.params.id);
            if (!attendee)
                return res.json({ message: "Attendee not found", status: false });

            // Update linked user profile data
            await UserModel.findByIdAndUpdate(attendee.user, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
            });

            const updated = await AttendeeModel.findById(req.params.id)
                .populate("user");

            res.json({ message: "Attendee updated", attendee: updated, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- DELETE ATTENDEE ----------------
    deleteAttendee: async (req, res) => {
        try {
            const attendee = await AttendeeModel.findById(req.params.id);
            if (!attendee)
                return res.json({ message: "Attendee not found", status: false });

            // Delete user as well (linked)
            await UserModel.findByIdAndDelete(attendee.user);

            // Delete attendee record
            await attendee.deleteOne();

            res.json({ message: "Attendee deleted", status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- MARK ATTENDANCE VIA QR ----------------
    markAttendance: async (req, res) => {
        try {
            const { attendeeId } = req.body;

            const attendee = await AttendeeModel.findById(attendeeId)
                .populate("user");

            if (!attendee)
                return res.json({ message: "Attendee not found", status: false });

            if (attendee.user.status === "Attended") {
                return res.json({
                    message: "Attendee already marked as attended",
                    status: false,
                });
            }

            attendee.user.status = "Attended";
            await attendee.user.save();

            res.json({
                message: "Attendance marked successfully",
                attendee,
                status: true,
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },
};

module.exports = AttendeeController;
