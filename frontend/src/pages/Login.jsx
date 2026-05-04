import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getDashboardPathByRole } from "../utils/rolePermissions";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      const redirectPath =
        location.state?.from?.pathname || getDashboardPathByRole(data.user.role);

      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <ShieldCheck size={36} />
          <h1>Welcome Back</h1>
          <p>Login to manage and track civic complaints.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email Address
            <input
              type="email"
              name="email"
              placeholder="citizen@test.com"
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
        </form>

        <p className="auth-switch">
          New to CivicFix AI? <Link to="/register">Create account</Link>
        </p>

        {/* <div className="demo-box">
          <strong>Demo users</strong>
          <span>citizen@test.com / 123456</span>
          <span>admin@test.com / 123456</span>
          <span>road@test.com / 123456</span>
          <span>superadmin@test.com / 123456</span>
        </div> */}
      </section>
    </main>
  );
};

export default Login;