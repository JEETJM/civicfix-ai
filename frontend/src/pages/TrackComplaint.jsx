import { useState } from "react";
import { Mail, MapPinned, SearchCheck, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import {
  sendComplaintTrackingOTP,
  verifyComplaintTrackingOTP,
} from "../services/otpService";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";
import ComplaintTimeline from "../components/ComplaintTimeline";

const TrackComplaint = () => {
  const [step, setStep] = useState("send");
  const [formData, setFormData] = useState({
    complaintId: "",
    email: "",
    otp: "",
  });

  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSendOTP = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendComplaintTrackingOTP({
        complaintId: formData.complaintId.trim(),
        email: formData.email.trim(),
      });

      toast.success("Tracking OTP sent to your Gmail");
      setStep("verify");
    } catch (err) {
      const message = err.message || "Failed to send tracking OTP.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await verifyComplaintTrackingOTP(formData);
      setTrackingData(data);
      toast.success("Complaint verified");
      setStep("result");
    } catch (err) {
      const message = err.message || "Invalid OTP.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const complaint = trackingData?.complaint;
  const timeline = trackingData?.timeline || [];

  return (
    <main className="tracking-page">
      <section className="tracking-header">
        <div>
          <span>Secure Complaint Tracking</span>
          <h1>Track Your Complaint</h1>
          <p>Use Complaint ID and email OTP to securely view complaint progress.</p>
        </div>
      </section>

      {step !== "result" && (
        <section className="tracking-card">
          <div className="auth-brand">
            <ShieldCheck size={42} />
            <h2>{step === "send" ? "Send Tracking OTP" : "Verify OTP"}</h2>
            <p>
              {step === "send"
                ? "Enter your Complaint ID and registered email."
                : "Enter the OTP sent to your email."}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {step === "send" ? (
            <form className="auth-form" onSubmit={handleSendOTP}>
              <label>
                Complaint ID
                <div className="input-with-icon">
                  <SearchCheck size={18} />
                  <input
                    name="complaintId"
                    placeholder="Example: CFX-2026-00045"
                    value={formData.complaintId}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <label>
                Registered Email
                <div className="input-with-icon">
                  <Mail size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter registered Gmail"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>

              <button className="auth-submit" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleVerifyOTP}>
              <label>
                OTP Code
                <input
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  maxLength="6"
                  required
                />
              </label>

              <button className="auth-submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Track"}
              </button>

              <button
                type="button"
                className="secondary-action-btn"
                onClick={() => setStep("send")}
              >
                Change Complaint ID / Email
              </button>
            </form>
          )}
        </section>
      )}

      {step === "result" && complaint && (
        <section className="tracking-result-layout">
          <div className="tracking-result-card">
            <span className="complaint-id">{complaint.complaintId}</span>
            <h2>{complaint.title}</h2>

            <div className="details-badges">
              <StatusBadge status={complaint.status} />
              <UrgencyBadge urgency={complaint.urgency} />
            </div>

            <p>{complaint.description}</p>

            <div className="tracking-info-grid">
              <div>
                <strong>{complaint.category}</strong>
                <span>Category</span>
              </div>

              <div>
                <strong>{complaint.department}</strong>
                <span>Department</span>
              </div>

              <div>
                <strong>{complaint.aiScore}/100</strong>
                <span>AI Score</span>
              </div>

              <div>
                <strong>{complaint.location?.address || "N/A"}</strong>
                <span>Location</span>
              </div>
            </div>
          </div>

          <div className="tracking-result-card">
            <h2>
              <MapPinned size={22} />
              Status Timeline
            </h2>

            <ComplaintTimeline timeline={timeline} />
          </div>
        </section>
      )}
    </main>
  );
};

export default TrackComplaint;