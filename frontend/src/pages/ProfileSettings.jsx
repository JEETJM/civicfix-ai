import { useState } from "react";
import {
  Camera,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { updateMyProfile } from "../services/authService";
import {
  removeProfileImage,
  uploadProfileImage,
} from "../services/uploadService";

const ProfileSettings = () => {
  const { user, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
  });

  const [preview, setPreview] = useState(user?.profileImage || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleProfileImageChange = async (event) => {
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

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      await uploadProfileImage(file);
      await refreshProfile();
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error(error.message || "Profile image upload failed");
      setPreview(user?.profileImage || "");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    setUploading(true);

    try {
      await removeProfileImage();
      setPreview("");
      await refreshProfile();
      toast.success("Profile picture removed");
    } catch (error) {
      toast.error(error.message || "Remove failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await updateMyProfile(formData);
      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div>
          <span>Account Settings</span>
          <h1>Profile Settings</h1>
          <p>Edit your profile information and profile picture.</p>
        </div>
      </section>

      <div className="profile-layout">
        <section className="profile-card profile-photo-card">
          <div className="profile-avatar-wrap">
            {preview ? (
              <img className="profile-avatar-img" src={preview} alt={user?.name} />
            ) : (
              <div className="profile-avatar-letter">{avatarLetter}</div>
            )}

            <label className="profile-camera-btn">
              <Camera size={18} />
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleProfileImageChange}
              />
            </label>
          </div>

          <h2>{user?.name}</h2>
          <p>{user?.email}</p>

          <div className="profile-role-pill">
            <ShieldCheck size={16} />
            {user?.role?.replaceAll("_", " ")}
          </div>

          <div className="profile-photo-actions">
            <label className="primary-btn profile-upload-btn">
              <Camera size={18} />
              {uploading ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleProfileImageChange}
              />
            </label>

            <button
              type="button"
              className="danger-btn"
              onClick={handleRemoveImage}
              disabled={uploading || !preview}
            >
              <Trash2 size={18} />
              Remove
            </button>
          </div>
        </section>

        <section className="profile-card">
          <h2>Edit Profile</h2>

          <form className="profile-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <div className="profile-input-icon">
                <User size={18} />
                <input
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </label>

            <label>
              Email Address
              <div className="profile-input-icon disabled-field">
                <Mail size={18} />
                <input value={user?.email || ""} disabled />
              </div>
            </label>

            <label>
              Phone Number
              <div className="profile-input-icon">
                <Phone size={18} />
                <input
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              City
              <div className="profile-input-icon">
                <MapPin size={18} />
                <input
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label className="full-field">
              Address
              <textarea
                name="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>

            <button className="primary-btn full-field" disabled={saving}>
              <Save size={18} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ProfileSettings;