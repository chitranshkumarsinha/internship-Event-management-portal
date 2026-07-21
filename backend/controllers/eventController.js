const Event = require("../models/Event");
const Registration = require("../models/Registration");

// @desc   Create a new event (organizer/admin only)
// @route  POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      price,
      imageUrl,
    } = req.body;

    if (!title || !description || !date || !time || !location || !capacity) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      price,
      imageUrl,
      organizer: req.user._id,
    });

    return res.status(201).json({ event });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Get all events with optional filters (search, category, upcoming)
// @route  GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    let query = Event.find(filter).populate("organizer", "name email");

    if (sort === "oldest") {
      query = query.sort({ date: 1 });
    } else {
      query = query.sort({ date: 1 }); // default: soonest first
    }

    const events = await query;
    return res.json({ events, count: events.length });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Get a single event by id
// @route  GET /api/events/:id
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name email"
    );
    if (!event) return res.status(404).json({ message: "Event not found" });

    let isRegistered = false;
    if (req.user) {
      const reg = await Registration.findOne({
        event: event._id,
        user: req.user._id,
        status: "confirmed",
      });
      isRegistered = !!reg;
    }

    return res.json({ event, isRegistered });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Update an event (organizer who owns it, or admin)
// @route  PUT /api/events/:id
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isOwner = event.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    const fields = [
      "title",
      "description",
      "category",
      "date",
      "time",
      "location",
      "capacity",
      "price",
      "imageUrl",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) event[field] = req.body[field];
    });

    await event.save();
    return res.json({ event });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Delete an event (organizer who owns it, or admin)
// @route  DELETE /api/events/:id
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const isOwner = event.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    await Registration.deleteMany({ event: event._id });

    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Get events created by the logged-in organizer
// @route  GET /api/events/mine/organized
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ date: 1 });
    return res.json({ events });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
