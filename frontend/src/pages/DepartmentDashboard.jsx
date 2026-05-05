import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileWarning,
  Filter,
  MessageSquare,
  ShieldAlert,
  UploadCloud,
} from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import { getDepartmentPerformance } from "../services/departmentPanelService";

const DepartmentDashboard = () => {
  const { user } = useAuth();

  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPerformance = async () => {
    try {
      const data = await getDepartmentPerformance();
      setPerformance(data.performance);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  if (loading) {
    return <Loader text="Loading department dashboard..." />;
  }

  const stats = [
    {
      label: "Assigned",
      value: performance?.assigned || 0,
      icon: <FileWarning />,
    },
    {
      label: "In Progress",
      value: performance?.inProgress || 0,
      icon: <Clock />,
    },
    {
      label: "Resolved",
      value: performance?.resolved || 0,
      icon: <CheckCircle2 />,
    },
    {
      label: "Resolution Rate",
      value: `${performance?.resolutionRate || 0}%`,
      icon: <BarChart3 />,
    },
  ];

  const departmentActions = [
    {
      title: "View assigned complaints",
      icon: <ClipboardList size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Filter by urgency and status",
      icon: <Filter size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Accept complaint and move to In Progress",
      icon: <Clock size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Upload before/after proof",
      icon: <UploadCloud size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Add work remarks",
      icon: <MessageSquare size={18} />,
      path: "/department/complaints",
    },
    {
      title: "Mark complaint as resolved",
      icon: <CheckCircle2 size={18} />,
      path: "/department/complaints",
    },
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <span>Department Officer Dashboard</span>
          <h1>Hello, {user?.name}</h1>
          <p>Manage assigned complaints and update resolution progress.</p>
        </div>

        <Link to="/department/complaints" className="primary-btn">
          <ClipboardList size={18} />
          View Assigned Complaints
        </Link>
      </section>

      <DashboardStats stats={stats} />

      <section className="dashboard-grid">
        <div className="dashboard-card big-card">
          <ClipboardList size={32} />
          <h2>Department Workflow</h2>

          <div className="feature-list action-feature-list">
            {departmentActions.map((action) => (
              <Link to={action.path} key={action.title}>
                {action.icon}
                {action.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <UploadCloud size={32} />
          <h3>Resolution Proof</h3>
          <p>Upload before and after proof images after work completion.</p>

          <Link to="/department/complaints" className="dashboard-action-btn">
            Open Work Panel
          </Link>
        </div>

        <div className="dashboard-card">
          <ShieldAlert size={32} />
          <h3>Escalation Watch</h3>
          <p>Unresolved complaints can be escalated automatically.</p>

          <Link to="/department/complaints" className="dashboard-action-btn">
            Check Assigned Issues
          </Link>
        </div>
      </section>
    </main>
  );
};

export default DepartmentDashboard;