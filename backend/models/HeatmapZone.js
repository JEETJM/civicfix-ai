const mongoose = require("mongoose");

const heatmapZoneSchema = new mongoose.Schema(
  {
    zoneName: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: String,
      required: true,
      trim: true,
    },

    totalComplaints: {
      type: Number,
      default: 0,
    },

    highPriorityCount: {
      type: Number,
      default: 0,
    },

    mediumPriorityCount: {
      type: Number,
      default: 0,
    },

    lowPriorityCount: {
      type: Number,
      default: 0,
    },

    resolvedCount: {
      type: Number,
      default: 0,
    },

    pendingCount: {
      type: Number,
      default: 0,
    },

    heatLevel: {
      type: String,
      enum: ["Red", "Yellow", "Green"],
      default: "Green",
    },

    centerLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    complaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const HeatmapZone = mongoose.model("HeatmapZone", heatmapZoneSchema);

module.exports = HeatmapZone;