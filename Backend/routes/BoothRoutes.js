const express = require("express");
const router = express.Router();
const BoothController = require("../controllers/BoothController");

// GET all booths
router.get("/", BoothController.getAllBooths);

// Get booths by Expo
router.get("/expo/:expoId", BoothController.getBoothsByExpo);

router.get("/exhibitor/:exhibitorId", BoothController.getBoothByExhibitor);

// Create booth
router.post("/", BoothController.createBooth);

// Update booth
router.put("/:id", BoothController.updateBooth);

// Delete booth
router.delete("/:id", BoothController.deleteBooth);

// Assign booth to exhibitor
router.put("/:boothId/assign", BoothController.assignBooth);

// Unassign booth
router.put("/:boothId/unassign", BoothController.unassignBooth);

module.exports = router;
