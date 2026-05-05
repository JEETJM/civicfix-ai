import { CheckCircle2, Clock } from "lucide-react";

const ComplaintTimeline = ({ timeline = [] }) => {
  if (!timeline.length) {
    return (
      <div className="empty-state small-empty">
        <Clock size={28} />
        <p>No timeline updates yet.</p>
      </div>
    );
  }

  return (
    <div className="complaint-timeline">
      {timeline.map((item) => (
        <div className="timeline-item" key={item._id}>
          <div className="timeline-dot">
            <CheckCircle2 size={18} />
          </div>

          <div className="timeline-content">
            <div className="timeline-head">
              <h4>{item.title}</h4>
              <span>{new Date(item.createdAt).toLocaleString()}</span>
            </div>

            <p>{item.message}</p>
            <small>Status: {item.status}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComplaintTimeline;