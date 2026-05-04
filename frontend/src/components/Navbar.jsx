import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { getDashboardPathByRole, roleLabels } from "../utils/rolePermissions";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const dashboardPath = user ? getDashboardPathByRole(user.role) : "/dashboard";

  return (
    <header className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-icon">
          <ShieldCheck size={22} />
        </span>
        <span>
          CivicFix <b>AI</b>
        </span>
      </Link>

      <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`nav-links ${open ? "show" : ""}`}>
        <NavLink to="/" onClick={() => setOpen(false)}>
          Home
        </NavLink>

        <NavLink to="/map" onClick={() => setOpen(false)}>
          <MapPinned size={17} />
          Heatmap
        </NavLink>

        <NavLink to="/about" onClick={() => setOpen(false)}>
          <Building2 size={17} />
          About
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to={dashboardPath} onClick={() => setOpen(false)}>
              <LayoutDashboard size={17} />
              Dashboard
            </NavLink>

            <div className="nav-user-pill">
              <UserCircle size={18} />
              <span>{user?.name}</span>
              <small>{roleLabels[user?.role]}</small>
            </div>

            <button className="nav-logout" onClick={handleLogout}>
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="nav-login" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link
              to="/register"
              className="nav-register"
              onClick={() => setOpen(false)}
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;