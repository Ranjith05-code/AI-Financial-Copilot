const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getFinancialAdvice,
    chatWithAI,
    predictCategory,
    scanReceiptHandler,
    getMonthlyReport,
    getYearlyReport,
    getSpendingPrediction,
    getSmartBudgetPlan,
    getDashboardSummary,
    getGoalPlan,
} = require("../controllers/aiController");

router.get("/", protect, getFinancialAdvice);
router.post("/chat", protect, chatWithAI);
router.post("/predict-category", protect, predictCategory);
router.post("/scan-receipt", protect, scanReceiptHandler);
router.get("/monthly-report", protect, getMonthlyReport);
router.get("/yearly-report", protect, getYearlyReport);
router.get("/spending-prediction", protect, getSpendingPrediction);
router.post("/smart-budget", protect, getSmartBudgetPlan);
router.get("/dashboard-summary", protect, getDashboardSummary);
router.post("/goal-plan", protect, getGoalPlan);

module.exports = router;