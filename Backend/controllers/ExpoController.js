const ExpoModel = require("../models/ExpoSchema");
const ExhibitorModel = require("../models/ExhibitorSchema");

// ---------------- EXPO CONTROLLER ----------------
const ExpoController = {
    // ---------------- CREATE EXPO (Organizer Only) ----------------
    createExpo: async (req, res) => {
        try {
            const { name, description, location, startDate, endDate } = req.body;

            // Ensure required fields
            if (!name || !location || !startDate || !endDate) {
                return res.json({ message: "Required fields missing", status: false });
            }

            // Get organizer from request (set via frontend)
            // Since you said no middleware/tokens, let's accept organizer from the request body
            const organizer = req.body.organizer;
            if (!organizer) {
                return res.json({ message: "Organizer is required", status: false });
            }

            const newExpo = await ExpoModel.create({
                name,
                description,
                location,
                startDate,
                endDate,
                organizer,    // important!
            });

            res.json({
                message: "Expo created successfully",
                expo: newExpo,
                status: true,
            });
        } catch (err) {
            console.error("Create expo error:", err);
            res.status(500).json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE EXPO ----------------
    updateExpo: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, location, startDate, endDate } = req.body;

            const updatedExpo = await ExpoModel.findByIdAndUpdate(
                id,
                { name, description, location, startDate, endDate },
                { new: true }
            );

            if (!updatedExpo) {
                return res.json({ message: "Expo not found", status: false });
            }

            res.json({
                message: "Expo updated successfully",
                expo: updatedExpo,
                status: true,
            });
        } catch (err) {
            console.error("Update expo error:", err);
            res.status(500).json({ message: err.message, status: false });
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
                status: true,
            });
        } catch (err) {
            console.error("Delete expo error:", err);
            res.status(500).json({ message: err.message, status: false });
        }
    },

    // ---------------- GET ALL EXPOS ----------------
    getAllExpos: async (req, res) => {
        try {
            const expos = await ExpoModel.find();
            res.json({ expos, status: true });
        } catch (err) {
            console.error("Get all expos error:", err);
            res.status(500).json({ message: err.message, status: false });
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

            res.json({ expo, status: true });
        } catch (err) {
            console.error("Get expo by ID error:", err);
            res.status(500).json({ message: err.message, status: false });
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
                    status: false,
                });
            }

            expo.assignedBooths = assignedBooths;
            await expo.save();

            res.json({ message: "Booth count updated", expo, status: true });
        } catch (err) {
            console.error("Update booth count error:", err);
            res.status(500).json({ message: err.message, status: false });
        }
    },

    // ---------------- GET APPROVED EXPO FOR EXHIBITOR ----------------
    getApprovedExpo: async (req, res) => {
        try {
            const { userId } = req.params;

            // Find the exhibitor by userId
            const exhibitor = await ExhibitorModel.findOne({ user: userId, status: "approved" })
                .populate("expo"); // populate the expo details

            if (!exhibitor || !exhibitor.expo) {
                return res.json({
                    message: "No approved expo found for this exhibitor",
                    status: false
                });
            }

            res.json({
                expo: exhibitor.expo,
                status: true
            });
        } catch (err) {
            console.error("Get approved expo error:", err);
            res.status(500).json({ message: err.message, status: false });
        }
    }
};

module.exports = ExpoController;
