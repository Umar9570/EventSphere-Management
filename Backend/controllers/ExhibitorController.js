const ExhibitorModel = require("../models/ExhibitorSchema");
const ExpoModel = require("../models/ExpoSchema");
const UserModel = require("../models/UserSchema");

const ExhibitorController = {
    // ---------------- APPLY AS EXHIBITOR ----------------
    applyForExpo: async (req, res) => {
        try {
            const { userId, expoId, companyName, category, description } = req.body;

            // ensure expo exists
            const expo = await ExpoModel.findById(expoId);
            if (!expo) {
                return res.json({ message: "Expo not found", status: false });
            }

            const application = await ExhibitorModel.create({
                userId,
                expoId,
                companyName,
                category,
                description,
                status: "pending",
                boothNumber: null
            });

            res.json({
                message: "Application submitted",
                application,
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET ALL EXHIBITOR APPLICATIONS ----------------
    getAllExhibitors: async (req, res) => {
        try {
            const exhibitors = await ExhibitorModel.find()
                .populate("userId")
                .populate("expoId");

            res.json({
                exhibitors,
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET EXHIBITORS FOR A SPECIFIC EXPO ----------------
    getExhibitorsByExpo: async (req, res) => {
        try {
            const { expoId } = req.params;

            const exhibitors = await ExhibitorModel.find({ expoId })
                .populate("userId")
                .populate("expoId");

            res.json({
                exhibitors,
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- APPROVE AN EXHIBITOR ----------------
    approveExhibitor: async (req, res) => {
        try {
            const { id } = req.params;

            const exhibitor = await ExhibitorModel.findById(id);
            if (!exhibitor) {
                return res.json({ message: "Exhibitor not found", status: false });
            }

            exhibitor.status = "approved";
            await exhibitor.save();

            res.json({
                message: "Exhibitor approved",
                exhibitor,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- REJECT AN EXHIBITOR ----------------
    rejectExhibitor: async (req, res) => {
        try {
            const { id } = req.params;

            const exhibitor = await ExhibitorModel.findById(id);
            if (!exhibitor) {
                return res.json({ message: "Exhibitor not found", status: false });
            }

            exhibitor.status = "rejected";
            await exhibitor.save();

            res.json({
                message: "Exhibitor rejected",
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- ASSIGN BOOTH ----------------
    assignBooth: async (req, res) => {
        try {
            const { id } = req.params; // exhibitor ID
            const { boothNumber } = req.body;

            const exhibitor = await ExhibitorModel.findById(id);
            if (!exhibitor) {
                return res.json({ message: "Exhibitor not found", status: false });
            }

            const expo = await ExpoModel.findById(exhibitor.expoId);
            if (!expo) {
                return res.json({ message: "Expo not found", status: false });
            }

            // check booth availability
            if (boothNumber > expo.totalBooths) {
                return res.json({ message: "Booth exceeds expo limit", status: false });
            }

            exhibitor.boothNumber = boothNumber;
            exhibitor.status = "approved"; // automatically approve after assigning booth
            await exhibitor.save();

            res.json({
                message: "Booth assigned successfully",
                exhibitor,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE EXHIBITOR PROFILE ----------------
    updateExhibitorProfile: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const exhibitor = await ExhibitorModel.findByIdAndUpdate(
                id,
                updatedData,
                { new: true }
            );

            if (!exhibitor) {
                return res.json({ message: "Exhibitor not found", status: false });
            }

            res.json({
                message: "Exhibitor profile updated",
                exhibitor,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },
};

module.exports = ExhibitorController;
