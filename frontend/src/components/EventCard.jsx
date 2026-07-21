import { Link } from "react-router-dom";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const EventCard = ({ event }) => {
  const seatsLeft = event.seatsLeft ?? Math.max(event.capacity - event.attendeesCount, 0);
  const isFull = seatsLeft <= 0;

  return (
    <Link to={`/events/${event._id}`} className="event-card">
      <div
        className="event-card-image"
        style={{
          backgroundImage: event.imageUrl
            ? `url(${event.imageUrl})`
            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
        }}
      >
        <span className="event-category">{event.category}</span>
      </div>
      <div className="event-card-body">
        <h3>{event.title}</h3>
        <p className="event-meta">📅 {formatDate(event.date)} · 🕒 {event.time}</p>
        <p className="event-meta">📍 {event.location}</p>
        <div className="event-card-footer">
          <span className="event-price">
            {event.price > 0 ? `₹${event.price}` : "Free"}
          </span>
          <span className={`event-seats ${isFull ? "full" : ""}`}>
            {isFull ? "Sold out" : `${seatsLeft} seats left`}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
