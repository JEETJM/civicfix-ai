import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  GitMerge,
  ListChecks,
  Users,
} from "lucide-react";
import { getDashboardAnalytics } from "../services/analyticsService";
import DashboardStats from "../components/DashboardStats";
import ChartCard from "../components/ChartCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";

const Analytics = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
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
    fetchAnalytics();
  }, []);

  if (loading) {
    return <Loader text="Loading analytics..." />;
  }

  if (!dashboard) {
    return (
      <main className="analytics-page">
        <EmptyState title="Analytics unavailable" message="Please login as admin." />
      </main>
    );
  }

  const summary = dashboard.summary || {};

  const stats = [
    {
      label: "Total Complaints",
      value: summary.totalComplaints || 0,
      icon: <ListChecks />,
    },
    {
      label: "Users",
      value: summary.totalUsers || 0,
      icon: <Users />,
    },
    {
      label: "High Priority",
      value: summary.totalHighPriority || 0,
      icon: <AlertTriangle />,
    },
    {
      label: "Resolved",
      value: `${summary.resolutionRate || 0}%`,
      icon: <CheckCircle2 />,
    },
    {
      label: "Duplicates",
      value: summary.totalDuplicates || 0,
      icon: <GitMerge />,
    },
    {
      label: "Departments",
      value: summary.totalDepartments || 0,
      icon: <BarChart3 />,
    },
  ];

  return (
    <main className="analytics-page">
      <section className="analytics-header">
        <div>
          <span>Admin Analytics</span>
          <h1>CivicFix AI Analytics</h1>
          <p>
            View category-wise, status-wise, department-wise, and priority-wise
            civic issue insights.
          </p>
        </div>
      </section>

      <DashboardStats stats={stats} />

      <section className="analytics-grid">
        <ChartCard title="Category Wise Complaints" data={dashboard.categoryWise} />
        <ChartCard title="Status Wise Complaints" data={dashboard.statusWise} type="pie" />
        <ChartCard title="Urgency Wise Complaints" data={dashboard.urgencyWise} />
        <ChartCard title="Department Wise Complaints" data={dashboard.departmentWise} />
      </section>

      <section className="recent-analytics-card">
        <h2>Recent Complaints</h2>

        {dashboard.recentComplaints?.length === 0 ? (
          <EmptyState title="No recent complaints" message="No complaints submitted yet." />
        ) : (
          <div className="analytics-table-wrap">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Department</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentComplaints?.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.complaintId}</td>
                    <td>{complaint.title}</td>
                    <td>{complaint.category}</td>
                    <td>
                      <UrgencyBadge urgency={complaint.urgency} />
                    </td>
                    <td>
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td>{complaint.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default Analytics;