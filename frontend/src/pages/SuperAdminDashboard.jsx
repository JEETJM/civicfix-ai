import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Building2,
  FileText,
  MapPinned,
  MessageSquare,
  Settings,
  Shield,
  ShieldAlert,
  Users,
} from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: "Admins",
      value: "Manage",
      icon: <Users />,
    },
    {
      label: "Departments",
      value: "10",
      icon: <Building2 />,
    },
    {
      label: "System",
      value: "Control",
      icon: <Settings />,
    },
    {
      label: "Analytics",
      value: "Live",
      icon: <BarChart3 />,
    },
  ];

  const superAdminActions = [
    {
      title: "Manage users and roles",
      icon: <Users size={18} />,
      path: "/super-admin/users",
    },
    {
      title: "Manage departments",
      icon: <Building2 size={18} />,
      path: "/super-admin/departments",
    },
    {
      title: "Manage all complaints",
      icon: <FileText size={18} />,
      path: "/admin/complaints",
    },
    {
      title: "View analytics",
      icon: <BarChart3 size={18} />,
      path: "/analytics",
    },
    {
      title: "View public heatmap",
      icon: <MapPinned size={18} />,
      path: "/map",
    },
    {
      title: "Review escalations",
      icon: <ShieldAlert size={18} />,
      path: "/escalations",
    },
    {
      title: "View citizen feedback",
      icon: <MessageSquare size={18} />,
      path: "/feedback",
    },
    {
      title: "System settings",
      icon: <Settings size={18} />,
      path: "/profile-settings",
    },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span>Super Admin Dashboard</span>
          <h1>System Control, {user?.name}</h1>
          <p>
            Manage users, departments, complaints, analytics, escalations, and
            system rules.
          </p>
        </div>

        <Link to="/super-admin/users" className="primary-btn">
          <Users size={18} />
          Manage Users
        </Link>
      </section>

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <div className="dashboard-card big-card">
          <Shield size={32} />
          <h2>Super Admin Controls</h2>

          <div className="feature-list action-feature-list">
            {superAdminActions.map((action) => (
              <Link to={action.path} key={action.title}>
                {action.icon}
                {action.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <ShieldAlert size={32} />
          <h3>High-Level Escalations</h3>
          <p>Review unresolved and critical complaints.</p>

          <Link to="/escalations" className="dashboard-action-btn">
            Open Escalations
          </Link>
        </div>

        <div className="dashboard-card">
          <Activity size={32} />
          <h3>System Monitoring</h3>
          <p>Monitor users, departments, reports, feedback and duplicate activity.</p>

          <Link to="/analytics" className="dashboard-action-btn">
            Open Analytics
          </Link>
        </div>
      </section>
    </main>
  );
};

export default SuperAdminDashboard;