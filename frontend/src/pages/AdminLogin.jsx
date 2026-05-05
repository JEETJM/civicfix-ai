import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogIn } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { USER_ROLES } from "../utils/rolePermissions";

const AdminLogin = () => {
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

      if (data.user.role !== USER_ROLES.ADMIN) {
        await logout();
        setError("This login page is only for Admin accounts.");
        return;
      }

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <Building2 size={38} />
          <h1>Admin Login</h1>
          <p>Login to manage complaints, departments, and analytics.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Admin Email
            <input
              type="email"
              name="email"
              placeholder="Enter admin email"
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

          <button className="auth-submit" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p className="auth-switch">
          Citizen? <Link to="/login">Citizen Login</Link>
        </p>
      </section>
    </main>
  );
};

export default AdminLogin;