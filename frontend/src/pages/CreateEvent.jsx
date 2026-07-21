import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const emptyForm = {
  title: "",
  description: "",
  category: "Conference",
  date: "",
  time: "",
  location: "",
  capacity: 50,
  price: 0,
  imageUrl: "",
};

const CreateEvent = () => {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/events", form);
      navigate(`/events/${data.event._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>Create a new event</h2>

        {error && <div className="alert-error">{error}</div>}

        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="React Developers Meetup"
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="What's this event about?"
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
              placeholder="Bangalore, India"
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
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/banner.jpg"
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
