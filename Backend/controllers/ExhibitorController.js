const ExhibitorModel = require("../models/ExhibitorSchema");
const ExpoModel = require("../models/ExpoSchema");
const UserModel = require("../models/UserSchema");

const ExhibitorController = {

    getExhibitorByUser: async (req, res) => {
        try {
            const exhibitor = await ExhibitorModel.findOne({ user: req.params.userId })
                .populate("expo");

            if (!exhibitor)
                return res.json({ message: "Exhibitor profile not found", status: false });

            res.json({ exhibitor, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- APPLY AS EXHIBITOR ----------------
    applyForExpo: async (req, res) => {
        try {
            const { user, expo, organization, bio } = req.body;

            const expoExists = await ExpoModel.findById(expo);
            if (!expoExists)
                return res.json({ message: "Expo not found", status: false });

            const application = await ExhibitorModel.create({
                user,
                expo,
                organization,
                bio,
                status: "pending"
            });

            res.json({ message: "Application submitted", application, status: true });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET PENDING OR ALL APPLICATIONS ----------------
    getApplications: async (req, res) => {
        try {
            const exhibitors = await ExhibitorModel.find()
                .populate("user")
                .populate("expo");

            res.json({ exhibitors, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE STATUS (APPROVE/REJECT) ----------------
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const exhibitor = await ExhibitorModel.findById(id);
            if (!exhibitor)
                return res.json({ message: "Exhibitor not found", status: false });

            exhibitor.status = status;
            await exhibitor.save();

            res.json({
                message: `Exhibitor ${status}`,
                exhibitor,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET ALL EXHIBITORS ----------------
    getAllExhibitors: async (req, res) => {
        try {
            const exhibitors = await ExhibitorModel.find()
                .populate("user")
                .populate("expo");

            res.json({ exhibitors, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET EXHIBITORS BY EXPO ----------------
    getExhibitorsByExpo: async (req, res) => {
        try {
            const exhibitors = await ExhibitorModel.find({ expo: req.params.expoId })
                .populate("user")
                .populate("expo");

            res.json({ exhibitors, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- ASSIGN BOOTH ----------------
    assignBooth: async (req, res) => {
        try {
            const { id } = req.params;
            const { boothNumber } = req.body;

            const exhibitor = await ExhibitorModel.findById(id);
            if (!exhibitor)
                return res.json({ message: "Exhibitor not found", status: false });

            exhibitor.boothNumber = boothNumber;
            await exhibitor.save();

            res.json({
                message: "Booth assigned",
                exhibitor,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE PROFILE ----------------
    updateExhibitorProfile: async (req, res) => {
        try {
            const exhibitor = await ExhibitorModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

            if (!exhibitor)
                return res.json({ message: "Exhibitor not found", status: false });

            res.json({ message: "Profile updated", exhibitor, status: true });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    }
};

module.exports = ExhibitorController;
