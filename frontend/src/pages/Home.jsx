import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  MapPinned,
  Route,
  ShieldCheck,
} from "lucide-react";

const Home = () => {
  return (
    <main>
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Brain size={18} />
            Smart City · AI-Assisted Complaint Management
          </div>

          <h1>
            Report local issues with <span>AI-powered civic tracking</span>
          </h1>

          <p>
            CivicFix AI helps citizens report broken roads, garbage, drainage,
            streetlights, waterlogging, and unsafe public infrastructure with
            photo, location, AI priority score, duplicate detection, department
            routing, and resolution tracking.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="primary-btn">
              Start Reporting <ArrowRight size={18} />
            </Link>
            <Link to="/map" className="secondary-btn">
              View Heatmap <MapPinned size={18} />
            </Link>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>10</strong>
              <span>Departments</span>
            </div>
            <div>
              <strong>AI</strong>
              <span>Priority Engine</span>
            </div>
            <div>
              <strong>OTP</strong>
              <span>Tracking Ready</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-top">
            <span className="critical-dot"></span>
            <p>Live Complaint Analysis</p>
          </div>

          <div className="ai-score-card">
            <div>
              <small>AI Priority Score</small>
              <h2>92/100</h2>
            </div>
            <span>Critical</span>
          </div>

          <div className="mini-timeline">
            <div>
              <CheckCircle2 size={18} />
              Complaint submitted
            </div>
            <div>
              <Brain size={18} />
              AI classified as Electrical Hazard
            </div>
            <div>
              <Route size={18} />
              Routed to Streetlight & Electricity
            </div>
            <div>
              <AlertTriangle size={18} />
              Escalation timer active
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <span>Why CivicFix AI?</span>
          <h2>Not just a complaint portal</h2>
          <p>
            It understands, prioritizes, routes, verifies, and escalates civic
            complaints intelligently.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <Brain />
            <h3>AI Priority Engine</h3>
            <p>Automatically detects urgency and gives a smart priority score.</p>
          </div>

          <div className="feature-card">
            <ShieldCheck />
            <h3>Duplicate Detection</h3>
            <p>Similar nearby reports are merged to increase issue priority.</p>
          </div>

          <div className="feature-card">
            <MapPinned />
            <h3>Public Heatmap</h3>
            <p>Shows area-wise civic issue hotspots using map markers.</p>
          </div>

          <div className="feature-card">
            <BarChart3 />
            <h3>Role Dashboards</h3>
            <p>Citizen, department, admin, and super admin dashboards.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;