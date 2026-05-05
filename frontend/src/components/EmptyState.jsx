import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to show right now.",
  action = null,
}) => {
  return (
    <section className="empty-state">
      <div className="empty-icon">
        <Inbox size={34} />
      </div>

      <h2>{title}</h2>
      <p>{message}</p>

      {action}
    </section>
  );
};

export default EmptyState;