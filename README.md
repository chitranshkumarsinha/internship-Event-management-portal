# EventHub — MERN Event Management Portal

A full-stack event management platform built with **MongoDB, Express, React (Vite), and Node.js**.

Users can browse and search events, register/cancel their attendance, and organizers can create, edit, and manage their own events with an attendee dashboard.

## Features

- JWT authentication (Register/Login) with roles: `user`, `organizer`, `admin`
- Browse events with search + category filters
- Event details page with seat availability
- Register / cancel registration for events (capacity-aware, no double-booking)
- Organizers can create, edit, and delete their own events
- Organizer dashboard listing their events and attendee counts
- "My Registrations" page for attendees
- Clean, responsive UI with plain CSS (no extra UI framework needed)

## Tech Stack

**Frontend:** React 18, Vite, React Router, Axios
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Project Structure

```
event-management-portal/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── components/
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── .env.example
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env and set MONGO_URI, JWT_SECRET, etc.
npm run dev
```

The API will run on `http://localhost:5000` by default.

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your API runs on a different URL
npm run dev
```

The app will run on `http://localhost:5173` by default.

### 3. Try it out

1. Open `http://localhost:5173`
2. Register an account — choose "Organize / host events" to create events, or "Attend events" to just browse and register.
3. As an organizer, click **+ Create Event** to publish an event.
4. As an attendee, browse events on the home page and click **Register Now**.

## API Overview

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | Required |
| GET | `/api/events` | List events (search, category, sort) | Public |
| GET | `/api/events/:id` | Get single event | Public (optional auth) |
| POST | `/api/events` | Create event | Organizer/Admin |
| PUT | `/api/events/:id` | Update event | Owner/Admin |
| DELETE | `/api/events/:id` | Delete event | Owner/Admin |
| GET | `/api/events/mine/organized` | Events I created | Organizer/Admin |
| POST | `/api/registrations/:eventId` | Register for event | Required |
| DELETE | `/api/registrations/:eventId` | Cancel registration | Required |
| GET | `/api/registrations/mine` | My registrations | Required |
| GET | `/api/registrations/event/:eventId` | Attendee list | Owner/Admin |

## Deployment Notes

- **Backend:** Deploy to Render, Railway, or any Node host. Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (your deployed frontend URL) as environment variables.
- **Frontend:** Deploy to Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's `/api` URL.
- Update CORS `origin` in `backend/server.js` (via `CLIENT_URL` env var) to match your deployed frontend domain.

## License

Free to use for learning or as a starter template for your own projects.
