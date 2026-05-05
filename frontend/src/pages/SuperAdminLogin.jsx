import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown, LogIn } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { USER_ROLES } from "../utils/rolePermissions";

const SuperAdminLogin = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(formData);

      if (data.user.role !== USER_ROLES.SUPER_ADMIN) {
        await logout();
        setError("This login page is only for Super Admin account.");
        return;
      }

      navigate("/super-admin-dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Super Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card super-admin-card">
        <div className="auth-brand">
          <Crown size={38} />
          <h1>Super Admin Login</h1>
          <p>Restricted system control access for the project owner.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Super Admin Email
            <input
              type="email"
              name="email"
              placeholder="Enter super admin email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <button className="auth-submit super-admin-btn" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login as Super Admin"}
          </button>
        </form>

        <p className="auth-switch">
          Admin? <Link to="/admin-login">Admin Login</Link>
        </p>
      </section>
    </main>
  );
};

export default SuperAdminLogin;