const AttendeeModel = require("../models/AttendeeSchema");
const UserModel = require("../models/UserSchema");
const ScheduleModel = require("../models/ScheduleSchema");

const AttendeeController = {
    // ---------------- GET ALL ATTENDEES ----------------
    getAllAttendees: async (req, res) => {
        try {
            const attendees = await AttendeeModel.find().populate("user");
            res.json({ attendees, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET ATTENDEE BY ID ----------------
    getAttendeeById: async (req, res) => {
        try {
            const { id } = req.params;
            const attendee = await AttendeeModel.findById(id).populate("user");
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
            const attendees = await AttendeeModel.find({ expo: expoId }).populate("user");
            res.json({ attendees, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE ATTENDEE PROFILE ----------------
    updateAttendee: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const attendee = await AttendeeModel.findByIdAndUpdate(id, updatedData, { new: true }).populate("user");

            if (!attendee)
                return res.json({ message: "Attendee not found", status: false });

            res.json({ message: "Attendee updated", attendee, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- MARK ATTENDANCE VIA QR ----------------
    markAttendance: async (req, res) => {
        try {
            const { attendeeId } = req.body;

            const attendee = await AttendeeModel.findById(attendeeId).populate("user");
            if (!attendee)
                return res.json({ message: "Attendee not found", status: false });

            attendee.user.status = "Attended";
            await attendee.user.save();

            res.json({ message: "Attendance marked successfully", attendee, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    }
};

module.exports = AttendeeController;
