import api from "./api";

export const getPublicHeatmapData = async () => {
  const { data } = await api.get("/heatmap/public");
  return data;
};

export const regenerateHeatmapZones = async () => {
  const { data } = await api.post("/heatmap/regenerate");
  return data;
};

export const getSavedHeatmapZones = async () => {
  const { data } = await api.get("/heatmap/zones");
  return data;
};