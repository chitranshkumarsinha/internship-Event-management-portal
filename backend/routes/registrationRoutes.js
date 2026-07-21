const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventAttendees,
} = require("../controllers/registrationController");
const { protect, authorize } = require("../middleware/auth");

router.get("/mine", protect, getMyRegistrations);
router.get("/event/:eventId", protect, authorize("organizer", "admin"), getEventAttendees);
router.post("/:eventId", protect, registerForEvent);
router.delete("/:eventId", protect, cancelRegistration);

module.exports = router;
