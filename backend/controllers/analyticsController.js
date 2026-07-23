const asyncHandler = require("../utils/asyncHandler");
const Expense = require("../models/Expense");
const { calculateAnalytics } = require("../services/analyticsService");

const getAnalytics = asyncHandler(async (req, res) => {
    const expenses = await Expense.find({
        user: req.user.id,
    });

    const analytics = calculateAnalytics(expenses);

    res.status(200).json({
        success: true,
        analytics,
    });
});

module.exports = {
    getAnalytics,
};