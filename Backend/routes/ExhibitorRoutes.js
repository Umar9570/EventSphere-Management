const express = require("express");
const router = express.Router();
const ExhibitorController = require("../controllers/ExhibitorController");

// Apply for expo
router.post("/apply", ExhibitorController.applyForExpo);

// Get all exhibitor applications (pending, approved, rejected)
router.get("/applications", ExhibitorController.getApplications);

// Update application status (approve/reject)
router.put("/:id/status", ExhibitorController.updateStatus);

// Get all exhibitors
router.get("/", ExhibitorController.getAllExhibitors);

router.get("/user/:userId", ExhibitorController.getExhibitorByUser);

// Get exhibitors of a specific expo
router.get("/expo/:expoId", ExhibitorController.getExhibitorsByExpo);

router.get("/all-for-organizer/:userId", ExhibitorController.getAllParticipantsForOrganizer);

// Assign booth
router.put("/assign-booth/:id", ExhibitorController.assignBooth);

// Update exhibitor profile
router.put("/:id", ExhibitorController.updateExhibitorProfile);

module.exports = router;
