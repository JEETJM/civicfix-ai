import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileSearch, Search, SlidersHorizontal } from "lucide-react";
import { getAdminComplaints } from "../services/adminPanelService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    urgency: "",
  });

  const fetchComplaints = async () => {
    setLoading(true);

    try {
      const data = await getAdminComplaints(filters);
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchComplaints();
  };

  if (loading) {
    return <Loader text="Loading admin complaints..." />;
  }

  return (
    <main className="admin-panel-page">
      <section className="admin-panel-header">
        <div>
          <span>Admin Control</span>
          <h1>All Complaints</h1>
          <p>Verify, filter, assign, and update civic complaints.</p>
        </div>
      </section>

      <form className="admin-filter-bar" onSubmit={handleFilterSubmit}>
        <div className="search-box">
          <Search size={18} />
          <input
            name="search"
            placeholder="Search by ID, title, department, address..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="AI Analyzed">AI Analyzed</option>
          <option value="Duplicate Checked">Duplicate Checked</option>
          <option value="Assigned to Department">Assigned to Department</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Escalated">Escalated</option>
          <option value="Closed">Closed</option>
        </select>

        <select name="category" value={filters.category} onChange={handleChange}>
          <option value="">All Category</option>
          <option value="road">Road</option>
          <option value="sanitation">Sanitation</option>
          <option value="drainage">Drainage</option>
          <option value="electricity">Electricity</option>
          <option value="water">Water</option>
          <option value="safety">Safety</option>
          <option value="environment">Environment</option>
          <option value="traffic">Traffic</option>
          <option value="health">Health</option>
          <option value="other">Other</option>
        </select>

        <select name="urgency" value={filters.urgency} onChange={handleChange}>
          <option value="">All Urgency</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <button className="primary-btn">
          <SlidersHorizontal size={18} />
          Apply
        </button>
      </form>

      {complaints.length === 0 ? (
        <EmptyState title="No complaints found" message="Try different filters." />
      ) : (
        <section className="admin-table-card">
          <div className="table-title">
            <FileSearch size={20} />
            <h2>{complaints.length} Complaints</h2>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Citizen</th>
                  <th>Category</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.complaintId}</td>
                    <td>{complaint.title}</td>
                    <td>{complaint.reportedBy?.name || "Citizen"}</td>
                    <td>{complaint.category}</td>
                    <td>
                      <UrgencyBadge urgency={complaint.urgency} />
                    </td>
                    <td>
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td>{complaint.department}</td>
                    <td>
                      <Link
                        className="table-action-link"
                        to={`/admin/complaints/${complaint._id}`}
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
};

export default AdminComplaints;