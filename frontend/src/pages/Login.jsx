import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";
import { USER_ROLES, getDashboardPathByRole } from "../utils/rolePermissions";

const Login = () => {
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

      const allowedRoles = [USER_ROLES.CITIZEN, USER_ROLES.DEPARTMENT_OFFICER];

      if (!allowedRoles.includes(loggedInUser?.role)) {
        await logout({ silent: true });

        const message = "Use Admin or Super Admin login for this account.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Login successful");
      navigate(getDashboardPathByRole(loggedInUser.role));
    } catch (err) {
      const message = err.message || "Login failed. Please check your details.";
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
          <ShieldCheck size={42} />
          <h1>Citizen & Officer Login</h1>
          <p>Login as citizen or department officer.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
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
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-switch">
            Forgot password? <Link to="/forgot-password">Reset Password</Link>
          </p>
        </form>

        <p className="auth-switch">
          New citizen? <Link to="/register">Create Account</Link>
        </p>

        <p className="auth-switch">
          Admin? <Link to="/admin-login">Admin Login</Link> · Super Admin?{" "}
          <Link to="/super-admin-login">Super Admin Login</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
