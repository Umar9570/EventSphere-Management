const ExpoModel = require("../models/ExpoSchema");
const UserModel = require("../models/UserSchema");

const ExpoController = {
    // ---------------- CREATE EXPO (Organizer Only) ----------------
    createExpo: async (req, res) => {
        try {
            const { title, date, location, description, theme, totalBooths } = req.body;

            const newExpo = await ExpoModel.create({
                title,
                date,
                location,
                description,
                theme,
                totalBooths,
                assignedBooths: 0,
            });

            res.json({
                message: "Expo created successfully",
                expo: newExpo,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE EXPO ----------------
    updateExpo: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const updatedExpo = await ExpoModel.findByIdAndUpdate(id, updatedData, { new: true });

            if (!updatedExpo) {
                return res.json({ message: "Expo not found", status: false });
            }

            res.json({
                message: "Expo updated successfully",
                expo: updatedExpo,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- DELETE EXPO ----------------
    deleteExpo: async (req, res) => {
        try {
            const { id } = req.params;

            const expo = await ExpoModel.findById(id);
            if (!expo) {
                return res.json({ message: "Expo not found", status: false });
            }

            await ExpoModel.findByIdAndDelete(id);

            res.json({
                message: "Expo deleted successfully",
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET ALL EXPOS ----------------
    getAllExpos: async (req, res) => {
        try {
            const expos = await ExpoModel.find();

            res.json({
                expos,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET EXPO BY ID ----------------
    getExpoById: async (req, res) => {
        try {
            const { id } = req.params;

            const expo = await ExpoModel.findById(id);
            if (!expo) {
                return res.json({ message: "Expo not found", status: false });
            }

            res.json({
                expo,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE BOOTH ASSIGNMENT COUNT ----------------
    updateBoothCount: async (req, res) => {
        try {
            const { id } = req.params;
            const { assignedBooths } = req.body;

            const expo = await ExpoModel.findById(id);
            if (!expo) {
                return res.json({ message: "Expo not found", status: false });
            }

            if (assignedBooths > expo.totalBooths) {
                return res.json({
                    message: "Assigned booths cannot exceed total booths",
                    status: false
                });
            }

            expo.assignedBooths = assignedBooths;
            await expo.save();

            res.json({
                message: "Booth count updated",
                expo,
                status: true
            });

        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    }
};

module.exports = ExpoController;
