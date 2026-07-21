const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Conference",
        "Workshop",
        "Meetup",
        "Concert",
        "Sports",
        "Webinar",
        "Other",
      ],
      default: "Other",
    },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g. "18:30"
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    price: { type: Number, default: 0, min: 0 },
    imageUrl: { type: String, default: "" },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendeesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

eventSchema.virtual("seatsLeft").get(function () {
  return Math.max(this.capacity - this.attendeesCount, 0);
});

eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
