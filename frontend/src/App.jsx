import { Route, Routes } from "react-router-dom";
import { Sparkles } from "lucide-react";

function Home() {
  return (
    <main className="hero">
      <section className="hero-card">
        <div className="badge">
          <Sparkles size={18} />
          Smart City · Civic Tech · AI-Assisted Complaint Management
        </div>

        <h1>
          CivicFix <span>AI</span>
        </h1>

        <p>
          An intelligent civic issue prioritization and resolution tracking
          platform where citizens can report local problems with photo,
          location, and description. The system supports AI priority scoring,
          duplicate detection, department routing, heatmap tracking, and
          verified resolution proof.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary">Report an Issue</button>
          <button className="btn btn-secondary">Track Complaint</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <strong>10+</strong>
            <span>Departments</span>
          </div>
          <div className="stat-card">
            <strong>AI</strong>
            <span>Priority Score</span>
          </div>
          <div className="stat-card">
            <strong>OTP</strong>
            <span>Secure Tracking</span>
          </div>
          <div className="stat-card">
            <strong>Map</strong>
            <span>Public Heatmap</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
