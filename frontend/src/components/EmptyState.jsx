import { Inbox } from "lucide-react";

const EmptyState = ({ title = "No data found", message = "Nothing to show yet." }) => {
  return (
    <div className="empty-state">
      <Inbox size={46} />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;