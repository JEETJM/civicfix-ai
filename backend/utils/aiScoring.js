const { COMPLAINT_CATEGORIES } = require("../constants/complaintCategories");
const { URGENCY_LEVELS } = require("../constants/urgencyLevels");
const { getDepartmentByCategory } = require("./departmentMapper");

const keywordRules = {
  [COMPLAINT_CATEGORIES.ROAD]: [
    "road",
    "pothole",
    "broken road",
    "crack",
    "footpath",
    "accident",
    "main road",
    "highway",
    "gari",
    "rasta",
    "khana",
    "potholes",
  ],

  [COMPLAINT_CATEGORIES.SANITATION]: [
    "garbage",
    "waste",
    "dustbin",
    "dirty",
    "trash",
    "dumping",
    "bad smell",
    "kharap gondho",
    "moyla",
    "aborjona",
  ],

  [COMPLAINT_CATEGORIES.DRAINAGE]: [
    "drain",
    "drainage",
    "sewage",
    "blocked drain",
    "water stuck",
    "overflow",
    "nala",
    "blocked nala",
    "sewer",
  ],

  [COMPLAINT_CATEGORIES.ELECTRICITY]: [
    "streetlight",
    "light",
    "electric",
    "wire",
    "open wire",
    "pole",
    "shock",
    "electricity",
    "current",
    "dark road",
    "street light",
  ],

  [COMPLAINT_CATEGORIES.WATER]: [
    "water",
    "pipe",
    "leakage",
    "no water",
    "dirty water",
    "contaminated",
    "pipe burst",
    "jal",
    "pani",
  ],

  [COMPLAINT_CATEGORIES.SAFETY]: [
    "unsafe",
    "danger",
    "dangerous",
    "accident risk",
    "open manhole",
    "broken railing",
    "collapse",
    "hazard",
    "risk",
  ],

  [COMPLAINT_CATEGORIES.ENVIRONMENT]: [
    "tree",
    "park",
    "pollution",
    "environment",
    "fallen tree",
    "illegal cutting",
    "garden",
    "green",
  ],

  [COMPLAINT_CATEGORIES.TRAFFIC]: [
    "traffic",
    "signal",
    "parking",
    "jam",
    "congestion",
    "road block",
    "illegal parking",
    "signal not working",
  ],

  [COMPLAINT_CATEGORIES.HEALTH]: [
    "mosquito",
    "dengue",
    "malaria",
    "dirty water",
    "health",
    "hygiene",
    "disease",
    "infection",
    "medical risk",
  ],

  [COMPLAINT_CATEGORIES.OTHER]: [
    "other",
    "unclear",
    "unknown",
    "general",
  ],
};

const criticalKeywords = [
  "shock",
  "open wire",
  "electric hazard",
  "fire",
  "collapse",
  "open manhole",
  "accident",
  "school",
  "hospital",
  "main road",
  "bridge",
  "danger",
  "life risk",
  "injury",
  "emergency",
];

const highRiskKeywords = [
  "waterlogging",
  "overflow",
  "blocked",
  "traffic jam",
  "near school",
  "near hospital",
  "big pothole",
  "unsafe",
  "dengue",
  "mosquito",
  "night",
  "dark road",
];

const mediumRiskKeywords = [
  "garbage",
  "dirty",
  "dustbin",
  "park",
  "streetlight",
  "leakage",
  "footpath",
];

const normalizeText = (text = "") => {
  return text.toString().toLowerCase().trim();
};

const findMatchedKeywords = (text, keywords) => {
  return keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
};

const detectCategory = (title = "", description = "") => {
  const text = normalizeText(`${title} ${description}`);

  let bestCategory = COMPLAINT_CATEGORIES.OTHER;
  let bestMatches = [];

  Object.entries(keywordRules).forEach(([category, keywords]) => {
    const matches = findMatchedKeywords(text, keywords);

    if (matches.length > bestMatches.length) {
      bestCategory = category;
      bestMatches = matches;
    }
  });

  return {
    category: bestCategory,
    matchedKeywords: bestMatches,
  };
};

