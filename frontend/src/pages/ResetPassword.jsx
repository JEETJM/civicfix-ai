import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Lock, MailCheck } from "lucide-react";
import toast from "react-hot-toast";
import { resetPasswordWithOTP } from "../services/otpService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const defaultEmail = useMemo(
    () => searchParams.get("email") || "",
    [searchParams]
  );

  const [formData, setFormData] = useState({
    email: defaultEmail,
    otp: "",
    newPassword: "",
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
      await resetPasswordWithOTP(formData);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      const message = err.message || "Password reset failed.";
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
          <MailCheck size={42} />
          <h1>Reset Password</h1>
          <p>Enter OTP and create your new password.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            OTP Code
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
              maxLength="6"
              required
            />
          </label>

          <label>
            New Password
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                name="newPassword"
                placeholder="Create new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          <button className="auth-submit" disabled={loading}>
            <KeyRound size={18} />
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="auth-switch">
          Need new OTP? <Link to="/forgot-password">Send again</Link>
        </p>
      </section>
    </main>
  );
};

export default ResetPassword;