import { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";

const CATEGORIES = [
  "All",
  "Conference",
  "Workshop",
  "Meetup",
  "Concert",
  "Sports",
  "Webinar",
  "Other",
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/events", {
        params: { search, category },
      });
      setEvents(data.events);
    } catch (err) {
      setError("Could not load events. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchEvents, 300); // debounce search
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  return (
    <div className="container">
      <div className="hero">
        <h1>Discover events worth showing up for</h1>
        <p>Find conferences, workshops, meetups and more — or host your own.</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="page-loader">Loading events...</p>}
      {error && <div className="alert-error">{error}</div>}

      {!loading && !error && events.length === 0 && (
        <p className="empty-state">No events found. Try a different search.</p>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Home;
