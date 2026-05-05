const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["citizen", "department_officer", "admin", "super_admin"],
      default: "citizen",
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    trustBadge: {
      type: String,
      default: "Normal Citizen",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ✅ Admin approval system
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== "admin";
      },
    },

    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: function () {
        return this.role === "admin" ? "Pending" : "Approved";
      },
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Password hash before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Public profile
userSchema.methods.getPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    city: this.city,
    address: this.address,
    profileImage: this.profileImage,
    trustScore: this.trustScore,
    trustBadge: this.trustBadge,
    isActive: this.isActive,
    isApproved: this.isApproved,
    approvalStatus: this.approvalStatus,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);

module.exports = User;