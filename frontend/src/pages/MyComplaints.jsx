import { useEffect, useMemo, useState } from "react";
import { FileSearch, Search } from "lucide-react";
import { getMyComplaints } from "../services/complaintService";
import ComplaintCard from "../components/ComplaintCard";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchComplaints = async () => {
    try {
      const data = await getMyComplaints();
      setComplaints(data.complaints || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = `${complaint.complaintId} ${complaint.title} ${complaint.description} ${complaint.category}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesStatus = statusFilter
        ? complaint.status === statusFilter
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  if (loading) {
    return <Loader text="Loading your complaints..." />;
  }

  return (
    <main className="complaint-page">
      <section className="complaint-header">
        <div>
          <span>Citizen Dashboard</span>
          <h1>My Complaints</h1>
          <p>Track all your submitted civic issues and their current status.</p>
        </div>
      </section>

      <section className="complaint-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by ID, title, category..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="AI Analyzed">AI Analyzed</option>
          <option value="Duplicate Checked">Duplicate Checked</option>
          <option value="Assigned to Department">Assigned to Department</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </section>

      {filteredComplaints.length === 0 ? (
        <EmptyState
          title="No complaints found"
          message="Submit your first civic issue from the report page."
        />
      ) : (
        <section className="complaint-list">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard complaint={complaint} key={complaint._id} />
          ))}
        </section>
      )}

      <div className="complaint-count-box">
        <FileSearch size={18} />
        Showing {filteredComplaints.length} of {complaints.length} complaints
      </div>
    </main>
  );
};

export default MyComplaints;