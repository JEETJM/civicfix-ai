import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import {
  getEscalations,
  runAutoEscalationCheck,
  updateEscalationStatus,
} from "../services/escalationService";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

const EscalationCenter = () => {
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const fetchEscalations = async () => {
    try {
      const data = await getEscalations();
      setEscalations(data.escalations || []);
    } catch (error) {
      toast.error(error.message || "Failed to load escalations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
  }, []);

  const handleRunCheck = async () => {
    setChecking(true);

    try {
      const data = await runAutoEscalationCheck();
      toast.success(`Auto check complete. ${data.escalatedCount} escalated.`);
      fetchEscalations();
    } catch (error) {
      toast.error(error.message || "Auto escalation failed");
    } finally {
      setChecking(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEscalationStatus(id, { status });
      toast.success("Escalation status updated");
      fetchEscalations();
    } catch (error) {
      toast.error(error.message || "Update failed");
    }
  };

  if (loading) {
    return <Loader text="Loading escalation center..." />;
  }

  return (
    <main className="escalation-page">
      <section className="escalation-header">
        <div>
          <span>Admin Escalation</span>
          <h1>Escalation Center</h1>
          <p>Review unresolved high-priority complaints and escalation logs.</p>
        </div>

        <button className="primary-btn" onClick={handleRunCheck} disabled={checking}>
          <RefreshCw size={18} />
          {checking ? "Checking..." : "Run Auto Check"}
        </button>
      </section>

      {escalations.length === 0 ? (
        <EmptyState
          title="No escalations yet"
          message="Run auto check or manually escalate complaints from admin panel."
        />
      ) : (
        <section className="escalation-list">
          {escalations.map((item) => (
            <article className="escalation-card" key={item._id}>
              <div className="escalation-icon">
                <ShieldAlert size={28} />
              </div>

              <div className="escalation-content">
                <span className="complaint-id">{item.complaintId}</span>
                <h3>{item.complaint?.title || "Complaint"}</h3>
                <p>{item.reason}</p>

                <div className="escalation-meta">
                  <span>{item.escalationType}</span>
                  <span>{item.oldLevel} → {item.newLevel}</span>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="escalation-action">
                <AlertTriangle size={22} />
                <select
                  value={item.status}
                  onChange={(event) =>
                    handleStatusChange(item._id, event.target.value)
                  }
                >
                  <option value="Open">Open</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
};

export default EscalationCenter;