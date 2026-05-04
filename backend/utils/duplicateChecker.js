const Complaint = require("../models/Complaint");
const { calculateDistanceInMeters } = require("./locationDistance");

const normalizeText = (text = "") => {
  return text.toString().toLowerCase().trim();
};

const getWords = (text = "") => {
  return normalizeText(text)
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
};

const calculateTextSimilarity = (text1 = "", text2 = "") => {
  const words1 = getWords(text1);
  const words2 = getWords(text2);

  if (words1.length === 0 || words2.length === 0) {
    return 0;
  }

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let commonCount = 0;
  const matchedWords = [];

  set1.forEach((word) => {
    if (set2.has(word)) {
      commonCount++;
      matchedWords.push(word);
    }
  });

  const totalUniqueWords = new Set([...words1, ...words2]).size;
  const similarityScore = Math.round((commonCount / totalUniqueWords) * 100);

  return {
    similarityScore,
    matchedWords,
  };
};

const checkDuplicateComplaint = async ({
  title,
  description,
  category,
  location,
  currentComplaintId = null,
}) => {
  const maxDistanceMeters = 300;
  const minSimilarityScore = 25;

  if (!category || !location) {
    return {
      isDuplicate: false,
      originalComplaint: null,
      similarityScore: 0,
      distanceInMeters: null,
      matchedKeywords: [],
      reason: "Category or location missing.",
    };
  }

  const query = {
    category,
    status: {
      $nin: ["Closed", "Rejected"],
    },
  };

  if (currentComplaintId) {
    query._id = { $ne: currentComplaintId };
  }

  const possibleComplaints = await Complaint.find(query).sort({ createdAt: -1 });

  let bestMatch = null;

  for (const complaint of possibleComplaints) {
    const distance = calculateDistanceInMeters(
      location.lat,
      location.lng,
      complaint.location.lat,
      complaint.location.lng
    );

    if (distance !== null && distance > maxDistanceMeters) {
      continue;
    }

    const textResult = calculateTextSimilarity(
      `${title} ${description}`,
      `${complaint.title} ${complaint.description}`
    );

    const sameAddress =
      normalizeText(location.address).length > 0 &&
      normalizeText(complaint.location.address).length > 0 &&
      (normalizeText(location.address).includes(normalizeText(complaint.location.address)) ||
        normalizeText(complaint.location.address).includes(normalizeText(location.address)));

    let finalScore = textResult.similarityScore;

    if (distance !== null && distance <= 100) {
      finalScore += 25;
    } else if (distance !== null && distance <= 200) {
      finalScore += 15;
    } else if (distance !== null && distance <= 300) {
      finalScore += 8;
    }

    if (sameAddress) {
      finalScore += 20;
    }

    finalScore = Math.min(finalScore, 100);

    if (
      finalScore >= minSimilarityScore &&
      (!bestMatch || finalScore > bestMatch.similarityScore)
    ) {
      bestMatch = {
        originalComplaint: complaint,
        similarityScore: finalScore,
        distanceInMeters: distance || 0,
        matchedKeywords: textResult.matchedWords,
        reason: `Same category detected within nearby area. Similarity score ${finalScore}/100.`,
      };
    }
  }

  if (!bestMatch) {
    return {
      isDuplicate: false,
      originalComplaint: null,
      similarityScore: 0,
      distanceInMeters: null,
      matchedKeywords: [],
      reason: "No duplicate complaint found nearby.",
    };
  }

  return {
    isDuplicate: true,
    ...bestMatch,
  };
};

module.exports = {
  checkDuplicateComplaint,
  calculateTextSimilarity,
};