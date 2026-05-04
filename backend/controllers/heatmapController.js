const HeatmapZone = require("../models/HeatmapZone");
const {
  regenerateHeatmapZones,
  getPublicHeatmapData,
} = require("../services/heatmapService");

const getPublicHeatmap = async (req, res, next) => {
  try {
    const heatmapData = await getPublicHeatmapData();

    return res.status(200).json({
      success: true,
      message: "Public civic heatmap data fetched successfully.",
      ...heatmapData,
    });
  } catch (error) {
    next(error);
  }
};

const regenerateHeatmap = async (req, res, next) => {
  try {
    const zones = await regenerateHeatmapZones();

    return res.status(200).json({
      success: true,
      message: "Heatmap zones regenerated successfully.",
      count: zones.length,
      zones,
    });
  } catch (error) {
    next(error);
  }
};

const getSavedHeatmapZones = async (req, res, next) => {
  try {
    const zones = await HeatmapZone.find({})
      .populate("complaints", "complaintId title category urgency status")
      .sort({ totalComplaints: -1 });

    return res.status(200).json({
      success: true,
      count: zones.length,
      zones,
    });
  } catch (error) {
    next(error);
  }
};

const getHighPriorityZones = async (req, res, next) => {
  try {
    const zones = await HeatmapZone.find({
      heatLevel: "Red",
    })
      .populate("complaints", "complaintId title category urgency status")
      .sort({ highPriorityCount: -1 });

    return res.status(200).json({
      success: true,
      count: zones.length,
      zones,
    });
  } catch (error) {
    next(error);
  }
};

const getResolvedZones = async (req, res, next) => {
  try {
    const zones = await HeatmapZone.find({
      resolvedCount: { $gt: 0 },
    })
      .populate("complaints", "complaintId title category urgency status")
      .sort({ resolvedCount: -1 });

    return res.status(200).json({
      success: true,
      count: zones.length,
      zones,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicHeatmap,
  regenerateHeatmap,
  getSavedHeatmapZones,
  getHighPriorityZones,
  getResolvedZones,
};