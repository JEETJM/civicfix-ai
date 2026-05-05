import { Link } from "react-router-dom";
import { Brain, CalendarDays, MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";
import UrgencyBadge from "./UrgencyBadge";

const ComplaintCard = ({ complaint }) => {
  return (
    <article className="complaint-card">
      <div className="complaint-card-top">
        <div>
          <span className="complaint-id">{complaint.complaintId}</span>
          <h3>{complaint.title}</h3>
        </div>

        <UrgencyBadge urgency={complaint.urgency} />
      </div>

      <p className="complaint-desc">{complaint.description}</p>

      <div className="complaint-meta-grid">
        <div>
          <MapPin size={16} />
          <span>{complaint.location?.address || "No address"}</span>
        </div>

        <div>
          <Brain size={16} />
          <span>AI Score: {complaint.aiScore}/100</span>
        </div>

        <div>
          <CalendarDays size={16} />
          <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="complaint-card-bottom">
        <StatusBadge status={complaint.status} />
        <Link to={`/complaints/${complaint._id}`}>View Details</Link>
      </div>
    </article>
  );
};

export default ComplaintCard;