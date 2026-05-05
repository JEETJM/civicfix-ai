import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";
import { getDashboardPathByRole, USER_ROLES } from "../utils/rolePermissions";
import { uploadProfileImage } from "../services/uploadService";

const Register = () => {
  const { register, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: USER_ROLES.CITIZEN,
    city: "",
    address: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const avatarLetter = formData.name?.charAt(0)?.toUpperCase() || "U";

  const handleChange = (event) => {
    setError("");

    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      const message = "Only JPG, PNG, and WEBP images are allowed.";
      setError(message);
      toast.error(message);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const message = "Profile image must be less than 5MB.";
      setError(message);
      toast.error(message);
      return;
    }

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setProfileImage(null);
    setProfilePreview("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Full name is required.");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email address is required.");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const registeredUser = await register(formData, { silent: true });

      if (profileImage) {
        await uploadProfileImage(profileImage);
        await refreshProfile();
      }

      // ✅ Admin registration pending approval
      if (registeredUser.role === USER_ROLES.ADMIN) {
        await logout({ silent: true });

        toast.success(
          "Admin request submitted. Please wait for Super Admin approval."
        );

        navigate("/admin-login", { replace: true });
        return;
      }

      toast.success("Account created successfully");
      navigate(getDashboardPathByRole(registeredUser.role), { replace: true });
    } catch (err) {
      const message = err.message || "Registration failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card wide-auth-card">
        <div className="auth-brand">
          <ShieldCheck size={36} />
          <h1>Create Account</h1>
          <p>Register as a citizen, department officer, or admin.</p>
        </div>

        <div className="register-profile-upload">
          <div className="register-avatar-wrap">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile preview"
                className="register-avatar-img"
              />
            ) : (
              <div className="register-avatar-letter">{avatarLetter}</div>
            )}

            <label className="register-camera-btn">
              <Camera size={18} />
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="register-upload-info">
            <strong>Profile Picture</strong>
            <p>Upload a clear profile image. You can also skip this now.</p>

            <div className="register-upload-actions">
              <label className="mini-upload-btn">
                <Camera size={16} />
                Choose Photo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                />
              </label>

              {profilePreview && (
                <button
                  type="button"
                  className="mini-remove-btn"
                  onClick={removeSelectedImage}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form two-column-form">
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Account Type
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value={USER_ROLES.CITIZEN}>Citizen</option>
              <option value={USER_ROLES.DEPARTMENT_OFFICER}>
                Department Officer
              </option>
              <option value={USER_ROLES.ADMIN}>
                Admin Request
              </option>
            </select>
          </label>

          <label>
            City
            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
            />
          </label>

          <label className="full-field">
            Address
            <input
              type="text"
              name="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>

          {formData.role === USER_ROLES.ADMIN && (
            <div className="admin-approval-note full-field">
              Admin account will be created as pending. You can login only after
              Super Admin approval.
            </div>
          )}

          <button className="auth-submit full-field" disabled={loading}>
            <UserPlus size={18} />
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Citizen Login</Link>
        </p>

        <p className="auth-switch small-auth-links">
          Admin? <Link to="/admin-login">Admin Login</Link> · Super Admin?{" "}
          <Link to="/super-admin-login">Super Admin Login</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;