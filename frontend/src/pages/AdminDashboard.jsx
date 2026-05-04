import { BarChart3, GitMerge, ListChecks, MapPinned, Users } from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "All Complaints", value: "API", icon: <ListChecks /> },
    { label: "Users", value: "Manage", icon: <Users /> },
    { label: "Duplicates", value: "Merge", icon: <GitMerge /> },
    { label: "Analytics", value: "Live", icon: <BarChart3 /> },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span>Admin Dashboard</span>
          <h1>Welcome, {user?.name}</h1>
          <p>Monitor complaints, manage departments, and analyze civic data.</p>
        </div>
      </section>

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <div className="dashboard-card big-card">
          <h2>Admin Controls</h2>
          <div className="feature-list">
            <p>View all complaints</p>
            <p>Verify complaints</p>
            <p>Edit category and priority</p>
            <p>Merge duplicate complaints</p>
            <p>Assign or reassign department</p>
            <p>Monitor department progress</p>
          </div>
        </div>

        <div className="dashboard-card">
          <MapPinned size={32} />
          <h3>Heatmap & Zones</h3>
          <p>Identify red, yellow, and green civic issue zones.</p>
        </div>

        <div className="dashboard-card">
          <BarChart3 size={32} />
          <h3>Analytics</h3>
          <p>Category-wise, status-wise, and department-wise analytics.</p>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;