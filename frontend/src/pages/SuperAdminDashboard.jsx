import { Activity, Building2, Settings, Shield, Users } from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Admins", value: "Manage", icon: <Users /> },
    { label: "Departments", value: "10", icon: <Building2 /> },
    { label: "System", value: "Control", icon: <Settings /> },
    { label: "Logs", value: "Audit", icon: <Activity /> },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span>Super Admin Dashboard</span>
          <h1>System Control, {user?.name}</h1>
          <p>Manage admins, officers, departments, settings, and reports.</p>
        </div>
      </section>

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <div className="dashboard-card big-card">
          <h2>Super Admin Controls</h2>
          <div className="feature-list">
            <p>Manage admins</p>
            <p>Manage departments</p>
            <p>Manage department officers</p>
            <p>Set escalation rules</p>
            <p>View activity logs</p>
            <p>Generate reports</p>
          </div>
        </div>

        <div className="dashboard-card">
          <Shield size={32} />
          <h3>High-Level Escalations</h3>
          <p>Review unresolved and critical complaints.</p>
        </div>

        <div className="dashboard-card">
          <Settings size={32} />
          <h3>System Settings</h3>
          <p>Control category-department mapping and rules.</p>
        </div>
      </section>
    </main>
  );
};

export default SuperAdminDashboard;