const COMPLAINT_CATEGORIES = {
  ROAD: "road",
  SANITATION: "sanitation",
  DRAINAGE: "drainage",
  ELECTRICITY: "electricity",
  WATER: "water",
  SAFETY: "safety",
  ENVIRONMENT: "environment",
  TRAFFIC: "traffic",
  HEALTH: "health",
  OTHER: "other",
};

const ALL_COMPLAINT_CATEGORIES = Object.values(COMPLAINT_CATEGORIES);

module.exports = {
  COMPLAINT_CATEGORIES,
  ALL_COMPLAINT_CATEGORIES,
};