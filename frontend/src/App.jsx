import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Dashboard from "./pages/Dashboard";
import MyRegistrations from "./pages/MyRegistrations";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetails />} />

          <Route
            path="/my-registrations"
            element={
              <PrivateRoute>
                <MyRegistrations />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-event"
            element={
              <PrivateRoute roles={["organizer", "admin"]}>
                <CreateEvent />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit-event/:id"
            element={
              <PrivateRoute roles={["organizer", "admin"]}>
                <EditEvent />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={["organizer", "admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<h2 className="container">Page not found</h2>} />
        </Routes>
      </main>
    </>
  );
}

export default App;