const calculateScore = ({ title = "", description = "", category }) => {
  const text = normalizeText(`${title} ${description}`);

  let score = 35;
  const riskFactors = [];

  const criticalMatches = findMatchedKeywords(text, criticalKeywords);
  const highMatches = findMatchedKeywords(text, highRiskKeywords);
  const mediumMatches = findMatchedKeywords(text, mediumRiskKeywords);

  if (criticalMatches.length > 0) {
    score += 40;
    riskFactors.push(`Critical risk keywords found: ${criticalMatches.join(", ")}`);
  }

  if (highMatches.length > 0) {
    score += 25;
    riskFactors.push(`High risk keywords found: ${highMatches.join(", ")}`);
  }

  if (mediumMatches.length > 0) {
    score += 12;
    riskFactors.push(`Medium risk keywords found: ${mediumMatches.join(", ")}`);
  }

  if (category === COMPLAINT_CATEGORIES.ELECTRICITY) {
    score += 15;
    riskFactors.push("Electrical issues can create safety risks.");
  }

  if (category === COMPLAINT_CATEGORIES.SAFETY) {
    score += 18;
    riskFactors.push("Public safety issue detected.");
  }

  if (category === COMPLAINT_CATEGORIES.HEALTH) {
    score += 14;
    riskFactors.push("Public health risk detected.");
  }

  if (category === COMPLAINT_CATEGORIES.ROAD && text.includes("accident")) {
    score += 12;
    riskFactors.push("Road issue has accident risk.");
  }

  if (category === COMPLAINT_CATEGORIES.DRAINAGE && text.includes("overflow")) {
    score += 10;
    riskFactors.push("Drainage overflow can affect nearby citizens.");
  }

  score = Math.min(score, 100);

  let urgencyLevel = "Low";

  if (score >= 85) {
    urgencyLevel = URGENCY_LEVELS.CRITICAL;
  } else if (score >= 70) {
    urgencyLevel = URGENCY_LEVELS.HIGH;
  } else if (score >= 45) {
    urgencyLevel = URGENCY_LEVELS.MEDIUM;
  } else {
    urgencyLevel = URGENCY_LEVELS.LOW;
  }

  return {
    score,
    urgencyLevel,
    riskFactors,
  };
};

const generateAIReason = ({ category, urgencyLevel, score, matchedKeywords, riskFactors }) => {
  const department = getDepartmentByCategory(category);

  const keywordText =
    matchedKeywords.length > 0
      ? `Detected keywords: ${matchedKeywords.join(", ")}.`
      : "No strong category keyword found, so it may need manual review.";

  const riskText =
    riskFactors.length > 0
      ? riskFactors.join(" ")
      : "The issue appears to be normal priority based on the description.";

  return `${keywordText} The complaint is classified as ${category} and routed to ${department}. Urgency is ${urgencyLevel} with AI score ${score}/100. ${riskText}`;
};

const analyzeComplaintText = ({ title = "", description = "", selectedCategory = "" }) => {
  const detected = detectCategory(title, description);

  const finalCategory =
    selectedCategory && selectedCategory !== "other"
      ? selectedCategory
      : detected.category;

  const matchedKeywords =
    selectedCategory && selectedCategory !== "other"
      ? findMatchedKeywords(
          normalizeText(`${title} ${description}`),
          keywordRules[finalCategory] || []
        )
      : detected.matchedKeywords;

  const scoreData = calculateScore({
    title,
    description,
    category: finalCategory,
  });

  const department = getDepartmentByCategory(finalCategory);

  const aiReason = generateAIReason({
    category: finalCategory,
    urgencyLevel: scoreData.urgencyLevel,
    score: scoreData.score,
    matchedKeywords,
    riskFactors: scoreData.riskFactors,
  });

  return {
    category: finalCategory,
    urgency: scoreData.urgencyLevel,
    aiScore: scoreData.score,
    department,
    detectedKeywords: matchedKeywords,
    riskFactors: scoreData.riskFactors,
    aiReason,
  };
};

module.exports = {
  analyzeComplaintText,
  detectCategory,
  calculateScore,
};