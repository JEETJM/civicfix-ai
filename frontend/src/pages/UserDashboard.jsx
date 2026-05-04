import { Link } from "react-router-dom";
import { Brain, FilePlus2, MapPinned, ShieldCheck, Timer } from "lucide-react";
import useAuth from "../hooks/useAuth";
import DashboardStats from "../components/DashboardStats";

const UserDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Trust Score", value: user?.trustScore || 50, icon: <ShieldCheck /> },
    { label: "Total Reports", value: user?.totalReports || 0, icon: <FilePlus2 /> },
    { label: "AI Priority", value: "Ready", icon: <Brain /> },
    { label: "Tracking", value: "OTP", icon: <Timer /> },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span>Citizen Dashboard</span>
          <h1>Hello, {user?.name}</h1>
          <p>Report, track, and verify civic issues from one dashboard.</p>
        </div>

        <Link to="/report-issue" className="primary-btn">
          Report New Issue
        </Link>
      </section>

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <div className="dashboard-card big-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/report-issue">Report new issue</Link>
            <Link to="/my-complaints">My complaints</Link>
            <Link to="/track-complaint">Track complaint</Link>
            <Link to="/map">View public heatmap</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <MapPinned size={32} />
          <h3>Public Heatmap</h3>
          <p>View civic issue hotspots around your area.</p>
          <Link to="/map">Open map</Link>
        </div>

        <div className="dashboard-card">
          <Brain size={32} />
          <h3>AI Priority Engine</h3>
          <p>Your complaints will be analyzed with AI-assisted urgency logic.</p>
        </div>
      </section>
    </main>
  );
};

export default UserDashboard;