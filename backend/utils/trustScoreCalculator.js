const clampTrustScore = (score) => {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return score;
};

const getTrustScoreAfterFeedback = (currentScore = 50, rating = 3) => {
  let change = 0;

  if (rating >= 5) change = 5;
  else if (rating === 4) change = 3;
  else if (rating === 3) change = 0;
  else if (rating === 2) change = -2;
  else if (rating === 1) change = -4;

  return clampTrustScore(Number(currentScore || 50) + change);
};

const getTrustBadge = (score = 50) => {
  if (score >= 85) return "Trusted Reporter";
  if (score >= 65) return "Reliable Citizen";
  if (score >= 40) return "Normal Citizen";
  return "Needs Review";
};

module.exports = {
  clampTrustScore,
  getTrustScoreAfterFeedback,
  getTrustBadge,
};