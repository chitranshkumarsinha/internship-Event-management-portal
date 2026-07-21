import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data.event);
      setIsRegistered(data.isRegistered);
    } catch (err) {
      setError("Event not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRegister = async () => {
    if (!user) return navigate("/login");
    setActionLoading(true);
    setMessage("");
    setError("");
    try {
      await api.post(`/registrations/${id}`);
      setMessage("You're registered! See you there.");
      fetchEvent();
    } catch (err) {
      setError(err.response?.data?.message || "Could not register");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    setMessage("");
    setError("");
    try {
      await api.delete(`/registrations/${id}`);
      setMessage("Registration cancelled.");
      fetchEvent();
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel registration");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await api.delete(`/events/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete event");
    }
  };

  if (loading) return <p className="page-loader">Loading event...</p>;
  if (error && !event) return <p className="alert-error container">{error}</p>;
  if (!event) return null;

  const seatsLeft = event.seatsLeft ?? Math.max(event.capacity - event.attendeesCount, 0);
  const isFull = seatsLeft <= 0;
  const isOwner = user && event.organizer && user.id === event.organizer._id;

  return (
    <div className="container event-details">
      <div
        className="event-banner"
        style={{
          backgroundImage: event.imageUrl
            ? `url(${event.imageUrl})`
            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
        }}
      />

      <div className="event-details-body">
        <span className="event-category">{event.category}</span>
        <h1>{event.title}</h1>
        <p className="event-meta">
          📅 {formatDate(event.date)} · 🕒 {event.time}
        </p>
        <p className="event-meta">📍 {event.location}</p>
        <p className="event-meta">
          🎟️ {event.price > 0 ? `₹${event.price} per ticket` : "Free"} ·{" "}
          {isFull ? "Sold out" : `${seatsLeft} of ${event.capacity} seats left`}
        </p>
        <p className="event-meta">
          Hosted by {event.organizer?.name || "Unknown organizer"}
        </p>

        <h3>About this event</h3>
        <p className="event-description">{event.description}</p>

        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-error">{error}</div>}

        <div className="event-actions">
          {isOwner ? (
            <>
              <Link to={`/edit-event/${event._id}`} className="btn-outline">
                Edit Event
              </Link>
              <button className="btn-danger" onClick={handleDelete}>
                Delete Event
              </button>
            </>
          ) : isRegistered ? (
            <button
              className="btn-outline"
              onClick={handleCancel}
              disabled={actionLoading}
            >
              {actionLoading ? "Cancelling..." : "Cancel Registration"}
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleRegister}
              disabled={actionLoading || isFull}
            >
              {isFull
                ? "Sold Out"
                : actionLoading
                ? "Registering..."
                : "Register Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
