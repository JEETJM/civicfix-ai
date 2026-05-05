import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Brain,
  FilePlus2,
  ImagePlus,
  LocateFixed,
  MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import { analyzeComplaint } from "../services/aiService";
import { createComplaint } from "../services/complaintService";
import PriorityScoreCard from "../components/PriorityScoreCard";
import DuplicateAlertBox from "../components/DuplicateAlertBox";

const categoryOptions = [
  { value: "", label: "Auto Detect by AI" },
  { value: "road", label: "Road" },
  { value: "sanitation", label: "Sanitation" },
  { value: "drainage", label: "Drainage" },
  { value: "electricity", label: "Streetlight & Electricity" },
  { value: "water", label: "Water Supply" },
  { value: "safety", label: "Public Safety" },
  { value: "environment", label: "Parks & Environment" },
  { value: "traffic", label: "Traffic" },
  { value: "health", label: "Health & Hygiene" },
  { value: "other", label: "Other" },
];

const ReportIssue = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    address: "",
    city: "Kolkata",
    state: "West Bengal",
    lat: "",
    lng: "",
  });

  const [analysis, setAnalysis] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const validateBasic = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }

    if (formData.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (formData.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters");
      return false;
    }

    if (!formData.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    return true;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        toast.success("Location captured successfully");
        setLocationLoading(false);
      },
      () => {
        toast.error("Unable to get location. Please enter manually.");
        setLocationLoading(false);
      }
    );
  };

  const handleAnalyze = async () => {
    if (!validateBasic()) return;

    setAnalyzing(true);
    setAnalysis(null);

    try {
      const data = await analyzeComplaint({
        title: formData.title,
        description: formData.description,
        category: formData.category,
      });

      setAnalysis(data.analysis);
      toast.success("AI analysis completed");
    } catch (error) {
      toast.error(error.message || "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateBasic()) return;

    setSubmitting(true);
    setDuplicate(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          lat: formData.lat ? Number(formData.lat) : null,
          lng: formData.lng ? Number(formData.lng) : null,
        },
      };

      const data = await createComplaint(payload);

      setAnalysis({
        category: data.complaint.category,
        urgency: data.complaint.urgency,
        aiScore: data.complaint.aiScore,
        department: data.complaint.department,
        aiReason: data.complaint.aiReason,
      });

      setDuplicate(data.duplicate);

      toast.success("Complaint submitted successfully");

      setTimeout(() => {
        navigate(`/complaints/${data.complaint._id}`);
      }, 900);
    } catch (error) {
      toast.error(error.message || "Complaint submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="complaint-page">
      <section className="complaint-header">
        <div>
          <span>Citizen Complaint</span>
          <h1>Report a Civic Issue</h1>
          <p>
            Submit issue details with location. CivicFix AI will analyze
            category, priority, urgency, and department routing.
          </p>
        </div>
      </section>

      <div className="complaint-layout">
        <section className="complaint-form-card">
          <form onSubmit={handleSubmit} className="complaint-form">
            <label className="full-field">
              Issue Title
              <input
                type="text"
                name="title"
                placeholder="Example: Open electric wire near school"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>

            <label className="full-field">
              Description
              <textarea
                name="description"
                placeholder="Describe the issue clearly..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Category
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categoryOptions.map((item) => (
                  <option value={item.value} key={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Image URL
              <div className="input-with-icon">
                <ImagePlus size={18} />
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="Paste image URL or leave blank"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label className="full-field">
              Address
              <div className="input-with-icon">
                <MapPin size={18} />
                <input
                  type="text"
                  name="address"
                  placeholder="Enter exact issue location"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label>
              City
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
              />
            </label>

            <label>
              State
              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
              />
            </label>

            <label>
              Latitude
              <input
                type="number"
                step="any"
                name="lat"
                placeholder="Auto/manual latitude"
                value={formData.lat}
                onChange={handleChange}
              />
            </label>

            <label>
              Longitude
              <input
                type="number"
                step="any"
                name="lng"
                placeholder="Auto/manual longitude"
                value={formData.lng}
                onChange={handleChange}
              />
            </label>

            <button
              type="button"
              className="secondary-action-btn full-field"
              onClick={handleGetLocation}
              disabled={locationLoading}
            >
              <LocateFixed size={18} />
              {locationLoading ? "Getting location..." : "Use My Current Location"}
            </button>

            <div className="form-actions full-field">
              <button
                type="button"
                className="secondary-btn"
                onClick={handleAnalyze}
                disabled={analyzing}
              >
                <Brain size={18} />
                {analyzing ? "Analyzing..." : "Preview AI Score"}
              </button>

              <button className="primary-btn" disabled={submitting}>
                <FilePlus2 size={18} />
                {submitting ? "Submitting..." : "Submit Complaint"}
              </button>
            </div>
          </form>
        </section>

        <aside className="complaint-side">
          {analysis ? (
            <PriorityScoreCard analysis={analysis} />
          ) : (
            <div className="ai-placeholder">
              <Brain size={42} />
              <h3>AI Analysis Preview</h3>
              <p>
                Fill complaint details and click “Preview AI Score” to see
                category, urgency, department, and AI reason.
              </p>
            </div>
          )}

          <DuplicateAlertBox duplicate={duplicate} />

          <div className="info-note">
            <AlertTriangle size={18} />
            <p>
              For demo, image upload is URL based. Cloudinary real upload will
              be connected later with proof upload phase.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default ReportIssue;