const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc   Register the logged-in user for an event
// @route  POST /api/registrations/:eventId
exports.registerForEvent = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const event = await Event.findById(req.params.eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.attendeesCount >= event.capacity) {
      await session.abortTransaction();
      return res.status(400).json({ message: "This event is fully booked" });
    }

    const existing = await Registration.findOne({
      event: event._id,
      user: req.user._id,
    }).session(session);

    if (existing && existing.status === "confirmed") {
      await session.abortTransaction();
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    if (existing && existing.status === "cancelled") {
      existing.status = "confirmed";
      await existing.save({ session });
    } else {
      await Registration.create(
        [{ event: event._id, user: req.user._id, status: "confirmed" }],
        { session }
      );
    }

    event.attendeesCount += 1;
    await event.save({ session });

    await session.commitTransaction();
    return res.status(201).json({ message: "Registered successfully", event });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    session.endSession();
  }
};

// @desc   Cancel the logged-in user's registration for an event
// @route  DELETE /api/registrations/:eventId
exports.cancelRegistration = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const registration = await Registration.findOne({
      event: req.params.eventId,
      user: req.user._id,
      status: "confirmed",
    }).session(session);

    if (!registration) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = "cancelled";
    await registration.save({ session });

    const event = await Event.findById(req.params.eventId).session(session);
    if (event && event.attendeesCount > 0) {
      event.attendeesCount -= 1;
      await event.save({ session });
    }

    await session.commitTransaction();
    return res.json({ message: "Registration cancelled" });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    session.endSession();
  }
};

// @desc   Get all events the logged-in user has registered for
// @route  GET /api/registrations/mine
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id,
      status: "confirmed",
    }).populate({
      path: "event",
      populate: { path: "organizer", select: "name email" },
    });

    return res.json({ registrations });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Get all attendees for an event (organizer/admin only)
// @route  GET /api/registrations/event/:eventId
exports.getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isOwner = event.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view attendees" });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: "confirmed",
    }).populate("user", "name email");

    return res.json({ registrations });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
