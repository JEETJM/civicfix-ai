import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { sendForgotPasswordOTP } from "../services/otpService";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendForgotPasswordOTP({ email });
      toast.success("OTP sent to your Gmail");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const message = err.message || "Failed to send OTP.";
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
          <KeyRound size={42} />
          <h1>Forgot Password</h1>
          <p>Enter your email and receive a secure OTP.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email Address
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your registered Gmail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </label>

          <button className="auth-submit" disabled={loading}>
            <KeyRound size={18} />
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <p className="auth-switch">
          Remember password? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default ForgotPassword;