const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require("../controllers/eventController");
const { protect, authorize, optionalAuth } = require("../middleware/auth");

router.get("/mine/organized", protect, authorize("organizer", "admin"), getMyEvents);

router.get("/", getEvents);
router.get("/:id", optionalAuth, getEventById);
router.post("/", protect, authorize("organizer", "admin"), createEvent);
router.put("/:id", protect, authorize("organizer", "admin"), updateEvent);
router.delete("/:id", protect, authorize("organizer", "admin"), deleteEvent);

module.exports = router;
