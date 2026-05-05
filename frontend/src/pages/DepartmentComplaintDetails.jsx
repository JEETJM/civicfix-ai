import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Save,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getAssignedDepartmentComplaintDetails,
  updateDepartmentComplaintStatus,
  uploadDepartmentProof,
} from "../services/departmentPanelService";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";
import ComplaintTimeline from "../components/ComplaintTimeline";

const DepartmentComplaintDetails = () => {
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(true);

  const [statusData, setStatusData] = useState({
    status: "In Progress",
    workRemark: "",
  });

  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [beforePreview, setBeforePreview] = useState("");
  const [afterPreview, setAfterPreview] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);

  const fetchDetails = async () => {
    try {
      const data = await getAssignedDepartmentComplaintDetails(id);
      setComplaint(data.complaint);
      setTimeline(data.timeline || []);
      setProof(data.proof || null);

      setStatusData({
        status: data.complaint?.status || "In Progress",
        workRemark: data.complaint?.departmentRemark || "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to load complaint");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleStatusChange = (event) => {
    setStatusData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    if (type === "before") {
      setBeforeImage(file);
      setBeforePreview(URL.createObjectURL(file));
    }

    if (type === "after") {
      setAfterImage(file);
      setAfterPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateStatus = async (event) => {
    event.preventDefault();
    setSavingStatus(true);

    try {
      await updateDepartmentComplaintStatus(id, statusData);
      toast.success("Status updated successfully");
      fetchDetails();
    } catch (error) {
      toast.error(error.message || "Status update failed");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleUploadProof = async (type) => {
    const imageFile = type === "before" ? beforeImage : afterImage;

    if (!imageFile) {
      toast.error(`Please choose ${type} image first.`);
      return;
    }

    setUploadingProof(true);

    try {
      await uploadDepartmentProof(id, imageFile, {
        proofType: type,
        workRemark: statusData.workRemark,
      });

      toast.success(`${type} proof uploaded successfully`);

      if (type === "before") {
        setBeforeImage(null);
        setBeforePreview("");
      }

      if (type === "after") {
        setAfterImage(null);
        setAfterPreview("");
      }

      fetchDetails();
    } catch (error) {
      toast.error(error.message || "Proof upload failed");
    } finally {
      setUploadingProof(false);
    }
  };

  const handleMarkResolved = async () => {
    setSavingStatus(true);

    try {
      await updateDepartmentComplaintStatus(id, {
        status: "Resolved",
        workRemark:
          statusData.workRemark ||
          "Work completed and complaint marked as resolved.",
      });

      toast.success("Complaint marked as resolved");
      fetchDetails();
    } catch (error) {
      toast.error(error.message || "Failed to mark resolved");
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) return <Loader text="Loading department work panel..." />;

  if (!complaint) {
    return (
      <main className="simple-page">
        <section className="simple-card">
          <h1>Complaint not found</h1>
          <Link className="primary-btn" to="/department/complaints">
            Back
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="department-panel-page">
      <Link to="/department/complaints" className="back-link">
        <ArrowLeft size={18} />
        Back to Assigned Complaints
      </Link>

      <section className="department-details-hero">
        <div>
          <span className="complaint-id">{complaint.complaintId}</span>
          <h1>{complaint.title}</h1>

          <div className="details-badges">
            <StatusBadge status={complaint.status} />
            <UrgencyBadge urgency={complaint.urgency} />
          </div>
        </div>

        <div className="department-score-box">
          <ClipboardCheck size={28} />
          <small>AI Priority</small>
          <strong>{complaint.aiScore}/100</strong>
        </div>
      </section>

      <div className="department-details-layout">
        <section className="department-main">
          <div className="department-card">
            <h2>Complaint Details</h2>
            <p>{complaint.description}</p>

            <div className="department-info-grid">
              <div>
                <strong>{complaint.category}</strong>
                <span>Category</span>
              </div>

              <div>
                <strong>{complaint.department}</strong>
                <span>Department</span>
              </div>

              <div>
                <strong>{complaint.location?.address || "N/A"}</strong>
                <span>Location</span>
              </div>
            </div>
          </div>

          <div className="department-card">
            <h2>Before / After Proof</h2>

            <div className="proof-grid">
              <div className="proof-box">
                <h3>Before Work</h3>

                {proof?.beforeImageUrl || beforePreview ? (
                  <img
                    src={beforePreview || proof.beforeImageUrl}
                    alt="Before work"
                  />
                ) : (
                  <div className="proof-placeholder">
                    <Camera size={28} />
                    <p>No before proof uploaded</p>
                  </div>
                )}

                <label className="proof-upload-btn">
                  <UploadCloud size={18} />
                  Choose Before Image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => handleFileChange(event, "before")}
                  />
                </label>

                <button
                  className="secondary-action-btn"
                  onClick={() => handleUploadProof("before")}
                  disabled={uploadingProof}
                >
                  Upload Before Proof
                </button>
              </div>

              <div className="proof-box">
                <h3>After Work</h3>

                {proof?.afterImageUrl || afterPreview ? (
                  <img
                    src={afterPreview || proof.afterImageUrl}
                    alt="After work"
                  />
                ) : (
                  <div className="proof-placeholder">
                    <Camera size={28} />
                    <p>No after proof uploaded</p>
                  </div>
                )}

                <label className="proof-upload-btn">
                  <UploadCloud size={18} />
                  Choose After Image
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(event) => handleFileChange(event, "after")}
                  />
                </label>

                <button
                  className="secondary-action-btn"
                  onClick={() => handleUploadProof("after")}
                  disabled={uploadingProof}
                >
                  Upload After Proof
                </button>
              </div>
            </div>
          </div>

          <div className="department-card">
            <h2>Timeline</h2>
            <ComplaintTimeline timeline={timeline} />
          </div>
        </section>

        <aside className="department-card">
          <h2>Work Update Panel</h2>

          <form className="department-update-form" onSubmit={handleUpdateStatus}>
            <label>
              Work Status
              <select
                name="status"
                value={statusData.status}
                onChange={handleStatusChange}
              >
                <option value="Assigned to Department">Assigned to Department</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
              </select>
            </label>

            <label>
              Work Remark
              <textarea
                name="workRemark"
                placeholder="Write work progress remark..."
                value={statusData.workRemark}
                onChange={handleStatusChange}
              />
            </label>

            <button className="primary-btn" disabled={savingStatus}>
              <Save size={18} />
              {savingStatus ? "Saving..." : "Save Status"}
            </button>

            <button
              type="button"
              className="resolve-btn"
              disabled={savingStatus}
              onClick={handleMarkResolved}
            >
              <CheckCircle2 size={18} />
              Mark as Resolved
            </button>
          </form>

          <div className="proof-status-box">
            <strong>Proof Status</strong>
            <span>{proof?.proofStatus || "Pending"}</span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default DepartmentComplaintDetails;