import { CheckCircle2, Clock, FileWarning, UploadCloud } from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";

const DepartmentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Assigned", value: "View", icon: <FileWarning /> },
    { label: "In Progress", value: "Track", icon: <Clock /> },
    { label: "Resolved", value: "Proof", icon: <CheckCircle2 /> },
    { label: "Upload", value: "Before/After", icon: <UploadCloud /> },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span>Department Officer Dashboard</span>
          <h1>Hello, {user?.name}</h1>
          <p>Manage assigned complaints and update resolution progress.</p>
        </div>
      </section>

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <div className="dashboard-card big-card">
          <h2>Department Workflow</h2>
          <div className="feature-list">
            <p>View assigned complaints</p>
            <p>Filter by urgency and status</p>
            <p>Accept complaint</p>
            <p>Update work status</p>
            <p>Upload before/after proof</p>
            <p>Mark complaint as resolved</p>
          </div>
        </div>

        <div className="dashboard-card">
          <UploadCloud size={32} />
          <h3>Resolution Proof</h3>
          <p>Upload proof image after work completion.</p>
        </div>

        <div className="dashboard-card">
          <Clock size={32} />
          <h3>Escalation Watch</h3>
          <p>Unresolved complaints will be escalated automatically.</p>
        </div>
      </section>
    </main>
  );
};

export default DepartmentDashboard;