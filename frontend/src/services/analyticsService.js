import api from "./api";

export const getAnalyticsSummary = async () => {
  const { data } = await api.get("/analytics/summary");
  return data;
};

export const getDashboardAnalytics = async () => {
  const { data } = await api.get("/analytics/dashboard");
  return data;
};

export const getRecentAnalyticsComplaints = async () => {
  const { data } = await api.get("/analytics/recent");
  return data;
};