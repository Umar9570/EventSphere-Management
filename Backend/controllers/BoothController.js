const Booth = require("../models/BoothSchema");
const Expo = require("../models/ExpoSchema");
const Exhibitor = require("../models/ExhibitorSchema");

const BoothController = {
    // ----------------------------------------------------
    // GET ALL BOOTHS
    // ----------------------------------------------------
    getAllBooths: async (req, res) => {
        try {
            const booths = await Booth.find()
                .populate("expo", "name")
                .populate("assignedTo", "organization");

            res.json({ status: true, booths });
        } catch (error) {
            console.error("Get booths error:", error);
            res.status(500).json({ status: false, message: "Server error" });
        }
    },

    // ----------------------------------------------------
    // GET BOOTHS BY EXPO
    // ----------------------------------------------------
    getBoothsByExpo: async (req, res) => {
        try {
            const { expoId } = req.params;

            const booths = await Booth.find({ expo: expoId })
                .populate("expo", "name")
                .populate("assignedTo", "organization");

            res.json({ status: true, booths });
        } catch (error) {
            console.error("Get booths by expo error:", error);
            res.status(500).json({ status: false, message: "Server error" });
        }
    },

    // ----------------------------------------------------
    // CREATE BOOTH
    // ----------------------------------------------------
    createBooth: async (req, res) => {
        try {
            const { boothNumber, location, expo, assignedTo } = req.body;

            const expoExists = await Expo.findById(expo);
            if (!expoExists) {
                return res.json({ status: false, message: "Expo not found" });
            }

            if (assignedTo) {
                const exhibitorExists = await Exhibitor.findById(assignedTo);
                if (!exhibitorExists) {
                    return res.json({ status: false, message: "Exhibitor not found" });
                }
            }

            const booth = await Booth.create({
                boothNumber,
                location,
                expo,
                assignedTo: assignedTo || null
            });

            res.json({ status: true, booth });
        } catch (error) {
            console.error("Create booth error:", error);
            res.status(500).json({ status: false, message: "Server error" });
        }
    },

    // ----------------------------------------------------
    // UPDATE BOOTH
    // ----------------------------------------------------
    updateBooth: async (req, res) => {
        try {
            const { id } = req.params;
            const { boothNumber, location, assignedTo } = req.body;

            const booth = await Booth.findById(id);
            if (!booth) {
                return res.json({ status: false, message: "Booth not found" });
            }

            if (assignedTo) {
                const exhibitorExists = await Exhibitor.findById(assignedTo);
                if (!exhibitorExists) {
                    return res.json({ status: false, message: "Exhibitor not found" });
                }
            }

            booth.boothNumber = boothNumber ?? booth.boothNumber;
            booth.location = location ?? booth.location;
            booth.assignedTo = assignedTo ?? booth.assignedTo;

            await booth.save();

            res.json({ status: true, booth });
        } catch (error) {
            console.error("Update booth error:", error);
            res.status(500).json({ status: false, message: "Server error" });
        }
    },

    // ----------------------------------------------------
    // DELETE BOOTH
    // ----------------------------------------------------
    deleteBooth: async (req, res) => {
        try {
            const { id } = req.params;

            const booth = await Booth.findByIdAndDelete(id);
            if (!booth) {
                return res.json({ status: false, message: "Booth not found" });
            }

            res.json({ status: true, message: "Booth deleted successfully" });
        } catch (error) {
            console.error("Delete booth error:", error);
            res.status(500).json({ status: false, message: "Server error" });
        }
    },

    // ----------------------------------------------------
    // ASSIGN BOOTH TO EXHIBITOR
    // ----------------------------------------------------
    assignBooth: async (req, res) => {
        try {
            const { boothId } = req.params;
            const { exhibitorId } = req.body;

            const booth = await Booth.findById(boothId);
            if (!booth) {
                return res.json({ status: false, message: "Booth not found" });
            }

            const exhibitorExists = await Exhibitor.findById(exhibitorId);
            if (!exhibitorExists) {
                return res.json({ status: false, message: "Exhibitor not found" });
            }

            booth.assignedTo = exhibitorId;
            await booth.save();

            res.json({ status: true, message: "Booth assigned", booth });
        } catch (error) {
            console.error("Assign booth error:", error);
            res.status(500).json({ status: false, message: "Server error" });
        }
    },

    // ----------------------------------------------------
    // UNASSIGN EXHIBITOR FROM BOOTH
    // ----------------------------------------------------
    unassignBooth: async (req, res) => {
        try {
            const { boothId } = req.params;

            const booth = await Booth.findById(boothId);
            if (!booth) {
                return res.json({ status: false, message: "Booth not found" });
            }

            booth.assignedTo = null;
            await booth.save();

            res.json({ status: true, message: "Booth unassigned", booth });
        } catch (error) {
            console.error("Unassign booth error:", error);
            res.status(500).json({ status: false, message: "Server error" });
        }
    }
};

module.exports = BoothController;
