import { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const { data } = await api.get("/registrations/mine");
        setRegistrations(data.registrations);
      } catch (err) {
        setError("Could not load your registrations");
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="container">
      <h2>My Registrations</h2>

      {loading && <p className="page-loader">Loading...</p>}
      {error && <div className="alert-error">{error}</div>}

      {!loading && registrations.length === 0 && (
        <p className="empty-state">
          You haven't registered for any events yet. Browse events to get started.
        </p>
      )}

      <div className="events-grid">
        {registrations
          .filter((r) => r.event)
          .map((r) => (
            <EventCard key={r._id} event={r.event} />
          ))}
      </div>
    </div>
  );
};

export default MyRegistrations;
