import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Search, SlidersHorizontal } from "lucide-react";
import { getAssignedDepartmentComplaints } from "../services/departmentPanelService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";

const DepartmentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    urgency: "",
  });

  const fetchComplaints = async () => {
    setLoading(true);

    try {
      const data = await getAssignedDepartmentComplaints(filters);
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

  const handleFilter = (event) => {
    event.preventDefault();
    fetchComplaints();
  };

  if (loading) {
    return <Loader text="Loading assigned complaints..." />;
  }

  return (
    <main className="department-panel-page">
      <section className="department-panel-header">
        <div>
          <span>Department Officer</span>
          <h1>Assigned Complaints</h1>
          <p>View, accept, update, and resolve assigned civic issues.</p>
        </div>
      </section>

      <form className="department-filter-bar" onSubmit={handleFilter}>
        <div className="search-box">
          <Search size={18} />
          <input
            name="search"
            placeholder="Search complaint ID, title, address..."
            value={filters.search}
            onChange={handleChange}
          />
        </div>

        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All Status</option>
          <option value="Assigned to Department">Assigned to Department</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Escalated">Escalated</option>
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
        <EmptyState
          title="No assigned complaints"
          message="No complaints are assigned to your department yet."
        />
      ) : (
        <section className="department-table-card">
          <div className="table-title">
            <ClipboardList size={20} />
            <h2>{complaints.length} Assigned Complaints</h2>
          </div>

          <div className="department-table-wrap">
            <table className="department-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Citizen</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>AI Score</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>{complaint.complaintId}</td>
                    <td>{complaint.title}</td>
                    <td>{complaint.reportedBy?.name || "Citizen"}</td>
                    <td>
                      <UrgencyBadge urgency={complaint.urgency} />
                    </td>
                    <td>
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td>{complaint.aiScore}/100</td>
                    <td>{complaint.location?.address || "N/A"}</td>
                    <td>
                      <Link
                        className="table-action-link"
                        to={`/department/complaints/${complaint._id}`}
                      >
                        Work
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

export default DepartmentComplaints;