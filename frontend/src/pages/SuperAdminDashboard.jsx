import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Building2,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Admins", value: "Manage", icon: <Users /> },
    { label: "Departments", value: "10", icon: <Building2 /> },
    { label: "System", value: "Control", icon: <Settings /> },
    { label: "Analytics", value: "Live", icon: <BarChart3 /> },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span>Super Admin Dashboard</span>
          <h1>System Control, {user?.name}</h1>
          <p>
            Manage users, departments, complaints, analytics, and system rules.
          </p>
        </div>
      </section>

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <div className="dashboard-card big-card">
          <h2>Super Admin Controls</h2>

          <div className="feature-list">
            <p>
              <Link to="/super-admin/users">Manage users and roles</Link>
            </p>
            <p>
              <Link to="/super-admin/departments">Manage departments</Link>
            </p>
            <p>
              <Link to="/admin/complaints">Manage all complaints</Link>
            </p>
            <p>
              <Link to="/analytics">View analytics</Link>
            </p>
            <p>
              <Link to="/map">View public heatmap</Link>
            </p>
            <p>System settings and escalation rules coming next.</p>
          </div>
        </div>

        <div className="dashboard-card">
          <Shield size={32} />
          <h3>High-Level Escalations</h3>
          <p>Review unresolved and critical complaints.</p>
          <Link to="/admin/complaints">Open complaints</Link>
        </div>

        <div className="dashboard-card">
          <Activity size={32} />
          <h3>System Monitoring</h3>
          <p>Monitor users, departments, reports and duplicate activity.</p>
          <Link to="/analytics">Open analytics</Link>
        </div>
      </section>
    </main>
  );
};

export default SuperAdminDashboard;
