import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, UserCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAdminComplaintDetails,
  getAdminDepartments,
  updateAdminComplaint,
} from "../services/adminPanelService";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";
import ComplaintTimeline from "../components/ComplaintTimeline";

const AdminComplaintDetails = () => {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    status: "",
    category: "",
    urgency: "",
    aiScore: "",
    department: "",
    adminRemark: "",
  });

  const fetchData = async () => {
    try {
      const [complaintData, departmentData] = await Promise.all([
        getAdminComplaintDetails(id),
        getAdminDepartments(),
      ]);

      const current = complaintData.complaint;

      setComplaint(current);
      setTimeline(complaintData.timeline || []);
      setDepartments(departmentData.departments || []);

      setFormData({
        status: current.status || "",
        category: current.category || "",
        urgency: current.urgency || "",
        aiScore: current.aiScore || "",
        department: current.department || "",
        adminRemark: current.adminRemark || "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to load complaint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const data = await updateAdminComplaint(id, formData);
      setComplaint(data.complaint);
      toast.success("Complaint updated");
      fetchData();
    } catch (error) {
      toast.error(error.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading complaint management..." />;

  if (!complaint) {
    return (
      <main className="simple-page">
        <section className="simple-card">
          <h1>Complaint not found</h1>
          <Link className="primary-btn" to="/admin/complaints">
            Back
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-panel-page">
      <Link to="/admin/complaints" className="back-link">
        <ArrowLeft size={18} />
        Back to All Complaints
      </Link>

      <section className="admin-details-hero">
        <div>
          <span className="complaint-id">{complaint.complaintId}</span>
          <h1>{complaint.title}</h1>

          <div className="details-badges">
            <StatusBadge status={complaint.status} />
            <UrgencyBadge urgency={complaint.urgency} />
          </div>
        </div>

        <div className="admin-citizen-box">
          <UserCircle size={28} />
          <strong>{complaint.reportedBy?.name || "Citizen"}</strong>
          <span>{complaint.reportedBy?.email}</span>
          <span>{complaint.reportedBy?.phone}</span>
        </div>
      </section>

      <div className="admin-details-layout">
        <section className="admin-details-main">
          <div className="admin-card">
            <h2>Complaint Description</h2>
            <p>{complaint.description}</p>
          </div>

          <div className="admin-card">
            <h2>AI Analysis</h2>
            <p>{complaint.aiReason}</p>

            <div className="admin-mini-grid">
              <div>
                <strong>{complaint.aiScore}/100</strong>
                <span>AI Score</span>
              </div>
              <div>
                <strong>{complaint.category}</strong>
                <span>Category</span>
              </div>
              <div>
                <strong>{complaint.department}</strong>
                <span>Department</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2>Timeline</h2>
            <ComplaintTimeline timeline={timeline} />
          </div>
        </section>

        <aside className="admin-card">
          <h2>Admin Update Panel</h2>

          <form className="admin-update-form" onSubmit={handleSave}>
            <label>
              Status
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Submitted">Submitted</option>
                <option value="AI Analyzed">AI Analyzed</option>
                <option value="Duplicate Checked">Duplicate Checked</option>
                <option value="Assigned to Department">Assigned to Department</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
                <option value="Rejected">Rejected</option>
                <option value="Closed">Closed</option>
              </select>
            </label>

            <label>
              Category
              <select name="category" value={formData.category} onChange={handleChange}>
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
            </label>

            <label>
              Urgency
              <select name="urgency" value={formData.urgency} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </label>

            <label>
              AI Score
              <input
                type="number"
                min="0"
                max="100"
                name="aiScore"
                value={formData.aiScore}
                onChange={handleChange}
              />
            </label>

            <label>
              Assign Department
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department._id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Admin Remark
              <textarea
                name="adminRemark"
                placeholder="Add admin remark..."
                value={formData.adminRemark}
                onChange={handleChange}
              />
            </label>

            <button className="primary-btn" disabled={saving}>
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
};

export default AdminComplaintDetails;