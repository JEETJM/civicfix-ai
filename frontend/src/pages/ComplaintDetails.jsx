import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Building2,
  CalendarDays,
  Image,
  MapPin,
  UserCircle,
} from "lucide-react";
import { getComplaintById } from "../services/complaintService";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";
import ComplaintTimeline from "../components/ComplaintTimeline";
import FeedbackForm from "../components/FeedbackForm";
const ComplaintDetails = () => {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaint = async () => {
    try {
      const data = await getComplaintById(id);
      setComplaint(data.complaint);
      setTimeline(data.timeline || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <Loader text="Loading complaint details..." />;
  }

  if (!complaint) {
    return (
      <main className="simple-page">
        <section className="simple-card">
          <h1>Complaint not found</h1>
          <p>The complaint may not exist or you may not have access.</p>
          <Link className="primary-btn" to="/my-complaints">
            Back to My Complaints
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="complaint-page">
      <Link to="/my-complaints" className="back-link">
        <ArrowLeft size={18} />
        Back to My Complaints
      </Link>

      <section className="details-hero">
        <div>
          <span className="complaint-id large-id">{complaint.complaintId}</span>
          <h1>{complaint.title}</h1>

          <div className="details-badges">
            <StatusBadge status={complaint.status} />
            <UrgencyBadge urgency={complaint.urgency} />
          </div>
        </div>

        <div className="details-score">
          <Brain size={26} />
          <small>AI Score</small>
          <strong>{complaint.aiScore}/100</strong>
        </div>
      </section>

      <div className="details-layout">
        <section className="details-main">
          <div className="details-card">
            <h2>Description</h2>
            <p>{complaint.description}</p>
          </div>

          <div className="details-card">
            <h2>AI Reason</h2>
            <p>{complaint.aiReason}</p>
          </div>

          <div className="details-card">
            <h2>Status Timeline</h2>
            <ComplaintTimeline timeline={timeline} />
          </div>
        </section>
        <div className="details-card">
          <FeedbackForm complaint={complaint} onSuccess={fetchComplaint} />
        </div>

        <aside className="details-side">
          <div className="details-card">
            <h3>Complaint Info</h3>

            <div className="info-line">
              <Building2 size={18} />
              <span>{complaint.department}</span>
            </div>

            <div className="info-line">
              <MapPin size={18} />
              <span>{complaint.location?.address}</span>
            </div>

            <div className="info-line">
              <CalendarDays size={18} />
              <span>{new Date(complaint.createdAt).toLocaleString()}</span>
            </div>

            <div className="info-line">
              <UserCircle size={18} />
              <span>{complaint.reportedBy?.name || "Citizen"}</span>
            </div>
          </div>

          <div className="details-card">
            <h3>Category</h3>
            <p className="category-pill">{complaint.category}</p>
          </div>

          <div className="details-card">
            <h3>Complaint Image</h3>

            {complaint.imageUrl ?
              <img
                className="complaint-image-preview"
                src={complaint.imageUrl}
                alt={complaint.title}
              />
            : <div className="no-image-box">
                <Image size={30} />
                <p>No image added</p>
              </div>
            }
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ComplaintDetails;
