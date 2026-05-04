const HeatmapZone = require("../models/HeatmapZone");
const {
  buildHeatmapZonesFromComplaints,
  buildMapMarkersFromComplaints,
} = require("../utils/heatmapGenerator");

const regenerateHeatmapZones = async () => {
  const zones = await buildHeatmapZonesFromComplaints();

  await HeatmapZone.deleteMany({});

  if (zones.length === 0) {
    return [];
  }

  const createdZones = await HeatmapZone.insertMany(zones);

  return createdZones;
};

const getPublicHeatmapData = async () => {
  const zones = await buildHeatmapZonesFromComplaints();
  const markers = await buildMapMarkersFromComplaints();

  return {
    zones,
    markers,
  };
};

module.exports = {
  regenerateHeatmapZones,
  getPublicHeatmapData,
};