import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Event<span>Hub</span>
      </Link>
      <div className="nav-links">
        <Link to="/">Events</Link>
        {user && <Link to="/my-registrations">My Registrations</Link>}
        {user && (user.role === "organizer" || user.role === "admin") && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/create-event">+ Create Event</Link>
          </>
        )}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-link">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="user-menu">
            <span className="user-name">Hi, {user.name.split(" ")[0]}</span>
            <button className="btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
