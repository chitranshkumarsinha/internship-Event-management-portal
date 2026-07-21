import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/events/mine/organized");
      setEvents(data.events);
    } catch (err) {
      setError("Could not load your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      setError("Could not delete event");
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Your Events</h2>
        <Link to="/create-event" className="btn-primary">
          + Create Event
        </Link>
      </div>

      {loading && <p className="page-loader">Loading...</p>}
      {error && <div className="alert-error">{error}</div>}

      {!loading && events.length === 0 && (
        <p className="empty-state">
          You haven't created any events yet. Click "Create Event" to get started.
        </p>
      )}

      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Attendees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>{event.location}</td>
              <td>
                {event.attendeesCount} / {event.capacity}
              </td>
              <td className="table-actions">
                <Link to={`/events/${event._id}`}>View</Link>
                <Link to={`/edit-event/${event._id}`}>Edit</Link>
                <button onClick={() => handleDelete(event._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
