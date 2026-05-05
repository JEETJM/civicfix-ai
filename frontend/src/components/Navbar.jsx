import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  Crown,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  UserCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { getDashboardPathByRole, roleLabels } from "../utils/rolePermissions";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const dashboardPath = user ? getDashboardPathByRole(user.role) : "/dashboard";
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

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

        <button className="theme-toggle" onClick={toggleTheme} type="button">
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
          {isDark ? "Light" : "Dark"}
        </button>

        {isAuthenticated ? (
          <>
            <NavLink to={dashboardPath} onClick={() => setOpen(false)}>
              <LayoutDashboard size={17} />
              Dashboard
            </NavLink>

            <NavLink to="/profile-settings" onClick={() => setOpen(false)}>
              <Settings size={17} />
              Settings
            </NavLink>

            <Link
              to="/profile-settings"
              className="nav-profile-pill"
              onClick={() => setOpen(false)}
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user?.name} />
              ) : (
                <span>{avatarLetter}</span>
              )}

              <div>
                <strong>{user?.name}</strong>
                <small>{roleLabels[user?.role]}</small>
              </div>
            </Link>

            <button className="nav-logout" onClick={handleLogout}>
              <LogOut size={17} />
              Logout
            </button>
          </>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="nav-login" onClick={() => setOpen(false)}>
              Citizen Login
            </Link>

            <Link
              to="/admin-login"
              className="nav-admin-login"
              onClick={() => setOpen(false)}
            >
              <Building2 size={16} />
              Admin
            </Link>

            <Link
              to="/super-admin-login"
              className="nav-super-login"
              onClick={() => setOpen(false)}
            >
              <Crown size={16} />
              Super Admin
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