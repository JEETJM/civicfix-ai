const {
  getSummaryStats,
  getCategoryWiseStats,
  getStatusWiseStats,
  getUrgencyWiseStats,
  getDepartmentWiseStats,
  getAreaWiseStats,
  getRecentComplaints,
  getPriorityScoreStats,
} = require("../services/analyticsService");

const getAnalyticsSummary = async (req, res, next) => {
  try {
    const summary = await getSummaryStats();

    return res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardAnalytics = async (req, res, next) => {
  try {
    const [
      summary,
      categoryWise,
      statusWise,
      urgencyWise,
      departmentWise,
      areaWise,
      priorityScoreStats,
      recentComplaints,
    ] = await Promise.all([
      getSummaryStats(),
      getCategoryWiseStats(),
      getStatusWiseStats(),
      getUrgencyWiseStats(),
      getDepartmentWiseStats(),
      getAreaWiseStats(),
      getPriorityScoreStats(),
      getRecentComplaints(8),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        summary,
        categoryWise,
        statusWise,
        urgencyWise,
        departmentWise,
        areaWise,
        priorityScoreStats,
        recentComplaints,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryAnalytics = async (req, res, next) => {
  try {
    const data = await getCategoryWiseStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getStatusAnalytics = async (req, res, next) => {
  try {
    const data = await getStatusWiseStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getUrgencyAnalytics = async (req, res, next) => {
  try {
    const data = await getUrgencyWiseStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentAnalytics = async (req, res, next) => {
  try {
    const data = await getDepartmentWiseStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAreaAnalytics = async (req, res, next) => {
  try {
    const data = await getAreaWiseStats();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentComplaintAnalytics = async (req, res, next) => {
  try {
    const limit = req.query.limit || 10;
    const complaints = await getRecentComplaints(limit);

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalyticsSummary,
  getDashboardAnalytics,
  getCategoryAnalytics,
  getStatusAnalytics,
  getUrgencyAnalytics,
  getDepartmentAnalytics,
  getAreaAnalytics,
  getRecentComplaintAnalytics,
};