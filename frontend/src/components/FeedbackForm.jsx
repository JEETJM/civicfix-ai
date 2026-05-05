import { useState } from "react";
import { Star, Send } from "lucide-react";
import toast from "react-hot-toast";
import { submitFeedback } from "../services/feedbackService";

const FeedbackForm = ({ complaint, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!complaint || !["Resolved", "Closed"].includes(complaint.status)) {
    return null;
  }

  if (complaint.feedbackGiven) {
    return (
      <div className="feedback-card">
        <h3>Feedback Already Submitted</h3>
        <p>Thank you for helping improve civic services.</p>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await submitFeedback({
        complaintId: complaint._id,
        rating,
        comment,
      });

      toast.success("Feedback submitted successfully");
      setComment("");
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Feedback submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-card">
      <h3>Give Feedback</h3>
      <p>Rate the resolution quality for this complaint.</p>

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="rating-row">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              type="button"
              key={value}
              className={value <= rating ? "star-btn active" : "star-btn"}
              onClick={() => setRating(value)}
            >
              <Star size={22} />
            </button>
          ))}
          <strong>{rating}/5</strong>
        </div>

        <textarea
          placeholder="Write your feedback..."
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />

        <button className="primary-btn" disabled={submitting}>
          <Send size={18} />
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;