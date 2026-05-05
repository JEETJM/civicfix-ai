import { useEffect, useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { getAllFeedbacks } from "../services/feedbackService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const data = await getAllFeedbacks();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <Loader text="Loading feedbacks..." />;
  }

  return (
    <main className="feedback-page">
      <section className="feedback-header">
        <div>
          <span>Admin Feedback</span>
          <h1>Citizen Feedback</h1>
          <p>Review citizen satisfaction and resolution quality.</p>
        </div>
      </section>

      {feedbacks.length === 0 ? (
        <EmptyState title="No feedback yet" message="Resolved complaints will collect feedback." />
      ) : (
        <section className="feedback-grid">
          {feedbacks.map((item) => (
            <article className="feedback-card" key={item._id}>
              <div className="feedback-top">
                <MessageSquare size={24} />
                <span>{item.complaintId}</span>
              </div>

              <h3>{item.complaint?.title || "Complaint Feedback"}</h3>

              <div className="feedback-rating">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star size={18} key={index} />
                ))}
                <strong>{item.rating}/5</strong>
              </div>

              <p>{item.comment || "No comment added."}</p>

              <small>
                By {item.citizen?.name || "Citizen"} · Trust:{" "}
                {item.citizen?.trustScore || 50}
              </small>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default Feedback;