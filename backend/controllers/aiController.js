const { analyzeOnly } = require("../services/aiPriorityService");

const analyzeComplaint = async (req, res, next) => {
  try {
    const { title, description, category = "" } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error("Title and description are required.");
    }

    const analysis = analyzeOnly({
      title,
      description,
      selectedCategory: category,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint analyzed successfully.",
      analysis,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeComplaint,
};