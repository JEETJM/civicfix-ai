import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { getDashboardPathByRole, USER_ROLES } from "../utils/rolePermissions";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: USER_ROLES.CITIZEN,
    city: "",
    address: "",
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
      const data = await register(formData);
      navigate(getDashboardPathByRole(data.user.role), { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card wide-auth-card">
        <div className="auth-brand">
          <ShieldCheck size={36} />
          <h1>Create Account</h1>
          <p>Join CivicFix AI and start reporting smarter.</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form two-column-form">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Role
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="citizen">Citizen</option>
              <option value="department_officer">Department Officer</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>

          <label>
            City
            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
            />
          </label>

          <label className="full-field">
            Address
            <input
              type="text"
              name="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>

          <button className="auth-submit full-field" disabled={loading}>
            <UserPlus size={18} />
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;