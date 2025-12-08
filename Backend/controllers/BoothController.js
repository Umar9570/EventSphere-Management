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

    getBoothByExhibitor: async (req, res) => {
        try {
            const { exhibitorId } = req.params;
            const booth = await Booth.findOne({ assignedTo: exhibitorId })
                .populate("expo", "name location date startTime endTime");

            if (!booth) {
                return res.json({ status: true, booth: null });
            }

            res.json({ status: true, booth });
        } catch (error) {
            console.error("Get booth by exhibitor error:", error);
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

            // -------------------- CHECK FOR DUPLICATE BOOTH NUMBER --------------------
            const existingBooth = await Booth.findOne({ boothNumber, expo });
            if (existingBooth) {
                return res.json({ status: false, message: `Booth number ${boothNumber} already exists for this expo`, booth: existingBooth });
            }

            let exhibitor = null;
            if (assignedTo) {
                exhibitor = await Exhibitor.findById(assignedTo);
                if (!exhibitor) {
                    return res.json({ status: false, message: "Exhibitor not found" });
                }
            }

            const booth = await Booth.create({
                boothNumber,
                location,
                expo,
                assignedTo: assignedTo || null
            });

            // -------------------- ASSIGN BOOTH TO EXHIBITOR --------------------
            if (exhibitor) {
                exhibitor.booth = booth._id;
                await exhibitor.save();
            }

            // -------------------- POPULATE FOR RETURN --------------------
            const populatedBooth = await Booth.findById(booth._id)
                .populate("assignedTo", "organization")
                .populate("expo", "name");

            res.json({ status: true, booth: populatedBooth });
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
            const { boothNumber, location, assignedTo, expo } = req.body;

            const booth = await Booth.findById(id);
            if (!booth) {
                return res.json({ status: false, message: "Booth not found" });
            }

            // -------------------- CHECK FOR DUPLICATE BOOTH NUMBER IN SAME EXPO --------------------
            if (boothNumber && expo) {
                const duplicateBooth = await Booth.findOne({
                    _id: { $ne: id }, // exclude current booth
                    boothNumber,
                    expo
                });

                if (duplicateBooth) {
                    return res.json({
                        status: false,
                        message: `Booth number ${boothNumber} already exists for this expo`,
                        booth: duplicateBooth
                    });
                }
            }

            // -------------------- HANDLE BOOTH ASSIGNMENT --------------------
            if (assignedTo && String(booth.assignedTo) !== assignedTo) {
                const newExhibitor = await Exhibitor.findById(assignedTo);
                if (!newExhibitor) {
                    return res.json({ status: false, message: "Exhibitor not found" });
                }

                // Clear booth from old exhibitor
                if (booth.assignedTo) {
                    const oldExhibitor = await Exhibitor.findById(booth.assignedTo);
                    if (oldExhibitor) {
                        oldExhibitor.booth = null;
                        await oldExhibitor.save();
                    }
                }

                // Assign booth to new exhibitor
                newExhibitor.booth = booth._id;
                await newExhibitor.save();

                booth.assignedTo = assignedTo;
            }

            // -------------------- UPDATE BOOTH DETAILS --------------------
            booth.boothNumber = boothNumber ?? booth.boothNumber;
            booth.location = location ?? booth.location;
            if (expo) booth.expo = expo;

            await booth.save();

            // -------------------- POPULATE AND RETURN --------------------
            const updatedBooth = await Booth.findById(booth._id)
                .populate("assignedTo", "organization")
                .populate("expo", "name");

            res.json({ status: true, booth: updatedBooth });
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

            const exhibitor = await Exhibitor.findById(exhibitorId);
            if (!exhibitor) {
                return res.json({ status: false, message: "Exhibitor not found" });
            }

            // -------------------- HANDLE PREVIOUS ASSIGNMENT --------------------
            if (booth.assignedTo && String(booth.assignedTo) !== exhibitorId) {
                const oldExhibitor = await Exhibitor.findById(booth.assignedTo);
                if (oldExhibitor) {
                    oldExhibitor.booth = null;
                    await oldExhibitor.save();
                }
            }

            // -------------------- ASSIGN BOOTH TO NEW EXHIBITOR --------------------
            booth.assignedTo = exhibitorId;
            await booth.save();

            exhibitor.booth = boothId;
            await exhibitor.save();

            res.json({ status: true, message: "Booth assigned successfully", booth, exhibitor });
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
