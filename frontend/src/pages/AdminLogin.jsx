import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, LogIn } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";
import { USER_ROLES } from "../utils/rolePermissions";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setError("");

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
      const loggedInUser = await login(formData, { silent: true });

      if (loggedInUser?.role !== USER_ROLES.ADMIN) {
        await logout({ silent: true });

        const message = "This login page is only for Admin accounts.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Admin login successful");
      navigate("/admin-dashboard");
    } catch (err) {
      const message = err.message || "Admin login failed.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <Building2 size={42} />
          <h1>Admin Login</h1>
          <p>Login to manage complaints, departments, and analytics.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
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
          <p className="auth-switch">
            Forgot password? <Link to="/forgot-password">Reset Password</Link>
          </p>
        </form>

        <p className="auth-switch">
          Citizen? <Link to="/login">Citizen Login</Link>
        </p>
      </section>
    </main>
  );
};

export default AdminLogin;
