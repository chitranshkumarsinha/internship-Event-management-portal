import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const CATEGORIES = [
  "Conference",
  "Workshop",
  "Meetup",
  "Concert",
  "Sports",
  "Webinar",
  "Other",
];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        const e = data.event;
        setForm({
          title: e.title,
          description: e.description,
          category: e.category,
          date: e.date ? e.date.substring(0, 10) : "",
          time: e.time,
          location: e.location,
          capacity: e.capacity,
          price: e.price,
          imageUrl: e.imageUrl || "",
        });
      } catch (err) {
        setError("Could not load event");
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put(`/events/${id}`, form);
      navigate(`/events/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update event");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="page-loader">Loading...</p>;
  if (!form) return <p className="alert-error container">{error}</p>;

  return (
    <div className="container">
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>Edit event</h2>

        {error && <div className="alert-error">{error}</div>}

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          required
        />

        <div className="form-row">
          <div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
          <div>
            <label>Price (₹, 0 for free)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min={0}
            />
          </div>
        </div>

        <label>Image URL (optional)</label>
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
