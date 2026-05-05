import { Brain, ShieldAlert } from "lucide-react";
import UrgencyBadge from "./UrgencyBadge";

const PriorityScoreCard = ({ analysis }) => {
  if (!analysis) {
    return null;
  }

  return (
    <div className="priority-score-card">
      <div className="priority-top">
        <div>
          <span>AI Priority Analysis</span>
          <h3>{analysis.aiScore}/100</h3>
        </div>

        <div className="priority-icon">
          <Brain size={28} />
        </div>
      </div>

      <div className="priority-row">
        <p>Category</p>
        <strong>{analysis.category}</strong>
      </div>

      <div className="priority-row">
        <p>Urgency</p>
        <UrgencyBadge urgency={analysis.urgency} />
      </div>

      <div className="priority-row">
        <p>Department</p>
        <strong>{analysis.department}</strong>
      </div>

      <div className="priority-reason">
        <ShieldAlert size={18} />
        <p>{analysis.aiReason}</p>
      </div>
    </div>
  );
};

export default PriorityScoreCard;