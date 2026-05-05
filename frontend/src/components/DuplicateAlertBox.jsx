import { GitMerge, Info } from "lucide-react";

const DuplicateAlertBox = ({ duplicate }) => {
  if (!duplicate || !duplicate.isDuplicate) {
    return null;
  }

  const original = duplicate.originalComplaint;

  return (
    <div className="duplicate-alert">
      <div className="duplicate-icon">
        <GitMerge size={24} />
      </div>

      <div>
        <h3>Possible Duplicate Complaint Detected</h3>
        <p>
          This issue looks similar to an existing complaint. Your report has
          been linked to increase priority weight.
        </p>

        <div className="duplicate-meta">
          <span>Similarity: {duplicate.similarityScore || 0}/100</span>
          <span>Distance: {duplicate.distanceInMeters || 0}m</span>
          {original?.complaintId && <span>Original: {original.complaintId}</span>}
        </div>

        {duplicate.reason && (
          <div className="duplicate-reason">
            <Info size={16} />
            <small>{duplicate.reason}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuplicateAlertBox;