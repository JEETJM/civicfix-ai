import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  GitMerge,
  ListChecks,
  MapPinned,
  Repeat2,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import ChartCard from "../components/ChartCard";
import { getDashboardAnalytics } from "../services/analyticsService";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const data = await getDashboardAnalytics();
      setDashboard(data.dashboard);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader text="Loading admin dashboard..." />;
  }

  const summary = dashboard?.summary || {};

  const stats = [
    {
      label: "All Complaints",
      value: summary.totalComplaints || 0,
      icon: <ListChecks />,
    },
    {
      label: "Users",
      value: summary.totalUsers || 0,
      icon: <Users />,
    },
    {
      label: "Duplicates",
      value: summary.totalDuplicates || 0,
      icon: <GitMerge />,
    },
    {
      label: "Resolution Rate",
      value: `${summary.resolutionRate || 0}%`,
      icon: <BarChart3 />,
    },
  ];

  const adminActions = [
    {
      title: "View & manage all complaints",
      icon: <ListChecks size={18} />,
      path: "/admin/complaints",
    },
    {
      title: "Verify complaints",
      icon: <UserCheck size={18} />,
      path: "/admin/complaints",
    },
    {
      title: "Assign or reassign department",
      icon: <Repeat2 size={18} />,
      path: "/admin/complaints",
    },
    {
      title: "Monitor department progress",
      icon: <CheckCircle2 size={18} />,
      path: "/admin/complaints",
    },
    {
      title: "View analytics dashboard",
      icon: <BarChart3 size={18} />,
      path: "/analytics",
    },
    {
      title: "View public heatmap",
      icon: <MapPinned size={18} />,
      path: "/map",
    },
    {
      title: "Escalation center",
      icon: <ShieldAlert size={18} />,
      path: "/escalations",
    },
    {
      title: "Citizen feedback",
      icon: <Users size={18} />,
      path: "/feedback",
    },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span>Admin Dashboard</span>
          <h1>Welcome, {user?.name}</h1>
          <p>
            Monitor complaints, verify reports, assign departments, and analyze
            civic data.
          </p>
        </div>

        <Link to="/analytics" className="primary-btn">
          <BarChart3 size={18} />
          View Analytics
        </Link>
      </section>

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <div className="dashboard-card big-card">
          <ShieldCheck size={32} />
          <h2>Admin Controls</h2>

          <div className="feature-list action-feature-list">
            {adminActions.map((action) => (
              <Link to={action.path} key={action.title}>
                {action.icon}
                {action.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <MapPinned size={32} />
          <h3>Heatmap & Zones</h3>
          <p>Identify red, yellow, and green civic issue zones.</p>

          <Link to="/map" className="dashboard-action-btn">
            Open Heatmap
          </Link>
        </div>

        <div className="dashboard-card">
          <BarChart3 size={32} />
          <h3>Analytics</h3>
          <p>Category-wise, status-wise, and department-wise analytics.</p>

          <Link to="/analytics" className="dashboard-action-btn">
            Open Analytics
          </Link>
        </div>
      </section>

      {dashboard && (
        <section className="admin-chart-preview">
          <ChartCard title="Category Overview" data={dashboard.categoryWise} />
          <ChartCard
            title="Status Overview"
            data={dashboard.statusWise}
            type="pie"
          />
        </section>
      )}
    </main>
  );
};

export default AdminDashboard;